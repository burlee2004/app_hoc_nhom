import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import Notification from "./types/Notification";
import {Message} from "./types/Message";
import UserData from "./types/UserData";
import Room from "./types/Room";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
//@ts-ignore
import { RootStackParamList } from "./types/navigation"; // import đúng chỗ bạn định nghĩa

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'admin' | 'group' | 'user' | 'system'>('all');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const snapshot = await firebase.firestore().collection("notifications").get();
        const fetchedNotifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  const addNotification = async () => {
    try {
      const userRef = firebase.firestore().collection("users").doc("USER_ID");
      const roomRef = firebase.firestore().collection("rooms").doc("ROOM_ID");

      const userDoc = await userRef.get();
      const roomDoc = await roomRef.get();

      if (!userDoc.exists || !roomDoc.exists) {
        Alert.alert("Error", "User or Room not found!");
        return;
      }

      const newNotification: Notification = {
        id: firebase.firestore().collection("notifications").doc().id,
        type: "user",
        title: "New Message from Admin",
        content: {
          id: "msg1",
          content: "Welcome to the group!",
          senderId: "admin",
          senderName: "Admin",
          timestamp: firebase.firestore.Timestamp.now(),
          
          
        },
        sender: userDoc.data() as UserData,
        state: "unread",
        UserData: userDoc.data() as UserData,
        room: roomDoc.data() as Room
      };

      await firebase.firestore().collection("notifications").doc(newNotification.id).set(newNotification);
      Alert.alert("Success", "Notification added successfully!");
    } catch (error) {
      console.error("Error adding notification:", error);
      Alert.alert("Error", "Failed to add notification.");
    }
  };

  const filteredNotifications = filter === "all" ? notifications : notifications.filter(n => n.type === filter);

  return (
    <View style={styles.container}>
      {/* Bộ lọc thông báo */}
      <View style={styles.filterContainer}>
        {['all', 'admin', 'group', 'user', 'system'].map(type => (
          <TouchableOpacity key={type} onPress={() => setFilter(type as Notification["type"])} style={[styles.filterButton, filter === type && styles.activeFilter]}>
            <Text style={styles.filterText}>{type.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Danh sách thông báo */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.notificationItem}  
          onPress={() => navigation.navigate("NotificationDetail", { notification: item })}>
            {item.sender?.id && <Image source={{ uri: item.sender.fullName }} style={styles.avatar} />}
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>[{getIcon(item.type)}] {item.title}</Text>
                <Text style={styles.content}>
                {item.content?.content
                  ? item.content.content.length > 50
                    ? item.content.content.substring(0, 50) + "..."
                    : item.content.content
                  : "No content available"}
                </Text>
              </View>
          </TouchableOpacity>
        )}
      />

      {/* Nút thêm thông báo */}
      <TouchableOpacity style={styles.addButton} onPress={addNotification}>
        <Text style={styles.addButtonText}>+ Add Notification</Text>
      </TouchableOpacity>
    </View>
  );
};

const getIcon = (type: Notification["type"]) => {
  switch (type) {
    case "admin": return "🟢";
    case "group": return "🔵";
    case "user": return "🟡";
    case "system": return "🔴";
    default: return "⚪";
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  filterContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
  filterButton: { padding: 8, borderRadius: 5, backgroundColor: "#e0e0e0" },
  activeFilter: { backgroundColor: "#6200ee" },
  filterText: { fontWeight: "bold", color: "#000" },
  notificationItem: { padding: 12, borderBottomWidth: 1, borderColor: "#ddd", flexDirection: "row", alignItems: "center" },
  title: { fontWeight: "bold", marginRight: 10 },
  content: { flex: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  addButton: { marginTop: 20, padding: 12, backgroundColor: "#6200ee", borderRadius: 5, alignItems: "center" },
  addButtonText: { color: "#fff", fontWeight: "bold" },
});

export default NotificationScreen;
