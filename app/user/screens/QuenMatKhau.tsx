import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
// @ts-ignore
import { useNavigation } from '@react-navigation/native';
// @ts-ignore
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types/RootStackParamList';
import styles from '../styles/QuenMatKhauStyles';
import firebase from '../../../FirebaseConfig';

// Định nghĩa kiểu cho điều hướng
type QuenMatKhauScreenNavigationProp = StackNavigationProp<RootStackParamList, 'QuenMatKhau'>;

export default function QuenMatKhau() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation<QuenMatKhauScreenNavigationProp>();

  const handleQuenMatKhau = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email của bạn.');
      return;
    }

    try {
      await firebase.auth().sendPasswordResetEmail(email);
      Alert.alert(
        'Thành công',
        'Một email đặt lại mật khẩu đã được gửi đến địa chỉ email của bạn.',
        [{ text: 'OK', onPress: () => navigation.navigate('DangNhap', { UserData: {} }) }]
      );
    } catch (error: any) {
      switch (error.code) {
        case 'auth/invalid-email':
          Alert.alert('Lỗi', 'Email không hợp lệ.');
          break;
        case 'auth/user-not-found':
          Alert.alert('Lỗi', 'Tài khoản không tồn tại.');
          break;
        default:
          Alert.alert('Lỗi', 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
          break;
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên Mật Khẩu</Text>
      <Text style={styles.instructions}>
        Vui lòng nhập địa chỉ email của bạn để nhận liên kết đặt lại mật khẩu.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleQuenMatKhau}>
        <Text style={styles.buttonText}>Gửi</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('DangNhap', { UserData: {} })}>
        <Text style={styles.backToLoginText}>Quay lại đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}