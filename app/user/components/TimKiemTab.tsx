import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import firebase from 'firebase/compat/app';
import UserData from '../screens/types/UserData';
import { Image } from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
const TimKiemTab = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<UserData[]>([]);
  const [friendRequests, setFriendRequests] = useState<string[]>([]); // Lưu trạng thái "Đã gửi"
  const [friends, setFriends] = useState<string[]>([]); // Lưu danh sách bạn bè
  const currentUserId = firebase.auth().currentUser?.uid || '';
  const navigation = useNavigation<any>();
  useEffect(() => {
    const fetchFriendRequestsAndFriends = async () => {
      const db = firebase.firestore();

      // Lấy danh sách bạn bè
      const friendsSnapshot = await db
        .collection('users')
        .doc(currentUserId)
        .get();

      const friendsList = friendsSnapshot.data()?.friends || [];
      setFriends(friendsList);

      // Lấy danh sách lời mời đã gửi
      const sentRequestsSnapshot = await db
        .collection('MakeFriend')
        .where('SenderID', '==', currentUserId)
        .get();

      const sentRequests = sentRequestsSnapshot.docs.map((doc) => doc.data().RecipterID);
      setFriendRequests(sentRequests);
    };

    fetchFriendRequestsAndFriends();
  }, [currentUserId]);

  const searchUserDataByEmail = async () => {
    const snapshot = await firebase.firestore().collection('users').where('email', '==', searchText).get();
    const results = snapshot.docs.map((doc) => {
      const data = doc.data() as UserData;
      return {
        ...data,
        id: doc.id,
        isFriend: friends.includes(doc.id), // Kiểm tra trạng thái "Đã là bạn bè"
        isRequestSent: friendRequests.includes(doc.id), // Kiểm tra trạng thái "Đã gửi lời mời"
      };
    });
    setSearchResults(results);
  };

  const sendFriendRequest = async (recipientId: string) => {
    try {
      const db = firebase.firestore();

      // Kiểm tra xem lời mời đã tồn tại chưa
      const existingRequest = await db
        .collection('MakeFriend')
        .where('SenderID', '==', currentUserId)
        .where('RecipterID', '==', recipientId)
        .get();

      if (!existingRequest.empty) {
        Alert.alert('⚠️ Thông báo', 'Bạn đã gửi lời mời kết bạn trước đó!');
        return;
      }

      // Thêm lời mời kết bạn mới
      await db.collection('MakeFriend').add({
        SenderID: currentUserId,
        RecipterID: recipientId,
        status: 'pending', // Trạng thái lời mời
      });

      // Cập nhật trạng thái "Đã gửi lời mời" trong danh sách `searchResults`
      setSearchResults((prevResults) =>
        prevResults.map((user) =>
          user.id === recipientId ? { ...user, isRequestSent: true } : user
        )
      );

      Alert.alert('✅ Thành công', 'Lời mời kết bạn đã được gửi!');
    } catch (error) {
      console.error('❌ Lỗi khi gửi lời mời kết bạn:', error);
    }
  };

  const cancelFriendRequest = async (recipientId: string) => {
    try {
      const db = firebase.firestore();
      const snapshot = await db
        .collection('MakeFriend')
        .where('SenderID', '==', currentUserId)
        .where('RecipterID', '==', recipientId)
        .get();

      // Xóa lời mời kết bạn
      const batch = db.batch();
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();

      // Cập nhật trạng thái "Kết bạn" trong danh sách `searchResults`
      setSearchResults((prevResults) =>
        prevResults.map((user) =>
          user.id === recipientId ? { ...user, isRequestSent: false } : user
        )
      );

      Alert.alert('✅ Thành công', 'Lời mời kết bạn đã được hủy!');
    } catch (error) {
      console.error('❌ Lỗi khi hủy lời mời kết bạn:', error);
    }
  };

  const unfriend = async (friendId: string) => {
    try {
      const db = firebase.firestore();

      // Xóa bạn bè khỏi danh sách của cả hai người
      const batch = db.batch();
      const currentUserRef = db.collection('users').doc(currentUserId);
      const friendRef = db.collection('users').doc(friendId);

      batch.update(currentUserRef, {
        friends: firebase.firestore.FieldValue.arrayRemove(friendId),
      });
      batch.update(friendRef, {
        friends: firebase.firestore.FieldValue.arrayRemove(currentUserId),
      });

      await batch.commit();

      // Cập nhật trạng thái "Hủy kết bạn" trong danh sách `searchResults`
      setSearchResults((prevResults) =>
        prevResults.map((user) =>
          user.id === friendId ? { ...user, isFriend: false } : user
        )
      );

      Alert.alert('✅ Thành công', 'Bạn đã hủy kết bạn!');
    } catch (error) {
      console.error('❌ Lỗi khi hủy kết bạn:', error);
    }
  };

  const navigateToUserOther = (userId: string) => {
    navigation.navigate('UserOther', { userId });
  };


  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nhập email người dùng"
        value={searchText}
        onChangeText={setSearchText}
        style={styles.input}
      />
      <TouchableOpacity onPress={searchUserDataByEmail} style={styles.button}>
        <Text style={styles.buttonText}>Tìm</Text>
      </TouchableOpacity>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity onPress={() => navigateToUserOther(item.id)}>
              <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateToUserOther(item.id)}>
              <Text>{item.fullName}</Text>
            </TouchableOpacity>
            {item.isFriend ? (
              <TouchableOpacity
                onPress={() => unfriend(item.id)}
                style={styles.cancelFriendButton}
              >
                <Text style={styles.cancelFriendButtonText}>Hủy kết bạn</Text>
              </TouchableOpacity>
            ) : item.isRequestSent ? (
              <Text style={styles.statusText}>Đã gửi lời mời</Text>
            ) : (
              <TouchableOpacity
                onPress={() => sendFriendRequest(item.id)}
                style={styles.addFriendButton}
                
              >
                <Text style={styles.addFriendButtonText}>Kết bạn</Text>
                
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default TimKiemTab;

const styles = StyleSheet.create({
  container: { padding: 10 },
  input: { borderWidth: 1, padding: 8, borderRadius: 5 },
  button: { backgroundColor: 'green', marginTop: 10, padding: 10 },
  buttonText: { color: 'white', textAlign: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  item: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  addFriendButton: { backgroundColor: '#007AFF', padding: 10, marginLeft: 10 },
  addFriendButtonText: { color: 'white' },
  cancelFriendButton: { backgroundColor: '#FF3B30', padding: 10, marginLeft: 10 },
  cancelFriendButtonText: { color: 'white' },
  statusText: { color: 'gray', marginLeft: 10 },
});