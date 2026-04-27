import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import UserData from "./types/UserData";
import ListFriend from "./types/ListFriend"; // Import interface ListFriend

const AddFriend = ({ currentUser }: { currentUser: UserData }) => {
  const [friends, setFriends] = useState<UserData[]>([]); // Danh sách bạn bè hiện có
  const [searchEmail, setSearchEmail] = useState(""); // Email tìm kiếm
  const [searchedUser, setSearchedUser] = useState<UserData | null>(null); // User tìm thấy

  useEffect(() => {
    // Lấy danh sách bạn bè của currentUser từ Firestore
    const fetchFriends = async () => {
      try {
        const listFriendDoc = await firebase
          .firestore()
          .collection("listFriends")
          .doc(currentUser.id)
          .get();

        if (listFriendDoc.exists) {
          const data = listFriendDoc.data() as ListFriend;
          setFriends(data.Friends || []);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bạn bè:", error);
      }
    };

    fetchFriends();
  }, [currentUser.id]);

  // Xử lý tìm kiếm user theo email
  const handleSearch = async () => {
    if (!searchEmail.trim()) return;
    
    try {
      const querySnapshot = await firebase
        .firestore()
        .collection("users")
        .where("email", "==", searchEmail.trim())
        .get();

      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0].data() as UserData;
        if (user.id !== currentUser.id) {
          setSearchedUser(user);
        } else {
          setSearchedUser(null);
        }
      } else {
        setSearchedUser(null);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm user:", error);
    }
  };

  // Xử lý thêm bạn bè vào Firestore
  const handleAddFriend = async () => {
    if (!searchedUser) return;

    try {
      const userRef = firebase.firestore().collection("listFriends").doc(currentUser.id);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        // Nếu đã có danh sách bạn bè, cập nhật thêm bạn mới
        await userRef.update({
          Friends: firebase.firestore.FieldValue.arrayUnion(searchedUser),
        });
      } else {
        // Nếu chưa có, tạo mới danh sách bạn bè
        await userRef.set({
          Owener: currentUser,
          Friends: [searchedUser],
        });
      }

      // Cập nhật danh sách bạn bè hiển thị
      setFriends((prevFriends) => [...prevFriends, searchedUser]);
      setSearchedUser(null);
      setSearchEmail(""); // Xóa input sau khi thêm bạn
    } catch (error) {
      console.error("Lỗi khi thêm bạn:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <TextInput
        style={styles.searchInput}
        placeholder="Nhập email để tìm kiếm..."
        value={searchEmail}
        onChangeText={setSearchEmail}
        onSubmitEditing={handleSearch}
      />

      {/* Hiển thị kết quả tìm kiếm */}
      {searchedUser && (
        <View style={styles.userItem}>
          <Image source={{ uri: searchedUser.avatarUri || "https://default-avatar.com" }} style={styles.avatar} />
          <Text>{searchedUser.fullName}</Text>
          <TouchableOpacity style={styles.addFriendButton} onPress={handleAddFriend}>
            <Text style={styles.buttonText}>Kết bạn</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Hiển thị danh sách bạn bè hiện có */}
      {friends.length > 0 && (
        <View>
          <Text style={styles.friendTitle}>Danh sách bạn bè</Text>
          <FlatList
            data={friends}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.userItem}>
                <Image source={{ uri: item.avatarUri || "https://default-avatar.com" }} style={styles.avatar} />
                <Text>{item.fullName}</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  searchInput: { height: 40, borderBottomWidth: 1, marginBottom: 10, paddingHorizontal: 8 },
  friendTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  userItem: { flexDirection: "row", alignItems: "center", padding: 10, borderBottomWidth: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  addFriendButton: { marginLeft: "auto", padding: 5, backgroundColor: "#007bff", borderRadius: 5 },
  buttonText: { color: "white", fontWeight: "bold" },
});

export default AddFriend;
