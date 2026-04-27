import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
// @ts-ignore
import { useNavigation } from "@react-navigation/native";
// @ts-ignore
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types/RootStackParamList";
import styles from "../styles/DangKyStyles";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDnkzrobu355hPFLo9pNw6yimgMdxw94mU",
  authDomain: "hocnhomproject.firebaseapp.com",
  projectId: "hocnhomproject",
  storageBucket: "hocnhomproject.firebasestorage.app",
  messagingSenderId: "258386723521",
  appId: "1:258386723521:web:2dc267c7519dea1f9d0a40",
  measurementId: "G-86NNMRWBHZ",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

type DangKyScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "DangKy"
>;

export default function DangKy() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Sinh Viên");
  const [phone, setPhone] = useState("");
  const navigation = useNavigation<DangKyScreenNavigationProp>();
  const handelDangNhap = async () => {
    navigation.navigate("DangNhap", { UserData: { fullName, email, role } });
  };
  const handleDangKy = async () => {
    // Kiểm tra nhập đủ tất cả thông tin
    if (!fullName || !email || !password || !phone || !role) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    // Kiểm tra định dạng số điện thoại
    if (!/^\d{10}$/.test(phone) || phone[0] !== "0") {
      Alert.alert(
        "Lỗi",
        "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại 10 chữ số bắt đầu bằng số 0."
      );
      return;
    }

    try {
      // Đăng ký tài khoản
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Lưu thông tin người dùng
      await firebase.firestore().collection("users").doc(user?.uid).set({
        fullName,
        email,
        role: "Sinh Viên",
        password,
        phone,
      });

      // Gửi thông báo
      const notification = {
        id: firebase.firestore().collection("notifications").doc().id,
        type: "system",
        title: "Chào mừng thành viên mới!",
        content: `${fullName} vừa đăng ký tài khoản.`,
        sender: { id: user?.uid, name: fullName },
        state: "unread",
        timestamp: firebase.firestore.Timestamp.now(),
      };

      await firebase
        .firestore()
        .collection("notifications")
        .doc(notification.id)
        .set(notification);

      Alert.alert("Thành công", "Đăng ký thành công!");
      navigation.navigate("DangNhap", { UserData: { fullName, email, role } });
    } catch (error) {
      Alert.alert("Lỗi", (error as any).message || "Đăng ký thất bại!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Ký</Text>
      <TextInput
        placeholder="Họ và Tên"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Mật Khẩu"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={phone}
        onChangeText={setPhone}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={handleDangKy} style={styles.button}>
        <Text style={styles.buttonText}>Đăng Ký</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>hoặc</Text>
      <TouchableOpacity onPress={handelDangNhap} style={styles.buttonSecondary}>
        <Text style={styles.buttonTextSecondary}>Đăng Nhập</Text>
      </TouchableOpacity>
    </View>
  );
}
