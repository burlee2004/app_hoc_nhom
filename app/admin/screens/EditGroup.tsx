import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../user/screens/types/RootStackParamList';
import { styles } from '../styles/GroupManagementStyles';
import Adlayout from '../components/mainLayout';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import Room from '../../user/screens/types/Room';

type EditGroupRouteProp = RouteProp<RootStackParamList, 'EditGroup'>;

const EditGroup = () => {
  const route = useRoute<EditGroupRouteProp>();
  const navigation = useNavigation();
  const { groupId } = route.params as { groupId: string };
  const [group, setGroup] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const groupDoc = await firebase.firestore().collection('rooms').doc(groupId).get();
        if (groupDoc.exists) {
          const groupData = groupDoc.data() as Room;
          setGroup(groupData);
          setName(groupData.name);
          setDescription(groupData.description);
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

  const handleSave = async () => {
    try {
      await firebase.firestore().collection('rooms').doc(groupId).update({
        name,
        description,
      });
      Alert.alert('Thành công', 'Cập nhật nhóm thành công!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', (error as any).message || 'Cập nhật nhóm thất bại!');
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
        <Text style={styles.title}>Chỉnh sửa nhóm</Text>
        <Text style={styles.label}>Tên nhóm:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>Mô tả:</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </Adlayout>
  );
};

export default EditGroup;