import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../user/screens/types/RootStackParamList';
import { SafeAreaView } from 'react-native-safe-area-context';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import styles from '../styles/AdminAcc';
import Adlayout from '../components/mainLayout';

type AdminAccScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AdminAcc'>;

const AdminAcc = () => {
  const navigation = useNavigation<AdminAccScreenNavigationProp>();
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
          if (userDoc.exists && userDoc.data()?.role === 'Admin') {
            setAdminData(userDoc.data());
          } else {
            Alert.alert('Lỗi', 'Không tìm thấy thông tin tài khoản admin.');
          }
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
        Alert.alert('Lỗi', 'Không thể lấy thông tin tài khoản admin.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleSignOut = async () => {
    try {
      await firebase.auth().signOut();
      Alert.alert('Thành công', 'Đăng xuất thành công!');
      navigation.navigate('DangNhap', {});
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (!adminData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không tìm thấy thông tin tài khoản admin.</Text>
      </View>
    );
  }

  return (
    <Adlayout>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: adminData.avatarUrl || 'https://example.com/admin-avatar.png' }} // Thay thế bằng URL ảnh đại diện của admin
                style={styles.avatar}
              />
              <Text style={styles.name}>{adminData.fullName}</Text>
              <Text style={styles.email}>{adminData.email}</Text>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.editButton} onPress={() => alert('Edit Profile clicked!')}>
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.changePasswordButton} onPress={() => alert('Change Password clicked!')}>
                <Text style={styles.buttonText}>Change Password</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.buttonText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* User Info Section */}
          <View style={styles.infoContainer}>
            <Text style={styles.label}>ID Người Dùng:</Text>
            <Text style={styles.infoValue}>{String(adminData.id) || 'N/A'}</Text>

            <Text style={styles.label}>Họ và Tên:</Text>
            <Text style={styles.infoValue}>{adminData.fullName || 'N/A'}</Text>

            <Text style={styles.label}>Email:</Text>
            <Text style={styles.infoValue}>{adminData.email || 'N/A'}</Text>

            <Text style={styles.label}>Vai Trò:</Text>
            <Text style={styles.infoValue}>{adminData.role || 'N/A'}</Text>
          </View>

          {/* Admin Tools Section */}
          <View style={styles.toolsContainer}>
            <Text style={styles.toolsTitle}>Công cụ quản trị</Text>
            <View style={styles.toolsList}>
              <TouchableOpacity style={styles.toolItem} onPress={() => alert('User Management clicked!')}>
                <Text style={styles.toolText}>Quản lý người dùng</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolItem} onPress={() => alert('Group Management clicked!')}>
                <Text style={styles.toolText}>Quản lý nhóm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolItem} onPress={() => alert('System Settings clicked!')}>
                <Text style={styles.toolText}>Cài đặt hệ thống</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Adlayout>
  );
};

export default AdminAcc;