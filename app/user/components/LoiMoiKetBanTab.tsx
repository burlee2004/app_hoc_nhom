import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import firebase from 'firebase/compat/app';

interface FriendRequest {
  id: string;
  SenderID: string;
  RecipterID: string;
}

const LoiMoiKetBanTab = ({ currentUserId }: { currentUserId: string }) => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [sendersInfo, setSendersInfo] = useState<{ [key: string]: string }>({}); // Lưu tên người gửi

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const db = firebase.firestore();

        // Lấy danh sách lời mời kết bạn mà người dùng hiện tại là người nhận
        const snapshot = await db
          .collection('MakeFriend')
          .where('RecipterID', '==', currentUserId)
          .get();

        const requests = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FriendRequest[];

        setFriendRequests(requests);
      } catch (error) {
        console.error('❌ Lỗi khi lấy danh sách lời mời kết bạn:', error);
      }
    };

    fetchFriendRequests();
  }, [currentUserId]);

  useEffect(() => {
    const fetchSendersInfo = async () => {
      try {
        const senderIds = friendRequests.map((request) => request.SenderID);
        const uniqueSenderIds = Array.from(new Set(senderIds)); // Loại bỏ trùng lặp

        const senderInfoPromises = uniqueSenderIds.map(async (id) => {
          const userDoc = await firebase.firestore().collection('users').doc(id).get();
          return { id, name: userDoc.data()?.fullName || 'Người dùng' };
        });

        const senderInfoArray = await Promise.all(senderInfoPromises);
        const senderInfoMap = senderInfoArray.reduce((acc: { [key: string]: string }, { id, name }) => {
          acc[id] = name;
          return acc;
        }, {});

        setSendersInfo(senderInfoMap);
      } catch (error) {
        console.error('❌ Lỗi khi lấy thông tin người gửi:', error);
      }
    };

    if (friendRequests.length > 0) {
      fetchSendersInfo();
    }
  }, [friendRequests]);

  const acceptFriend = async (request: FriendRequest) => {
    const { SenderID, RecipterID } = request;

    try {
      const db = firebase.firestore();

      const batch = db.batch();

      const senderFriendRef = db.collection('users').doc(SenderID);
      const recipterFriendRef = db.collection('users').doc(RecipterID);

      // Cập nhật danh sách bạn bè
      batch.update(senderFriendRef, {
        friends: firebase.firestore.FieldValue.arrayUnion(RecipterID),
      });
      batch.update(recipterFriendRef, {
        friends: firebase.firestore.FieldValue.arrayUnion(SenderID),
      });

      // Xóa yêu cầu kết bạn
      batch.delete(db.collection('MakeFriend').doc(request.id));

      await batch.commit();

      // Loại bỏ lời mời khỏi danh sách
      setFriendRequests((prevRequests) =>
        prevRequests.filter((item) => item.id !== request.id)
      );

      Alert.alert('✅ Thành công', 'Bạn đã chấp nhận lời mời kết bạn!');
    } catch (err) {
      console.error('❌ Lỗi khi chấp nhận lời mời kết bạn:', err);
    }
  };

  const rejectFriendRequest = async (requestId: string) => {
    try {
      const db = firebase.firestore();
      await db.collection('MakeFriend').doc(requestId).delete();

      // Loại bỏ lời mời khỏi danh sách
      setFriendRequests((prevRequests) =>
        prevRequests.filter((item) => item.id !== requestId)
      );

      Alert.alert('✅ Thành công', 'Bạn đã từ chối lời mời kết bạn!');
    } catch (error) {
      console.error('❌ Lỗi khi từ chối lời mời kết bạn:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={friendRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text>{sendersInfo[item.SenderID] || 'Đang tải...'}</Text>
            <TouchableOpacity onPress={() => acceptFriend(item)} style={styles.button}>
              <Text style={styles.buttonText}>Đồng ý</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => rejectFriendRequest(item.id)} style={styles.rejectButton}>
              <Text style={styles.rejectButtonText}>Từ chối</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default LoiMoiKetBanTab;

const styles = StyleSheet.create({
  container: { padding: 10 },
  requestItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  button: { backgroundColor: '#007AFF', padding: 10 },
  buttonText: { color: 'white' },
  rejectButton: { backgroundColor: '#FF3B30', padding: 10, marginLeft: 10, borderRadius: 5 },
  rejectButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
});