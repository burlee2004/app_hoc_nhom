import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
} from "react-native";
// @ts-ignore
import { useNavigation } from "@react-navigation/native";
// @ts-ignore
import { RouteProp, useRoute } from "@react-navigation/native";
// @ts-ignore
import { StackNavigationProp } from "@react-navigation/stack";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { RootStackParamList } from "../screens/types/RootStackParamList";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

const CLOUD_NAME = "dzysrtemd";
const API_KEY = "981718876592958";
const UPLOAD_PRESET = "vfk2qscm";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

type ChiTietPhongScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ChiTietPhong"
>;
type ChiTietPhongScreenRouteProp = RouteProp<
  RootStackParamList,
  "ChiTietPhong"
>;

const ChiTietPhong = () => {
  const navigation = useNavigation<ChiTietPhongScreenNavigationProp>();
  const route = useRoute<ChiTietPhongScreenRouteProp>();
  const { roomId, roomName } = route.params;

  const [ownerId, setOwnerId] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("Đang tải...");
  const [members, setMembers] = useState<{ id: string; name: string }[]>([]);
  const [roomImage, setRoomImage] = useState<string>(""); // Trạng thái lưu ảnh phòng
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const roomRef = firebase.firestore().collection("rooms").doc(roomId);
        const roomDoc = await roomRef.get();

        if (roomDoc.exists) {
          const roomData = roomDoc.data();
          const ownerId = roomData?.ownerId;
          const membersId = roomData?.membersId || [];

          setOwnerId(ownerId);
          setRoomImage(roomData?.avatarUri || ""); // fix chỗ này luôn
          // Lấy thông tin trưởng phòng
          const ownerDoc = await firebase
            .firestore()
            .collection("users")
            .doc(ownerId)
            .get();
          setOwnerName(ownerDoc.data()?.fullName || "Không xác định");

          // Lấy thông tin thành viên (lọc bỏ trưởng phòng)
          const membersData = await Promise.all(
            membersId
              .filter((memberId: string) => memberId !== ownerId) // Lọc bỏ trưởng phòng
              .map(async (memberId: string) => {
                const memberDoc = await firebase
                  .firestore()
                  .collection("users")
                  .doc(memberId)
                  .get();
                return {
                  id: memberId,
                  name: memberDoc.data()?.fullName || "Không xác định",
                };
              })
          );
          setMembers(membersData);
        }
      } catch (error) {
        console.error("Error fetching room details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  const handleRemoveMember = async (memberId: string) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa thành viên này khỏi phòng?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đồng ý",
          onPress: async () => {
            try {
              const roomRef = firebase
                .firestore()
                .collection("rooms")
                .doc(roomId);
              await roomRef.update({
                membersId: firebase.firestore.FieldValue.arrayRemove(memberId),
              });

              setMembers(members.filter((member) => member.id !== memberId));
              Alert.alert("Thành công", "Thành viên đã được xóa.");
            } catch (error) {
              console.error("Error removing member:", error);
              Alert.alert("Lỗi", "Không thể xóa thành viên. Vui lòng thử lại.");
            }
          },
        },
      ]
    );
  };
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const roomRef = firebase.firestore().collection("rooms").doc(roomId);
        const roomDoc = await roomRef.get();

        if (roomDoc.exists) {
          const roomData = roomDoc.data();
          setRoomImage(roomData?.avatarUri || ""); // Dùng key avatarUri cho đúng
        }
      } catch (error) {
        console.error("Error fetching room details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Lỗi",
        "Bạn cần cấp quyền truy cập thư viện ảnh để chọn ảnh."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 500, height: 500 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );
      uploadImage(manipResult.uri);
    }
  };

  const uploadImage = async (imageUri: string) => {
    setLoading(true);

    let formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/png",
      name: "room_image.png",
    } as any);

    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("api_key", API_KEY);

    try {
      let response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      let data = await response.json();

      if (data.secure_url) {
        setRoomImage(data.secure_url); // Cập nhật ảnh phòng
        saveRoomImageToFirestore(data.secure_url); // Lưu ảnh vào Firestore
      } else {
        Alert.alert("Lỗi", "Không thể tải lên ảnh. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const saveRoomImageToFirestore = async (imageUrl: string) => {
    try {
      const roomRef = firebase.firestore().collection("rooms").doc(roomId);
      await roomRef.update({
        avatarUri: imageUrl, // Lưu URL ảnh vào Firestore
      });
      Alert.alert("Thành công", "Ảnh phòng đã được cập nhật!");
    } catch (error) {
      console.error("Error saving room image:", error);
      Alert.alert("Lỗi", "Không thể lưu ảnh phòng. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>{roomName}</Text>
      </View>

      {/* Tên phòng và ảnh */}
      <View style={styles.imageContainer}>
        {roomImage ? (
          <Image source={{ uri: roomImage }} style={styles.roomImage} />
        ) : (
          <Text>Không có ảnh phòng</Text>
        )}
        <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
          <Text style={styles.addImageText}>Thêm/Sửa Ảnh</Text>
        </TouchableOpacity>
      </View>

      {/* Trưởng phòng */}
      <Text style={styles.sectionTitle}>Trưởng Phòng</Text>
      <View style={styles.groupItem}>
        <Text>Trưởng phòng: {ownerName}</Text>
      </View>

      {/* Danh sách thành viên */}
      <Text style={styles.sectionTitle}>Danh Sách Thành Viên</Text>
      {members.length > 0 ? (
        <FlatList
          data={members}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.memberItem}>
              <Text>{item.name}</Text>
              {ownerId === firebase.auth().currentUser?.uid && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveMember(item.id)}
                >
                  <Text style={styles.removeButtonText}>Xóa</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      ) : (
        <Text>Không có thành viên nào</Text>
      )}

      {/* Danh sách file đã gửi */}
      <Text style={styles.sectionTitle}>Tệp Đã Gửi</Text>
      {route.params.files.length > 0 ? (
        route.params.files.map((file: string, index: number) => (
          <TouchableOpacity key={index} onPress={() => Linking.openURL(file)}>
            <Text style={styles.fileItem}>
              📄 {decodeURIComponent(file.split("/").pop() || "Tệp tin")}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>Không có tệp tin nào</Text>
      )}

      {/* Danh sách ảnh đã gửi */}
      <Text style={styles.sectionTitle}>Ảnh Đã Gửi</Text>
      {route.params.images && route.params.images.length > 0 ? (
        <FlatList
          data={route.params.images}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          renderItem={({ item }) =>
            item ? (
              <Image source={{ uri: item }} style={styles.image} />
            ) : (
              <Text>Ảnh không hợp lệ</Text>
            )
          }
        />
      ) : (
        <Text>Không có hình ảnh nào</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  roomImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  groupItem: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginBottom: 5,
  },
  memberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    marginBottom: 5,
  },
  removeButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  fileItem: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addImageButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
  addImageText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
});

export default ChiTietPhong;
