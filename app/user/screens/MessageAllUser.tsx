import React, { useEffect, useState } from "react";
// @ts-ignore
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";

import BanBeTab from "../components/BanBeTab";
import TimKiemTab from "../components/TimKiemTab";
import LoiMoiKetBanTab from "../components/LoiMoiKetBanTab";
import Layout from "../components/layout";

const Tab = createMaterialTopTabNavigator();

const MessageAllUserData = ({ route }: any) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { UserData } = route.params || {}; // Nhận UserData từ tham số điều hướng

  useEffect(() => {
    const fetchUser = () => {
      const user = firebase.auth().currentUser;
      if (user) {
        setCurrentUserId(user.uid);
      }
    };
    fetchUser();
  }, []);

  if (!currentUserId) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!UserData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Không tìm thấy thông tin người dùng.</Text>
      </View>
    );
  }

  return (
    <Layout>
      <View style={styles.container}>
        {/* Nội dung chính */}
        <View style={styles.content}>
        <Tab.Navigator
         lazy={true} // Trì hoãn render các tab không được chọn
          screenOptions={{
            animationEnabled: false, // Tắt hiệu ứng chuyển đổi
            tabBarStyle: {
              backgroundColor: "#F5F5F5", // Màu nền trong suốt
              elevation: 0, // Loại bỏ bóng
              shadowOpacity: 0, // Loại bỏ bóng
            },
            tabBarIndicatorStyle: {
              backgroundColor: "#8DB6CD", // Màu của thanh chỉ báo
              height: 3, // Độ dày của thanh chỉ báo
            },
            tabBarLabelStyle: {
              fontSize: 16, // Tăng kích thước chữ
              fontWeight: "bold", // Chữ in đậm
              textTransform: "none", // Không viết hoa toàn bộ
            },
            tabBarActiveTintColor: "#8DB6CD", // Màu chữ khi tab được chọn
            tabBarInactiveTintColor: "", // Màu chữ khi tab không được chọn
            tabBarPressColor: "#828282", // Hiệu ứng khi nhấn tab
            tabBarPressOpacity: 0.8, // Độ mờ khi nhấn tab
          }}
        >
          <Tab.Screen name="Bạn bè" component={BanBeTab} />
          <Tab.Screen name="Tìm kiếm" component={TimKiemTab} />
          <Tab.Screen
            name="Lời mời kết bạn"
            component={() => <LoiMoiKetBanTab currentUserId={currentUserId} />}
          />
        </Tab.Navigator>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Đảm bảo toàn màn hình
    width: "100%", // Đảm bảo chiều rộng 100%
  },
  content: {
    flex: 1, // Nội dung chính chiếm toàn bộ không gian trừ footer
  },
});

export default MessageAllUserData;