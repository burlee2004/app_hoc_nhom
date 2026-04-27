import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
//@ts-ignore
import { RootStackParamList } from "../types/navigation";
//@ts-ignore
import Notification from "../types/Notification";

// Định nghĩa type cho route
type NotificationDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "NotificationDetail"
>;

const NotificationDetailScreen: React.FC = () => {
  const route = useRoute<NotificationDetailScreenRouteProp>();
  const navigation = useNavigation();
  const { notification } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{notification.title}</Text>
      <Text style={styles.subtitle}>Type: {notification.type}</Text>
      <Text style={styles.content}>
        {notification.content?.content || "No content available"}
      </Text>
      {notification.sender && (
        <View style={styles.sender}>
          <Image
            source={{ uri: notification.sender.fullName }}
            style={styles.avatar}
          />
          <Text>{notification.sender.fullName}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 14, marginBottom: 10 },
  content: { fontSize: 16, lineHeight: 22 },
  sender: { flexDirection: "row", alignItems: "center", marginTop: 20 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
});

export default NotificationDetailScreen;
