import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  Modal,
} from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "./types/RootStackParamList";

type EditProfileRouteProp = RouteProp<RootStackParamList, "EditProfile">;

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/dzysrtemd/image/upload`;
const UPLOAD_PRESET = "vfk2qscm";

const EditProfile: React.FC = () => {
  const route = useRoute<EditProfileRouteProp>();
  const navigation = useNavigation();
  const { userId, fullName, avatarUri } = route.params;

  const [name, setName] = useState(fullName || "");
  const [avatar, setAvatar] = useState(avatarUri || "");
  const [phone, setPhone] = useState(""); // Thêm state cho số điện thoại
  const [isModalVisible, setIsModalVisible] = useState(false);

  const pickImage = async () => {
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
        [{ resize: { width: 200, height: 200 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );
      uploadImage(manipResult.uri);
    }
  };

  const uploadImage = async (imageUri: string) => {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/png",
      name: "avatar.png",
    } as any);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.secure_url) {
        setAvatar(data.secure_url);
        Alert.alert("Thành công", "Ảnh đại diện đã được cập nhật!");
      } else {
        Alert.alert("Lỗi", "Không thể tải lên ảnh. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi tải ảnh:", error);
      Alert.alert("Lỗi", "Không thể tải lên ảnh. Vui lòng thử lại.");
    }
  };

  const handleSave = async () => {
    try {
      await firebase.firestore().collection("users").doc(userId).update({
        fullName: name,
        avatarUri: avatar,
        phone: phone, // Lưu số điện thoại vào Firestore
      });
      Alert.alert("Thành công", "Thông tin đã được cập nhật!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(), // Quay lại trang Profile
        },
      ]);
    } catch (error) {
      console.error("Lỗi khi lưu thông tin:", error);
      Alert.alert("Lỗi", "Không thể lưu thông tin. Vui lòng thử lại.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <Image
          source={{ uri: avatar || "https://default-avatar.com" }}
          style={styles.avatar}
        />
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <Image
            source={{ uri: avatar || "https://default-avatar.com" }}
            style={styles.modalImage}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
        <Text style={styles.pickImageText}>Đổi ảnh đại diện</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Họ và Tên:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nhập họ và tên"
      />

      <Text style={styles.label}>Số Điện Thoại:</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Nhập số điện thoại"
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 20,
  },
  pickImageButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  pickImageText: {
    color: "#fff",
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default EditProfile;
