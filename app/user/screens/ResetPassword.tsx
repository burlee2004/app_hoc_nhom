import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Biểu tượng con mắt
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from './types/RootStackParamList';

type ResetPasswordRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;

const ResetPassword: React.FC = () => {
  const route = useRoute<ResetPasswordRouteProp>();
  const { userId } = route.params; // Nhận `userId` từ tham số điều hướng

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Trạng thái hiển thị mật khẩu
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const handleResetPassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ các trường.');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }
  
    try {
      const user = firebase.auth().currentUser;
  
      if (!user) {
        Alert.alert('Lỗi', 'Không tìm thấy người dùng hiện tại.');
        return;
      }
  
      // Reauthenticate user to verify current password
      const credential = firebase.auth.EmailAuthProvider.credential(user.email || '', currentPassword);
      await user.reauthenticateWithCredential(credential);
  
      // Update password in Firebase Authentication
      await user.updatePassword(newPassword);
  
      // Xóa dữ liệu trong các trường
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
  
      Alert.alert('Thành công', 'Mật khẩu đã được cập nhật.');
    } catch (error: any) {
      console.error('Lỗi khi đặt lại mật khẩu:', error);
      switch (error.code) {
        case 'auth/wrong-password':
          Alert.alert('Lỗi', 'Mật khẩu hiện tại không đúng.');
          break;
        case 'auth/weak-password':
          Alert.alert('Lỗi', 'Mật khẩu mới quá yếu. Vui lòng chọn mật khẩu mạnh hơn.');
          break;
        default:
          Alert.alert('Lỗi', 'Không thể đặt lại mật khẩu. Vui lòng thử lại.');
          break;
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt lại mật khẩu</Text>

      {/* Mật khẩu hiện tại */}
      <Text style={styles.label}>Mật khẩu hiện tại:</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          secureTextEntry={!isCurrentPasswordVisible}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Nhập mật khẩu hiện tại"
        />
        <TouchableOpacity
          onPress={() => setIsCurrentPasswordVisible(!isCurrentPasswordVisible)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={isCurrentPasswordVisible ? 'eye-off' : 'eye'}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* Mật khẩu mới */}
      <Text style={styles.label}>Mật khẩu mới:</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          secureTextEntry={!isNewPasswordVisible}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Nhập mật khẩu mới"
        />
        <TouchableOpacity
          onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={isNewPasswordVisible ? 'eye-off' : 'eye'}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* Xác nhận mật khẩu mới */}
      <Text style={styles.label}>Xác nhận mật khẩu mới:</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          secureTextEntry={!isConfirmPasswordVisible}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Xác nhận mật khẩu mới"
        />
        <TouchableOpacity
          onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResetPassword;