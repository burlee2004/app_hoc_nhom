// @ts-ignore
import { StackNavigationProp } from "@react-navigation/stack";
// @ts-ignore
import { RouteProp } from "@react-navigation/native";
// @ts-ignore
import { useNavigation } from "@react-navigation/native"; // Import navigation
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Linking,
  Button,
} from "react-native";
import { RootStackParamList } from "../screens/types/RootStackParamList";
import { Message } from "../screens/types/Message";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import styles from "../styles/PhongHocStyles";
import UpFile from "../components/UpFile";
import { SharedTask } from "../screens/types/SharedTask"; // hoặc từ file bạn định nghĩa
import { MaterialIcons, FontAwesome } from "@expo/vector-icons"; // Thêm dòng này nếu dùng expo

type PhongHocProps = {
  route: RouteProp<RootStackParamList, "PhongHoc">;
};

export default function PhongHoc({ route }: PhongHocProps) {
  const { roomId, roomName, ownerId } = route.params || {};
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>(); // Sử dụng navigation
  const currentUserId = firebase.auth().currentUser?.uid || "";
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [Lst_files, setLst_files] = useState<string[]>([]);
  const [lst_images, setLst_images] = useState<string[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);

  const [sharedTasks, setSharedTasks] = useState<
    {
      taskId: string;
      taskTitle: string;
      taskDeadline: string;
      sharedBy: string;
    }[]
  >([]);

  // loadMessage

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("rooms")
      .doc(roomId)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        const loadedMessages: Message[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            content: data.content || "",
            senderId: data.senderId || "",
            senderName: data.senderName || "",
            senderAvatar: data.senderAvatar || "",
            timestamp: data.timestamp || firebase.firestore.Timestamp.now(),
            image: data.image || undefined,
            file: data.file || undefined,
            type: "message", // <-- THÊM DÒNG NÀY
          };
        });

        setMessages(loadedMessages);
      });

    return () => unsubscribe();
  }, [roomId]);

  // ------------- loadtask

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("rooms")
      .doc(roomId)
      .collection("sharedTasks")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        const tasks = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            taskId: doc.id,
            taskTitle: data.taskTitle || "Không có tiêu đề",
            taskDeadline: data.taskDeadline || "Không có hạn chót",
            sharedBy: data.sharedBy || "Không rõ người chia sẻ",
            timestamp: data.timestamp || firebase.firestore.Timestamp.now(),
            type: "task", // thêm dòng này
          };
        });
        setSharedTasks(tasks);
      });

    return () => unsubscribe();
  }, [roomId]);

  const mergedData: (Message | SharedTask)[] = [
    ...messages,
    ...sharedTasks,
  ].sort((a, b) => {
    const aTime = "timestamp" in a ? a.timestamp.seconds : 0;
    const bTime = "timestamp" in b ? b.timestamp.seconds : 0;
    return aTime - bTime;
  }) as (Message | SharedTask)[];

  const downloadSharedTask = async (task: SharedTask) => {
    try {
      const taskData = {
        title: task.taskTitle,
        deadline: task.taskDeadline,
        status: "Đang thực hiện",
        description: "",
        assignedBy: task.sharedBy,
        createdAt: new Date().toISOString().split("T")[0],
        progress: 0,
        subtasks: [],
        attachments: [],
        createdBy: currentUserId,
      };

      await firebase.firestore().collection("tasks").add(taskData);
      Alert.alert("Thành công", "Nhiệm vụ đã được tải về danh sách của bạn!");
    } catch (error) {
      console.error("Lỗi khi tải nhiệm vụ:", error);
      Alert.alert("Lỗi", "Không thể tải nhiệm vụ. Vui lòng thử lại.");
    }
  };

  //-----------------------------------END----------------------------------------------//
  useEffect(() => {
    const images = messages.map((msg) => msg.image).filter(Boolean) as string[];
    const files = messages.map((msg) => msg.file).filter(Boolean) as string[];
    setLst_images(images);
    setLst_files(files);
  }, [messages]);

  console.log("tong so nguoi" + totalMembers);
  // tổng số thành viên
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("rooms")
      .doc(roomId)
      .collection("members") // Giả sử mỗi thành viên được lưu tại đây
      .onSnapshot((snapshot) => {
        setTotalMembers(snapshot.size); // Lấy tổng số thành viên
      });
    console.log(totalMembers);
    return () => unsubscribe();
  }, [roomId]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const user = firebase.auth().currentUser;
    const userDoc = await firebase
      .firestore()
      .collection("users")
      .doc(user?.uid)
      .get();
    const UserData = userDoc.data();

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      senderId: currentUserId,
      senderName: UserData?.fullName || "Unknown",
      senderAvatar: UserData?.avatarUri || "",
      timestamp: firebase.firestore.Timestamp.fromMillis(Date.now()),
      type: "message", // Thêm thuộc tính 'type'
    };

    await firebase
      .firestore()
      .collection("rooms")
      .doc(roomId)
      .collection("messages")
      .add(newMessage);
    // **Thêm thông báo mới vào Firestore**
    const notification = {
      id: firebase.firestore().collection("notifications").doc().id,
      type: "group",
      title: `Tin nhắn mới từ ${UserData?.fullName || "Unknown"}`,
      content: message,
      sender: {
        id: user?.uid,
        name: UserData?.fullName || "Unknown",
        avatar: UserData?.avatarUri || "",
      },
      state: "unread",
      timestamp: firebase.firestore.Timestamp.now(),
      roomId: roomId,
      roomName: roomName,
    };

    await firebase
      .firestore()
      .collection("notifications")
      .doc(notification.id)
      .set(notification);
    setMessage("");
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === currentUserId;
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser
            ? styles.currentUserContainer
            : styles.otherUserContainer,
        ]}
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.senderAvatar }} style={styles.avatar} />
        </View>
        <View style={styles.messageContent}>
          <View
            style={[
              styles.messageBubble,
              isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
            ]}
          >
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.messageImage} />
            )}
            {item.file && (
              <TouchableOpacity
                onPress={() => Linking.openURL(item.file || "")}
              >
                <Text style={styles.fileLinkText}>
                  📄{" "}
                  {decodeURIComponent(item.file.split("/").pop() || "Tập tin")}
                </Text>
              </TouchableOpacity>
            )}
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
          <Text style={styles.senderName}>{item.senderName}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.roomTitle}>{roomName}</Text>
      {/* Nút Call ở góc phải */}
      <View style={styles.topActionBar}>
        <TouchableOpacity
          style={styles.callButtonNew}
          onPress={() =>
            navigation.navigate("videoCall", { roomId, roomName, ownerId })
          }
        >
          <FontAwesome name="phone" size={20} color="#fff" />
          <Text style={styles.callButtonTextNew}>Gọi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.detailButton}
          onPress={() =>
            navigation.navigate("ChiTietPhong", {
              roomId,
              roomName,
              ownerId: currentUserId,
              files: Lst_files,
              images: lst_images,
              TotalMembers: totalMembers,
            })
          }
        >
          <MaterialIcons name="info-outline" size={20} color="#1976D2" />
          <Text style={styles.detailButtonText}>Chi Tiết Phòng</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mergedData}
        keyExtractor={(item, index) => {
          if (item.type === "message") {
            return (item as Message).id;
          } else {
            return (item as SharedTask).taskId + "-" + index;
          }
        }}
        renderItem={({ item }) => {
          if (item.type === "message") {
            return renderMessageItem({ item: item as Message });
          } else if (item.type === "task") {
            const task = item as SharedTask;
            return (
              <View style={styles.sharedTask}>
                <Text style={styles.sharedTaskTitle}>{task.taskTitle}</Text>
                <Text style={styles.sharedTaskDeadline}>
                  Hạn chót: {task.taskDeadline}
                </Text>
                <Text style={styles.sharedTaskSharedBy}>
                  Chia sẻ bởi: {task.sharedBy}
                </Text>

                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => downloadSharedTask(task)}
                >
                  <Text style={styles.downloadButtonText}>⬇️ Tải về</Text>
                </TouchableOpacity>
              </View>
            );
          } else {
            return null;
          }
        }}
        style={styles.messageList}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <UpFile roomId={roomId} currentUserId={currentUserId} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Nhập tin nhắn..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
