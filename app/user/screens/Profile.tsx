import { BarChart } from "react-native-chart-kit";
import UserFooter from "../components/UserFooter";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
// @ts-ignore
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
// @ts-ignore
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types/RootStackParamList";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/ProfileStyles";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
// hiệu ứng
import { Ionicons } from "@expo/vector-icons";

import { useEffect, useRef } from "react";
import { Animated } from "react-native";
type MatrixColumnProps = {
  left: number;
};

const screenWidth = Dimensions.get("window").width;

const CLOUD_NAME = "dzysrtemd";
const API_KEY = "981718876592958"; // Thay thế bằng API key của bạn
const UPLOAD_PRESET = "vfk2qscm"; // Thay thế bằng upload preset của bạn
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

type ProfileRouteProp = RouteProp<RootStackParamList, "Profile">;
type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Profile"
>;

export default function Profile() {
  const route = useRoute<ProfileRouteProp>();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { UserData } = route.params || {}; // Nhận dữ liệu người dùng từ tham số điều hướng

  const [avatarUri, setAvatarUri] = useState(UserData.avatarUri || "");
  const [loading, setLoading] = useState(false);

  // Nếu không có thông tin người dùng, hiển thị thông báo lỗi
  if (!UserData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Không tìm thấy thông tin người dùng.</Text>
      </View>
    );
  }

  const pickImage = async () => {
    // Yêu cầu quyền truy cập thư viện ảnh
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Lỗi",
        "Bạn cần cấp quyền truy cập thư viện ảnh để chọn ảnh."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [
          { resize: { width: 200, height: 200 } },
          { crop: { originX: 0, originY: 0, width: 200, height: 200 } },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );
      uploadImage(manipResult.uri);
    }
  };

  const uploadImage = async (imageUri: string) => {
    setLoading(true);

    let formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/png",
      name: "avatar.png",
    } as any);

    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("api_key", API_KEY);

    try {
      let response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      let data = await response.json();
      console.log("Cloudinary Response:", data);

      setLoading(false);

      if (data.secure_url) {
        const transformedUrl = data.secure_url.replace(
          "/upload/",
          "/upload/q_auto,f_auto,w_200,h_200,c_fill,g_face,r_max/"
        );
        setAvatarUri(transformedUrl);
        saveAvatarUrlToFirestore(transformedUrl);
      } else {
        Alert.alert("Lỗi", "Không thể tải lên ảnh. Vui lòng thử lại.");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      Alert.alert("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const saveAvatarUrlToFirestore = async (imageUrl: string) => {
    try {
      await firebase.firestore().collection("users").doc(UserData.id).update({
        avatarUri: imageUrl,
      });
      Alert.alert("Thành công", "Ảnh đại diện đã được cập nhật!");
    } catch (error) {
      console.error("Save avatar URL error:", error);
      Alert.alert("Lỗi", "Không thể lưu URL ảnh. Vui lòng thử lại.");
    }
  };

  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };

  function rgba(r: number, g: number, b: number, opacity: number): string {
    return `rgba(${r},${g},${b},${opacity})`;
  }

  const handleSignOut = async () => {
    try {
      await firebase.auth().signOut();
      Alert.alert("Thành công", "Đăng xuất thành công!");
      navigation.navigate("DangNhap", {});
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại.");
    }
  };

  // hiệu ứng cho bg user
  const MatrixColumn: React.FC<MatrixColumnProps> = ({ left }) => {
    const fallAnim = useRef(new Animated.Value(0)).current;
    const screenHeight = Dimensions.get("window").height;

    // Generate random binary string
    const binaryString = Array.from({ length: 20 }, () =>
      Math.round(Math.random()).toString()
    ).join("\n");

    useEffect(() => {
      const loopAnimation = () => {
        fallAnim.setValue(0);
        Animated.timing(fallAnim, {
          toValue: 1,
          duration: 4000 + Math.random() * 2000, // random speed
          useNativeDriver: true,
        }).start(() => loopAnimation());
      };
      loopAnimation();
    }, []);

    const translateY = fallAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-screenHeight, screenHeight],
    });

    return (
      <Animated.Text
        style={{
          position: "absolute",
          left,
          color: "lime",
          fontSize: 16,
          fontFamily: "monospace",
          transform: [{ translateY }],
          opacity: 0.6,
        }}
      >
        {binaryString}
      </Animated.Text>
    );
  };

  const MatrixRain = () => {
    const screenWidth = Dimensions.get("window").width;
    const columns = [];

    for (let i = 0; i < screenWidth; i += 20) {
      columns.push(<MatrixColumn key={i} left={i} />);
    }

    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0, // fill cha, nhưng không vượt nếu cha có overflow: 'hidden'
          zIndex: -1, // để nó nằm dưới avatar
        }}
      >
        {columns}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* bg user*/}

          {/* Avatar Section */}
          <View style={styles.background}>
            {/* Matrix Code Rain */}
            <MatrixRain />

            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: avatarUri || "" }} // Placeholder avatar
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
                <Ionicons name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate("EditProfile", {
                    userId: UserData.id,
                    fullName: UserData.fullName,
                    avatarUri,
                  })
                }
              >
                <Text style={styles.buttonText}>detail Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.changePasswordButton}
                onPress={() =>
                  navigation.navigate("ResetPassword", { userId: UserData.id })
                }
              >
                <Text style={styles.buttonText}>Reset password</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.signOutButton}
                onPress={handleSignOut}
              >
                <Text style={styles.buttonText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Chart Section */}
          {/* User Info Section */}
          <View style={styles.infoContainer}>
            <Text style={styles.label}>ID Người Dùng:</Text>
            <TextInput
              style={styles.input}
              value={String(UserData.id) || "N/A"}
              editable={false}
            />

            <Text style={styles.label}>Họ và Tên:</Text>
            <TextInput
              style={styles.input}
              value={UserData.fullName || "N/A"}
              editable={false}
            />

            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={UserData.email || "N/A"}
              editable={false}
            />

            <Text style={styles.label}>Số Điện Thoại:</Text>
            <TextInput
              style={styles.input}
              value={UserData.phone || "N/A"}
              editable={false}
            />

            <Text style={styles.label}>Mật Khẩu:</Text>
            <TextInput
              style={styles.input}
              value={UserData.password || "********"}
              editable={false}
              secureTextEntry
            />

            <Text style={styles.label}>Vai Trò:</Text>
            <TextInput
              style={styles.input}
              value={UserData.role || "N/A"}
              editable={false}
            />
          </View>

          <BarChart
            data={chartData}
            width={screenWidth * 0.9}
            height={220}
            yAxisLabel="%"
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: "#1cc910",
              backgroundGradientFrom: "#eff3ff",
              backgroundGradientTo: "#efefef",
              decimalPlaces: 1,
              color: (opacity = 1) => rgba(0, 0, 0, opacity),
              labelColor: (opacity = 1) => rgba(0, 0, 0, opacity),
            }}
            style={styles.chart}
          />
        </ScrollView>
      </SafeAreaView>
      <UserFooter />
    </View>
  );
}
