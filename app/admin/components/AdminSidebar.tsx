import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../user/screens/types/RootStackParamList';  // Import kiểu ParamList

type AdminSidebarProps = {
  isCollapsed: boolean;
};

type AdminSidebarNavigationProp = StackNavigationProp<RootStackParamList, 'HomeAdmin'>;  // Thay đổi kiểu để tương thích với navigation

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed }) => {
  const navigation = useNavigation<AdminSidebarNavigationProp>();  // Sử dụng hook với kiểu navigation chính xác

  const sidebarItems = [
    {
      title: 'Quản lý nhóm',
      icon: require('../../../assets/images/learning_groupIcon.png'),
      route: 'QlNhom',  // Đảm bảo tên route trùng với khai báo trong RootStackParamList
    },
    {
      title: 'Quản lý Chat',
      icon: require('../../../assets/images/learning_groupIcon.png'),
    },
    {
      title: 'Lịch học',
      icon: require('../../../assets/images/carlendarStudyIco.png'),
    },
    {
      title: 'Quản lý hạng',
      icon: require('../../../assets/images/Rank.png'),
    },
    {
      title: 'Quản lý user',
      icon: require('../../../assets/images/AcountManagement.png'),
      route: 'UserManagement',  // Đảm bảo tên route trùng với khai báo trong RootStackParamList
    },
  ];

  if (isCollapsed) {
    return <View style={styles.sidebarCollapsed}></View>;
  }

  return (
    <View style={styles.sidebarContainer}>
      <View style={styles.menuItem}>
        <Image
          source={require('../../../assets/images/menu1Ico.png')}
          style={styles.icon}
        />
        <Text style={styles.sidebarH2Text}>MENU</Text>
      </View>

      {sidebarItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.touchableItem}
          activeOpacity={0.7}
          onPress={() => {
            if (item.route) {
              navigation.navigate(item.route);  // Điều hướng với kiểu được xác định
            }
          }}
        >
          <View style={styles.menuItem1}>
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.sidebarTextBold}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    flex: 1,
    backgroundColor: '#666666',
    padding: 10,
    justifyContent: 'flex-start',
  },
  sidebarCollapsed: {
    width: 0,
    height: '100%',
    backgroundColor: '#555',
  },
  sidebarText: {
    fontSize: 17,
    color: '#fff',
    marginBottom: 10,
  },
  sidebarTextBold: {
    fontSize: 17,
    color: '#FFFFCC',
    fontWeight: 'bold',
  },
  sidebarH2Text: {
    fontSize: 20,
    color: '#FFCC33',
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  menuItem1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  touchableItem: {
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
});

export default AdminSidebar;
