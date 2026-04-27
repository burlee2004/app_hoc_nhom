import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../user/screens/types/RootStackParamList';
import { styles } from '../styles/GroupManagementStyles';
import Adlayout from '../components/mainLayout';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import Room from '../../user/screens/types/Room';

type GroupDetailRouteProp = RouteProp<RootStackParamList, 'GroupDetail'>;

const GroupDetail = () => {
  const route = useRoute<GroupDetailRouteProp>();
  const { groupId } = route.params;
  const [group, setGroup] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const groupDoc = await firebase.firestore().collection('rooms').doc(groupId).get();
        if (groupDoc.exists) {
          setGroup({ id: groupDoc.id, ...groupDoc.data() } as Room);
        } else {
          Alert.alert('Lỗi', 'Không tìm thấy nhóm.');
        }
      } catch (error) {
        Alert.alert('Lỗi', (error as any).message || 'Lấy dữ liệu thất bại!');
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId]);

  if (loading) {
    return (
      <Adlayout>
        <View style={styles.container}>
          <Text style={styles.title}>Đang tải...</Text>
        </View>
      </Adlayout>
    );
  }

  if (!group) {
    return (
      <Adlayout>
        <View style={styles.container}>
          <Text style={styles.errorText}>Không tìm thấy nhóm.</Text>
        </View>
      </Adlayout>
    );
  }

  return (
    <Adlayout>
      <View style={styles.container}>
        <Text style={styles.title}>Chi tiết nhóm</Text>
        <Text style={styles.label}>Tên nhóm:</Text>
        <Text style={styles.infoValue}>{group.name}</Text>
        <Text style={styles.label}>Mô tả:</Text>
        <Text style={styles.infoValue}>{group.description}</Text>
        <Text style={styles.label}>Thành viên:</Text>
        <Text style={styles.infoValue}>{group.membersId.join(', ')}</Text>
      </View>
    </Adlayout>
  );
};

export default GroupDetail;