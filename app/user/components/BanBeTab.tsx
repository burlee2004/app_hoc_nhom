import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, StyleSheet, Image } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
// @ts-ignore
import { useNavigation } from '@react-navigation/native';
// @ts-ignore
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../screens/types/RootStackParamList';
import UserData from '../screens/types/UserData';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ChatScreen'>;

const BanBeTab = () => {
  const [friends, setFriends] = useState<UserData[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<UserData[]>([]);
  const [searchText, setSearchText] = useState('');
  const currentUserId = firebase.auth().currentUser?.uid || '';
  const navigation = useNavigation<NavigationProp>();

  


  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const db = firebase.firestore();
        const userDoc = await db.collection('users').doc(currentUserId).get();
        const friendIds = userDoc.data()?.friends || [];

        const friendsData: UserData[] = [];
        for (const friendId of friendIds) {
          const friendDoc = await db.collection('users').doc(friendId).get();
          if (friendDoc.exists) {
            friendsData.push({ id: friendId, ...friendDoc.data() } as UserData);
          }
        }

        setFriends(friendsData);
        setFilteredFriends(friendsData);
      } catch (error) {
        console.error('❌ Lỗi khi lấy danh sách bạn bè:', error);
      }
    };

    fetchFriends();
  }, [currentUserId]);

  const handleSearch = () => {
    const filtered = friends.filter((friend) =>
      friend.fullName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredFriends(filtered);
  };

  const goToChatScreen = (receiverId: string) => {
    navigation.navigate('ChatScreen', {
      senderId: currentUserId,
      receiverId: receiverId,
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Tìm kiếm bạn bè"
        value={searchText}
        onChangeText={setSearchText}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleSearch} style={styles.button}>
        <Text style={styles.buttonText}>Tìm</Text>
      </TouchableOpacity>
      <FlatList
        data={filteredFriends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => goToChatScreen(item.id)}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
            </View>
            <Text style={styles.fullName}>{item.fullName}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default BanBeTab;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  input: { borderWidth: 1, padding: 8, borderRadius: 5 },
  button: { backgroundColor: 'green', marginTop: 10, padding: 10 },
  buttonText: { color: 'white', textAlign: 'center' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatarContainer: { marginRight: 10 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  fullName: { fontSize: 16, fontWeight: 'bold' },
});