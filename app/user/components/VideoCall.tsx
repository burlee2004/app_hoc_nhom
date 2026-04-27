import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';

export default function VideoCall() {
  const [roomId, setRoomId] = useState('');
  const [url, setUrl] = useState('');

  // Hàm tạo mã phòng ngẫu nhiên
  const generateRoomId = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 10; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  // Khởi tạo khi component được mount
  useEffect(() => {
    const id = generateRoomId();
    const generatedUrl = `https://meet.jit.si/${id}`;
    setRoomId(id);
    setUrl(generatedUrl);
  }, []);

  // Sao chép link phòng
  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(url);
    Alert.alert('Đã sao chép', 'Link phòng đã được sao chép vào clipboard');
  };

  // Mở link trong trình duyệt
  const handleOpenLink = () => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Lỗi', 'Không thể mở link');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phòng: {roomId}</Text>

      <TouchableOpacity style={styles.button} onPress={handleCopyLink}>
        <Text style={styles.buttonText}>📋 Sao chép link</Text>
      </TouchableOpacity>

      <View style={{ marginVertical: 20, alignItems: 'center' }}>
  <Text style={{ marginBottom: 10, fontSize: 16 }}>Mã QR để chia sẻ:</Text>
  {url !== '' && (
    <QRCode value={url} size={200} />
  )}
</View>


      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#4caf50' }]}
        onPress={handleOpenLink}
      >
        <Text style={styles.buttonText}>🚀 Tham gia cuộc gọi</Text>
      </TouchableOpacity>
    </View>
  );
}

// Style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
