import React from "react";
//@ts-ignore
import { NavigationContainer } from "@react-navigation/native";
//@ts-ignore
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./app/user/screens/Home";
import NhiemVu from "./app/user/screens/NhiemVu";
import Notifications from "./app/user/screens/Notifications";
import PhongHoc from "./app/user/screens/PhongHoc";
import Profile from "./app/user/screens/Profile";
import DangNhap from "./app/user/screens/DangNhap";
import DangKy from "./app/user/screens/DangKy";
import DanhSachPhong from "./app/user/screens/DanhSachPhong";
import UserFooter from "./app/user/components/UserFooter";
import QuenMatKhau from "./app/user/screens/QuenMatKhau";
import VideoCall from "./app/user/components/VideoCall";
import TaskDetail from "./app/user/screens/taskDetail";
import ChatScreen from "./app/user/screens/ChatScreen";
import BanBeTab from "./app/user/components/BanBeTab";
import UserOther from "./app/user/screens/UserOther";
import ResetPassword from "./app/user/screens/ResetPassword";
import EditProfile from "./app/user/screens/EditProfile";
import NotificationDetailScreen from "./app/user/screens/NotificationDetailScreen";
import NotificationScreen from "./app/user/screens/Notifications";

// admin
import HomeAdmin from "./app/admin/screens/HomeAdmin";
import QlNhom from "./app/admin/screens/QlNhom";
import UserManagement from "./app/admin/screens/UserManagement";
import AdminAcc from "./app/admin/screens/AdminAcc";
import GroupDetail from "./app/admin/screens/GroupDetail";
import EditGroup from "./app/admin/screens/EditGroup";
import MessageAllUserData from "./app/user/screens/MessageAllUser";
import ChiTietPhong from "./app/user/screens/ChiTietPhong";
import { RootStackParamList } from "./app/user/screens/types/RootStackParamList";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DangNhap">
        {/* Các màn hình của người dùng */}
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="NhiemVu" component={NhiemVu} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen
          name="DanhSachPhong"
          component={DanhSachPhong}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="PhongHoc" component={PhongHoc} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="UserFooter" component={UserFooter} />
        <Stack.Screen
          name="DangNhap"
          component={DangNhap}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DangKy"
          component={DangKy}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QuenMatKhau"
          component={QuenMatKhau}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="videoCall" component={VideoCall} />
        <Stack.Screen name="ChiTietPhong" component={ChiTietPhong} />
        <Stack.Screen
          name="MessageAllUser"
          component={MessageAllUserData}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="UserOther" component={UserOther} />
        <Stack.Screen
          name="UserProfile"
          component={ChatScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="BanBeTab" component={BanBeTab} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
        <Stack.Screen
          name="NotificationDetail"
          component={NotificationDetailScreen}
        />

        {/* Các màn hình của admin */}
        <Stack.Screen
          name="HomeAdmin"
          component={HomeAdmin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QlNhom"
          component={QlNhom}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserManagement"
          component={UserManagement}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminAcc"
          component={AdminAcc}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GroupDetail"
          component={GroupDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditGroup"
          component={EditGroup}
          options={{ headerShown: false }}
        />
        {/* Các màn hình khác */}
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetail}
          options={{ title: "Chi tiết nhiệm vụ" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
