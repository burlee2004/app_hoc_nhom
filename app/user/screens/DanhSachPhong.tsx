import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from "react-native";
import * as Clipboard from "expo-clipboard";
// @ts-ignore
import { useNavigation } from "@react-navigation/native";
// @ts-ignore
import { StackNavigationProp } from "@react-navigation/stack";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import Layout from "../components/layout";
import styles from "../styles/DanhSachPhongStyles";
import { RootStackParamList } from "./types/RootStackParamList";
import Room from "./types/Room";
import { Message } from "./types/Message";

type DanhSachPhongScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "DanhSachPhong"
>;

export default function DanhSachPhong() {
  const navigation = useNavigation<DanhSachPhongScreenNavigationProp>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [userId, setUserId] = useState("");
  const [nextRoomId, setNextRoomId] = useState(0);
  const [activeTab, setActiveTab] = useState<"owner" | "member">("owner");

  useEffect(() => {
    const fetchUserId = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        setUserId(user.uid);
      }
    };
    fetchUserId();
  }, []);

  const fetchRooms = async () => {
    if (!userId) return;

    const snapshot = await firebase
      .firestore()
      .collection("rooms")
      .where("membersId", "array-contains", userId)
      .get();

    const fetchedRooms = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Room[];
    console.log("Fetched Rooms:", fetchedRooms); // Debug: Kiểm tra dữ liệu
    setRooms(fetchedRooms);

    const maxRoomId = fetchedRooms.reduce((maxId, room) => {
      const roomId = parseInt(room.id, 10);
      return roomId > maxId ? roomId : maxId;
    }, -1);
    setNextRoomId(maxRoomId + 1);
  };

  useEffect(() => {
    fetchRooms();
  }, [userId]);

  const handleDeleteRoom = async (roomId: string) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn giải tán phòng này không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đồng ý",
        onPress: async () => {
          try {
            await firebase.firestore().collection("rooms").doc(roomId).delete();
            setRooms(rooms.filter((room) => room.id !== roomId)); // Cập nhật danh sách phòng
            Alert.alert("Thành công", "Phòng đã được giải tán.");
          } catch (error) {
            console.error("Error deleting room:", error);
            Alert.alert("Lỗi", "Không thể giải tán phòng. Vui lòng thử lại.");
          }
        },
      },
    ]);
  };

  const handleCopyLink = (roomId: string) => {
    Clipboard.setStringAsync(roomId);
    Alert.alert(
      "Đã sao chép",
      "Link tham gia phòng đã được sao chép vào clipboard!"
    );
  };

  const handleJoinRoom = async () => {
    if (roomId.trim() === "") {
      Alert.alert("Lỗi", "Vui lòng nhập mã ID phòng!");
      return;
    }

    const roomRef = firebase.firestore().collection("rooms").doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      Alert.alert("Lỗi", "Phòng không tồn tại!");
      return;
    }
    try {
      await roomRef.update({
        membersId: firebase.firestore.FieldValue.arrayUnion(userId),
      });

      await fetchRooms(); // ✅ Cập nhật lại danh sách phòng

      Alert.alert("Thành công", `Đã tham gia phòng với mã ID: ${roomId}`);
      setRoomId("");
    } catch (error) {
      console.error("Error joining room:", error);
      Alert.alert("Lỗi", "Không thể tham gia phòng. Vui lòng thử lại.");
    }
  };

  const handleCreateRoom = async () => {
    if (roomName.trim() === "") {
      Alert.alert("Lỗi", "Vui lòng nhập tên phòng!");
      return;
    }

    const roomId = firebase.firestore().collection("rooms").doc().id; // ✅ ID duy nhất

    const newRoom: Room = {
      id: roomId,
      name: roomName,
      ownerId: userId,
      membersId: [userId],
      date: new Date(),
      description: "",
      messages: [],
      state: "string",
      avatarUri: "https://default-avatar.com/default-room.png", // Ảnh mặc định
    };

    try {
      await firebase.firestore().collection("rooms").doc(roomId).set(newRoom);
      setRooms([...rooms, newRoom]);
      Alert.alert("Thành công", `Đã tạo phòng: ${roomName}`);
      setRoomName("");
    } catch (error) {
      console.error("Error creating room:", error);
      Alert.alert("Lỗi", "Không thể tạo phòng. Vui lòng thử lại.");
    }
  };

  const renderRoomItem = ({ item }: { item: Room }) => (
    <View style={styles.roomItemContainer}>
      <TouchableOpacity
        style={styles.roomItem}
        onPress={() =>
          navigation.navigate("PhongHoc", {
            roomId: item.id,
            roomName: item.name,
            ownerId: item.ownerId,
            membersId: item.membersId,
          })
        }
      >
        <Image
          source={{
            uri:
              item.avatarUri && item.avatarUri.startsWith("http")
                ? item.avatarUri
                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", // fallback ảnh thật
          }}
          style={styles.roomAvatar}
        />
        <Text style={styles.roomName}>{item.name}</Text>
      </TouchableOpacity>
      {item.ownerId === userId && (
        <View style={styles.ownerActions}>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={() => handleCopyLink(item.id)}
          >
            <Text style={styles.buttonText}>📋 Link</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteRoom(item.id)}
          >
            <Text style={styles.buttonText}>🗑️ Giải tán</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.header}>Danh sách phòng học</Text>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "owner" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("owner")}
          >
            <Text style={styles.tabText}>Phòng của tôi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "member" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("member")}
          >
            <Text style={styles.tabText}>Phòng đã tham gia</Text>
          </TouchableOpacity>
        </View>

        {/* Hiển thị danh sách phòng theo tab */}
        <FlatList
          data={
            activeTab === "owner"
              ? rooms.filter((room) => room.ownerId === userId)
              : rooms.filter((room) => room.ownerId !== userId)
          }
          keyExtractor={(item) => item.id}
          renderItem={renderRoomItem}
          style={styles.roomList}
        />

        {/* Form tạo phòng & tham gia phòng */}
        <View style={styles.actionContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tên phòng mới"
            value={roomName}
            onChangeText={setRoomName}
          />
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateRoom}
          >
            <Text style={styles.buttonText}>Tạo phòng</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Nhập link hoặc ID phòng"
            value={roomId}
            onChangeText={setRoomId}
          />
          <TouchableOpacity style={styles.joinButton} onPress={handleJoinRoom}>
            <Text style={styles.buttonText}>Tham gia phòng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
}
