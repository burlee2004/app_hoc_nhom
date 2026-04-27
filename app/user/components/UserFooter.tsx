import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
// @ts-ignore
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// @ts-ignore
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../screens/types/RootStackParamList';

type UserFooterRouteProp = RouteProp<RootStackParamList, 'UserFooter'>;
type NavigationProp = StackNavigationProp<RootStackParamList>;

const UserFooter = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<UserFooterRouteProp>();
  const { UserData } = route.params || {};

  if (!UserData || !UserData.id) {
    console.error("UserData không tồn tại hoặc không hợp lệ:", UserData);
    return null; // Hoặc hiển thị một thông báo lỗi
  }
  
  const updatedUserData = { ...UserData, id: UserData.id.toString() };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home', { UserData: updatedUserData })}>
        <Ionicons name="home" size={24} color="#000" />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NhiemVu', { UserData: updatedUserData })}>
        <Ionicons name="list" size={24} color="#000" />
        <Text style={styles.label}>Nhiệm Vụ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DanhSachPhong', { UserData })}>
        <Ionicons name="school" size={24} color="#000" />
        <Text style={styles.label}>Phòng Học</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Notifications', { UserData: updatedUserData })}>
        <Ionicons name="notifications" size={24} color="#000" />
        <Text style={styles.label}>Thông Báo</Text>
      </TouchableOpacity>

     
     

      <TouchableOpacity style={styles.button} onPress={() => {
        if (UserData && UserData.id) {
          navigation.navigate('Profile', { userId: UserData.id.toString(), UserData: updatedUserData });
        } else {
          console.error('UserData hoặc UserData.id không tồn tại');
        }
      }}>
        <Ionicons name="person" size={24} color="#000" />
        <Text style={styles.label}>Profile</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: '#fff' },
  button: { alignItems: 'center' },
  label: { marginTop: 5, fontSize: 12 },
});

export default UserFooter;

