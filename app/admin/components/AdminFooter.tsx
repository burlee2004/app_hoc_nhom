import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { StackNavigationProp } from '@react-navigation/stack';  // Import StackNavigationProp
// Định nghĩa loại cho các màn hình trong stack
type RootStackParamList = {
  HomeAdmin: undefined; // Đã định nghĩa
  // Các màn hình khác có thể thêm vào đây
};


const AdminFooter = () => {
   // Sử dụng kiểu cho navigation
   const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.footerContainer}>
      {/* Phần chứa các icon */}
      <View style={styles.iconContainer}>
        {/* Bọc mỗi icon trong một TouchableOpacity và View */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => console.log('leftIcon pressed')} // Hành động khi nhấn vào icon
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../assets/images/leftIcon.png')} // Đường dẫn icon 1
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => console.log('leftArrow pressed')} // Hành động khi nhấn vào icon
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../assets/images/rightIcon.png')} // Đường dẫn icon 2
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            console.log('Navigation:', navigation); // Log thông tin của navigation
            navigation.navigate('HomeAdmin'); // Gọi hàm navigate
          }}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../assets/images/home1Icon.png')}
            style={styles.icon}
          />
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => console.log('rightArrow pressed')} // Hành động khi nhấn vào icon
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../assets/images/customer-support.png')} // Đường dẫn icon 3
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => console.log('rightArrow pressed')} // Hành động khi nhấn vào icon
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../assets/images/notificationIcon.png')} // Đường dẫn icon 3
            style={styles.icon}
          />
        </TouchableOpacity>



      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    paddingTop: 10,
    backgroundColor: '#777777',
    alignItems: 'center',
    paddingBottom: 10, // Thêm padding dưới cùng cho phần footer
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 20, // Thêm khoảng cách giữa text và icon
  },
  iconContainer: {
    flexDirection: 'row', // Sắp xếp các icon theo hàng ngang
    justifyContent: 'center', // Căn giữa icon
    width: '70%', // Đảm bảo khoảng cách đều giữa các icon
    paddingHorizontal: 10, // Thêm padding để tránh các icon dính vào mép
  },
  iconButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)', // Nút tròn mờ
    borderRadius: 50, // Bo góc tròn
    padding: 10, // Đảm bảo vùng bấm lớn hơn icon
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20, // Khoảng cách giữa các icon
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default AdminFooter;
