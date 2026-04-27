import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
// @ts-ignore
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "./types/RootStackParamList";
import { Message } from "../screens/types/Message";
import UserData from "./types/UserData";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Thêm kiểu cho task trong message
interface MessageWithTask extends Message {
  task?: {
    title: string;
    fileUrl: string;
    taskId: string;
  };
}

// Định nghĩa kiểu route
type ChatScreenRouteProp = RouteProp<RootStackParamList, "ChatScreen">;

const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "ChatScreen">
    >();

  const { senderId, receiverId } = route.params;

  const [messages, setMessages] = useState<MessageWithTask[]>([]);
  const [messageText, setMessageText] = useState("");
  const [task, setTask] = useState<{
    title: string;
    fileUrl: string;
    taskId: string;
  } | null>(null);

  // Gửi tin nhắn
  const sendMessage = async () => {
    if (!messageText.trim() || !senderId || !receiverId) return;

    await firebase
      .firestore()
      .collection("messages")
      .add({
        content: messageText,
        senderId: senderId,
        receiverId: receiverId,
        participants: [senderId, receiverId],
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

    setMessageText("");
  };

  // Lấy danh sách tin nhắn và đính nhiệm vụ vào cuối nếu có
  useEffect(() => {
    if (!senderId || !receiverId) return;

    const chatQuery = firebase
      .firestore()
      .collection("messages")
      .where("participants", "array-contains", senderId)
      .orderBy("timestamp", "asc");

    const unsubscribe = chatQuery.onSnapshot(async (snapshot) => {
      const fetchedMessages: MessageWithTask[] = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as MessageWithTask
      );

      if (task) {
        fetchedMessages.push({
          id: "task-message",
          senderId: receiverId,
          receiverId: senderId,
          content: "[TASK]",
          task: task,
          timestamp: firebase.firestore.Timestamp.now(),
          senderName: "Hệ thống",
          type: "task",
        });
      }

      setMessages(fetchedMessages);
    });

    return unsubscribe;
  }, [senderId, receiverId, task]);

  // Lấy nhiệm vụ được chia sẻ từ Firestore
  useEffect(() => {
    if (!receiverId) return;

    const fetchTaskForReceiver = async () => {
      const taskSnapshot = await firebase
        .firestore()
        .collection("users")
        .doc(receiverId)
        .collection("sharedTasks")
        .where("sharedBy", "==", senderId)
        .get();

      if (!taskSnapshot.empty) {
        const taskData = taskSnapshot.docs[0].data();
        setTask({
          title: taskData.taskTitle,
          fileUrl: taskData.fileUrl || "",
          taskId: taskData.taskId || "",
        });
      }
    };

    fetchTaskForReceiver();
  }, [receiverId]);

  const findParentTaskId = async (
    subtaskId: string
  ): Promise<string | null> => {
    const taskSnapshot = await firebase.firestore().collection("tasks").get();
    for (const doc of taskSnapshot.docs) {
      const subtasks = doc.data().subtasks || [];
      if (subtasks.some((st: any) => st.id === subtaskId)) {
        return doc.id; // Đây chính là taskId của nhiệm vụ cha
      }
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        // Trong phần render của FlatList trong ChatScreen
        renderItem={({ item }) => {
          if (item.task?.taskId) {
            return (
              <View
                style={[styles.receivedMessage, { backgroundColor: "#f0f0f0" }]}
              >
                <Text style={{ fontWeight: "bold" }}>{item.task.title}</Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#2196F3",
                    padding: 10,
                    marginTop: 10,
                    borderRadius: 5,
                  }}
                  onPress={async () => {
                    const subtaskId = item.task?.taskId;
                    if (!subtaskId) return;

                    const parentTaskId =
                      (item.task as any).parentTaskId ||
                      (await findParentTaskId(subtaskId));

                    if (!parentTaskId) {
                      Alert.alert("Lỗi", "Không tìm thấy nhiệm vụ cha.");
                      return;
                    }

                    console.log(
                      "🧭 Điều hướng đến TaskDetail với taskId:",
                      parentTaskId
                    );

                    navigation.navigate("TaskDetail", {
                      taskId: parentTaskId,
                      viewOnly: senderId !== firebase.auth().currentUser?.uid, // người gửi thì không cần viewOnly
                      subtaskOnlyForUser:
                        senderId !== firebase.auth().currentUser?.uid
                          ? receiverId
                          : undefined,
                      openSubtaskId: subtaskId,
                    });
                    console.log("🔍 Nhiệm vụ cha tìm được:", parentTaskId);
                  }}
                >
                  <Text style={{ color: "#fff", textAlign: "center" }}>
                    Xem nhiệm vụ
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }

          return (
            <Text
              style={
                item.senderId === senderId
                  ? styles.sentMessage
                  : styles.receivedMessage
              }
            >
              {item.content}
            </Text>
          );
        }}
      />

      <TextInput
        value={messageText}
        onChangeText={setMessageText}
        placeholder="Nhập tin nhắn..."
        style={styles.input}
      />
      <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
        <Text style={styles.sendButtonText}>Gửi</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 16,
  },
  sendButton: {
    backgroundColor: "#4caf50",
    padding: 8,
    borderRadius: 4,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    color: "white",
  },
  sentMessage: {
    backgroundColor: "#eeeeee",
    padding: 16,
    borderRadius: 16,
    maxWidth: "75%",
    marginBottom: 8,
    marginLeft: 8,
  },
  receivedMessage: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    maxWidth: "75%",
    marginBottom: 8,
    marginLeft: "auto",
  },
});
