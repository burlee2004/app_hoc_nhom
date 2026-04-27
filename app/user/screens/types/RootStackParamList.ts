// @ts-ignore
import { NavigatorScreenParams } from "@react-navigation/native";
import UserData from "./UserData";
import ChatScreen from "../ChatScreen";
export type RootStackParamList = {
  // admin
  AdminDashboard: undefined;
  EditGroup: { groupId: string };
  AdminProfile: { userId: string };
  AdminNotification: undefined;
  AdminGroup: { groupId: string };
  AdminUser: { userId: string };
  AdminRoom: { roomId: string };
  AdminMessage: { message: string };
  AdminSetting: undefined;
  AdminReport: undefined;
  AdminFeedback: undefined;
  AdminHelp: undefined;
  AdminAbout: undefined;
  AdminLogout: undefined;
  AdminLogin: undefined;
  QlNhom: undefined;
  UserManagement: undefined;
  GroupDetail: { groupId: string };
  AdminAcc: undefined;
  HomeAdmin: undefined;
  // user
  Home: {
    UserData: {
      id: string;
      fullName: string;
      email: string;
      phone?: string;
      role: string;
      avatarUri?: string;
    };
  };
  Notifications: {
    UserData: {
      id: string;
      fullName: string;
      email: string;
      password: string;
      role: string;
      avatarUri?: string;
    };
  };
  DanhSachPhong: {
    UserData: {
      id: number;
      fullName: string;
      email: string;
      password: string;
      role: string;
      avatarUri?: string;
    };
  };
  UserFooter: {
    UserData: {
      id: number;
      fullName: string;
      email: string;
      password: string;
      role: string;
      avatarUri?: string;
    };
  };
  ChiTietPhong: {
    roomId: string;
    roomName: string;
    ownerId: string;
    files: string[];
    images: string[];
    TotalMembers: number;
  };
  PhongHoc: {
    roomId: string;
    roomName: string;
    ownerId: string;
    membersId: string[];
  };
  Profile: {
    userId: string;
    UserData: {
      id: string;
      fullName: string;
      email: string;
      phone?: string;
      password: string;
      role: string;
      avatarUri?: string;
    };
  };
  DangKy: undefined;
  DangNhap: {
    UserData?: {
      id?: number;
      fullName?: string;
      email?: string;
      password?: string;
      role?: string;
    };
  };
  QuenMatKhau: undefined;
  UserOther: { userId: string };
  NhiemVu: undefined;
  UserProfile: { userId: string };
  BanBeTab: undefined;
  TaskDetail: {
    taskId: string;
    viewOnly?: boolean;
    subtaskOnlyForUser?: string;
    openSubtaskId?: string;
  };
  ResetPassword: { userId: string }; // Thêm màn hình ResetPassword
  videoCall: {
    roomId: string; // ID phòng video call
    roomName: string; // Tên phòng video call
    ownerId: string; // ID người tạo phòng
  };
  EditProfile: { userId: string; fullName: string; avatarUri: string };
  NotificationScreen: undefined;
  NotificationDetail: { id: string }; // hoặc kiểu dữ liệu bạn truyền qua
  ChatScreen: {
    senderId: string;
    receiverId: string;
    senderData: UserData;
    receiverData: UserData;
    messages: {
      id: string;
      content: string;
      senderId: string;
      receiverId: string;
      timestamp: any;
    }[];
    task?: { title: string; fileUrl: string; taskId: string } | null;
  };
  MessageAllUser: {
    UserData: {
      id: string; // ID người dùng hiện tại
      fullName: string; // Tên người dùng
    };
  };
};
