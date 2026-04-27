import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// @ts-ignore
import { useNavigation, useRoute } from '@react-navigation/native';
// @ts-ignore
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../screens/types/RootStackParamList';

type NavigationProp = DrawerNavigationProp<RootStackParamList>;

const UserHeader = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute(); // Lấy thông tin route hiện tại
  const { title } = route.params || {}; // Lấy tiêu đề từ tham số điều hướng

  return (
    <View>
      <View style={styles.topBar} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="filter" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>APP HỌC NHÓM</Text>
        {/* Thêm các icon khác nếu cần */}
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="qr-code" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    height: 45,
    backgroundColor: '#0000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    padding: 15,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 20,
  },
});

export default UserHeader;