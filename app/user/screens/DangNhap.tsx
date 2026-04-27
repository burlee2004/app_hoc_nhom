import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
// @ts-ignore
import { useNavigation } from "@react-navigation/native";
// @ts-ignore
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types/RootStackParamList";
import styles from "../styles/DangNhapStyles";
import firebase from "../../../FirebaseConfig"; // Import Firebase từ FirebaseConfig.js
import { Ionicons } from "@expo/vector-icons"; // Import biểu tượng mắt từ thư viện Ionicons

// Định nghĩa kiểu cho điều hướng
type DangNhapScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "DangNhap"
>;

export default function DangNhap() {
  // Khai báo state cho email và password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Trạng thái hiển thị mật khẩu
  const navigation = useNavigation<DangNhapScreenNavigationProp>();

  // Hàm xử lý khi nhấn nút Đăng Nhập
  const handleDangNhap = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu.");
      return;
    }

    try {
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      const userDoc = await firebase
        .firestore()
        .collection("users")
        .doc(user?.uid)
        .get();
      const UserData = userDoc.data();

      if (UserData) {
        Alert.alert("Thành công", "Đăng nhập thành công!");
        if (user?.uid) {
          if (UserData.role === "Admin") {
            navigation.navigate("HomeAdmin");
          } else {
            navigation.navigate("Home", {
              UserData: {
                id: user.uid,
                fullName: UserData.fullName,
                email: UserData.email,
                phone: UserData.phone, // Đảm bảo truyền phone
                role: UserData.role,
                avatarUri: UserData.avatarUri || "",
              },
            });
          }
        } else {
          Alert.alert("Lỗi", "Không tìm thấy ID người dùng.");
        }
      } else {
        Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng.");
      }
    } catch (error: any) {
      switch (error.code) {
        case "auth/invalid-email":
          Alert.alert("Lỗi", "Email không hợp lệ.");
          break;
        case "auth/user-not-found":
          Alert.alert("Lỗi", "Email không đúng hoặc tài khoản không tồn tại.");
          break;
        case "auth/wrong-password":
          Alert.alert("Lỗi", "Mật khẩu không đúng. Vui lòng thử lại.");
          break;
        default:
          Alert.alert(
            "Lỗi",
            "Đăng nhập thất bại do sự cố. Vui lòng thử lại sau."
          );
          break;
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible} // Hiển thị hoặc ẩn mật khẩu
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)} // Đổi trạng thái hiển thị
        >
          <Ionicons
            name={isPasswordVisible ? "eye" : "eye-off"} // Biểu tượng mắt
            size={24}
            color="#999"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("DangKy")}
        >
          <Text style={styles.buttonText}>Đăng Ký</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleDangNhap}>
          <Text style={styles.buttonText}>Đăng Nhập</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("QuenMatKhau")}>
        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
      </TouchableOpacity>
    </View>
  );
}
