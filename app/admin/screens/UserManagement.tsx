import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../user/screens/types/RootStackParamList';
import styles from '../styles/UserManagementStyles';
import firebase from '../../../FirebaseConfig';
import UserData from '../../user/screens/types/UserData';
import LayoutAD from '../../admin/components/mainLayout';
import { Ionicons } from '@expo/vector-icons';

type UserManagementScreenNavigationProp = StackNavigationProp<RootStackParamList, 'UserManagement'>;

export default function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<UserManagementScreenNavigationProp>();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await firebase.firestore().collection('users').get();
      const usersData = usersCollection.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          role: data.role,
        } as UserData;
      });
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!fullName || !email || !password || !role) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await firebase.firestore().collection('users').doc(user?.uid).set({
        fullName,
        email,
        password, // Lưu mật khẩu vào Firestore
        role,
      });

      Alert.alert('Thành công', 'Thêm người dùng thành công!');
      setUsers([...users, { id: user?.uid || '', fullName, email, password, role }]);
      setFullName('');
      setEmail('');
      setPassword('');
      setRole('');
    } catch (error) {
      Alert.alert('Lỗi', (error as any).message || 'Thêm người dùng thất bại!');
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser || !fullName || !email || !role) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    try {
      await firebase.firestore().collection('users').doc(selectedUser.id).update({
        fullName,
        email,
        role,
      });

      Alert.alert('Thành công', 'Cập nhật người dùng thành công!');
      setUsers(users.map(user => user.id === selectedUser.id ? { ...user, fullName, email, role } : user));
      setSelectedUser(null);
      setFullName('');
      setEmail('');
      setPassword('');
      setRole('');
    } catch (error) {
      Alert.alert('Lỗi', (error as any).message || 'Cập nhật người dùng thất bại!');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa người dùng này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await firebase.firestore().collection('users').doc(userId).delete();
              Alert.alert('Thành công', 'Xóa người dùng thành công!');
              setUsers(users.filter(user => user.id !== userId));
            } catch (error) {
              Alert.alert('Lỗi', (error as any).message || 'Xóa người dùng thất bại!');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleSelectUser = (user: UserData) => {
    setSelectedUser(user);
    setFullName(user.fullName);
    setEmail(user.email);
    setPassword(user.password);
    setRole(user.role);
  };

  const handleCancel = () => {
    setSelectedUser(null);
    setFullName('');
    setEmail('');
    setPassword('');
    setRole('');
  };

  return (
    <LayoutAD>
      <View style={styles.container}>
        <Text style={styles.title}>Quản Lý Người Dùng</Text>
        <TextInput
          placeholder="Họ và Tên"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Mật Khẩu"
            value={password}
            onChangeText={setPassword}
            style={[styles.input, styles.passwordInput]}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="black" />
          </TouchableOpacity>
        </View>
        <TextInput
          placeholder="Vai Trò"
          value={role}
          onChangeText={setRole}
          style={styles.input}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={selectedUser ? handleUpdateUser : handleAddUser} style={styles.button}>
            <Text style={styles.buttonText}>{selectedUser ? 'Cập Nhật' : 'Thêm'}</Text>
          </TouchableOpacity>
          {selectedUser && (
            <TouchableOpacity onPress={handleCancel} style={styles.buttonHuy}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          contentContainerStyle={styles.scrollContainer}
          data={users}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <Text style={styles.userText}>{item.email}</Text>
              <Text style={styles.userText}>{item.role}</Text>
              <View style={styles.userActions}>
                <TouchableOpacity onPress={() => handleSelectUser(item)} style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteUser(item.id)} style={styles.actionButton1}>
                  <Text style={styles.actionButtonText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </LayoutAD>
  );
}