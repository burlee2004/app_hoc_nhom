import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../user/screens/types/RootStackParamList';
import { styles } from '../styles/GroupManagementStyles'; // Import styles từ file riêng
import Adlayout from '../components/mainLayout';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import Room from '../../user/screens/types/Room';

type GroupManagementScreenNavigationProp = StackNavigationProp<RootStackParamList, 'QlNhom'>;

const GroupManagement = () => {
  const navigation = useNavigation<GroupManagementScreenNavigationProp>();
  const [groups, setGroups] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groupsCollection = await firebase.firestore().collection('rooms').get();
        const groupsData = groupsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Room[];
        setGroups(groupsData);
        console.log('Groups data:', groupsData); // Ghi nhật ký dữ liệu nhóm
        Alert.alert('Thành công', 'Lấy dữ liệu thành công!');
      } catch (error) {
        console.error('Error fetching groups:', error); // Ghi nhật ký lỗi
        Alert.alert('Lỗi', (error as any).message || 'Lấy dữ liệu thất bại!');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleDeleteGroup = async (groupId: string) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa nhóm này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await firebase.firestore().collection('rooms').doc(groupId).delete();
              Alert.alert('Thành công', 'Xóa nhóm thành công!');
              setGroups(groups.filter(group => group.id !== groupId));
            } catch (error) {
              Alert.alert('Lỗi', (error as any).message || 'Xóa nhóm thất bại!');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleSendNotification = async (groupId: string, message: string) => {
    try {
      const group = groups.find(group => group.id === groupId);
      if (group) {
        // Gửi thông báo đến các thành viên của nhóm
        // Đây là ví dụ đơn giản, bạn có thể sử dụng các dịch vụ thông báo như Firebase Cloud Messaging (FCM)
        Alert.alert('Thông báo', `Đã gửi thông báo đến nhóm: ${group.name}`);
      }
    } catch (error) {
      Alert.alert('Lỗi', (error as any).message || 'Gửi thông báo thất bại!');
    }
  };

  if (loading) {
    return (
      <Adlayout>
        <View style={styles.container}>
          <Text style={styles.title}>Đang tải...</Text>
        </View>
      </Adlayout>
    );
  }

  return (
    <Adlayout>
      <FlatList
        contentContainerStyle={styles.scrollContainer}
        data={groups}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
          <>
            <Text style={styles.title}>Quản lý Nhóm</Text>
            <Text style={styles.subtitle}>Danh sách các nhóm học</Text>
          </>
        )}
        renderItem={({ item: group }) => (
          <View key={group.id} style={styles.groupCard}>
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupDescription}>{group.description}</Text>
              <Text style={styles.groupMembers}>Thành viên: {group.membersId.length}</Text>
            </View>

            <View style={styles.groupActions}>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleSendNotification(group.id, 'Thông báo từ quản trị viên')}>
                <Text style={styles.actionText}>Thông báo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('GroupDetail', { groupId: group.id })}>
                <Text style={styles.actionText}>Chi tiết</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('EditGroup', { groupId: group.id })}>
                <Text style={styles.actionText}>Chỉnh sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteGroup(group.id)}>
                <Text style={styles.actionText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </Adlayout>
  );
};

export default GroupManagement;