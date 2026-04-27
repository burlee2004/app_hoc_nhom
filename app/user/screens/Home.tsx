import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { collection, getDocs, query, where } from "firebase/firestore";
import Layout from "../components/layout";
import firebase from "../../../FirebaseConfig";
import styles from "../styles/HomeStyle"; // Đường dẫn đến file styles/HomeStyle.ts
//@ts-ignore
import { useNavigation } from "@react-navigation/native"; // Thêm import này
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types/RootStackParamList";
import { createStackNavigator } from "@react-navigation/stack";
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

export default function Home() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [taskStats, setTaskStats] = useState({
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });
  const [roomStats, setRoomStats] = useState({
    created: 0,
    joined: 0,
  });

  // lấy dữ liệu người dùng từ firebase
  const [userName, setUserName] = useState("Người dùng"); // Trạng thái lưu tên người dùng
  const currentUserId = firebase.auth().currentUser?.uid || ""; // Lấy ID người dùng hiện tại
  const Stack = createStackNavigator<RootStackParamList>();
  const db = firebase.firestore();
  // Nếu bạn không có `updatedUserData`, hãy thay thế bằng dữ liệu phù hợp hoặc xóa nó
  const updatedUserData = { id: currentUserId, name: userName }; // Ví dụ dữ liệu tạm thời
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        if (currentUserId) {
          const userDoc = await db.collection("users").doc(currentUserId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setUserName(userData?.fullName || "Người dùng"); // Lấy tên đầy đủ từ Firestore
          } else {
            console.error("Không tìm thấy thông tin người dùng.");
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchUserName();
  }, [currentUserId]);

  // Lấy dữ liệu nhiệm vụ từ Firestore
  const fetchTaskStats = async () => {
    const tasksQuery = query(
      collection(db, "tasks"),
      where("createdBy", "==", currentUserId)
    );
    const querySnapshot = await getDocs(tasksQuery);

    let inProgress = 0;
    let completed = 0;
    let overdue = 0;

    querySnapshot.forEach((doc) => {
      const task = doc.data();
      if (task.status === "Đang thực hiện") inProgress++;
      else if (task.status === "Đã hoàn thành") completed++;
      else if (task.status === "Quá hạn") overdue++;
    });

    setTaskStats({ inProgress, completed, overdue });
  };

  // Lấy dữ liệu phòng học từ Firestore

  const fetchRoomStats = async () => {
    try {
      // Lấy tất cả các phòng mà người dùng đã tạo
      const createdRoomsQuery = query(
        collection(db, "rooms"),
        where("ownerId", "==", currentUserId)
      );
      const createdRoomsSnapshot = await getDocs(createdRoomsQuery);

      // Lấy tất cả các phòng mà người dùng là thành viên
      const joinedRoomsQuery = query(
        collection(db, "rooms"),
        where("membersId", "array-contains", currentUserId)
      );
      const joinedRoomsSnapshot = await getDocs(joinedRoomsQuery);

      // Lọc các phòng mà ownerId không phải là currentUserId
      const filteredRooms = joinedRoomsSnapshot.docs.filter(
        (doc) => doc.data().ownerId !== currentUserId
      );

      // Cập nhật thống kê phòng
      setRoomStats({
        created: createdRoomsSnapshot.size, // Số lượng phòng đã tạo
        joined: filteredRooms.length, // Số lượng phòng đã tham gia nhưng không phải là chủ sở hữu
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu phòng:", error);
    }
  };

  useEffect(() => {
    fetchTaskStats();
    fetchRoomStats();
  }, []);

  // chuyển chữ
  const opacity = useSharedValue(1); // Giá trị ban đầu của độ mờ
  const color = useSharedValue(0); // Giá trị ban đầu của màu sắc

  // Hiệu ứng nhấp nháy
  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        // 3 lần nhấp nháy nhanh
        withTiming(0, { duration: 100 }),
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 100 }),
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 100 }),
        withTiming(1, { duration: 100 }),
        // 1 lần nhấp nháy chậm
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1, // Lặp vô hạn
      true
    );
    // Hiệu ứng chuyển màu
    color.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 100 }), // Vàng
        withTiming(2, { duration: 100 }), // Xanh ngọc
        withTiming(3, { duration: 100 }), // Tím
        withTiming(0, { duration: 500 }) // Quay lại Vàng (chậm)
      ),
      -1, // Lặp vô hạn
      true
    );
  }, []);

  // Interpolate giá trị màu sắc
  const animatedStyle = useAnimatedStyle(() => {
    // Interpolate giá trị màu sắc
    const backgroundColor =
      color.value === 0
        ? "#f39c12" // Vàng
        : color.value === 1
          ? "#1abc9c" // Xanh ngọc
          : color.value === 2
            ? "#9b59b6" // Tím
            : "#f39c12"; // Mặc định quay lại Vàng

    return {
      opacity: opacity.value,
      color: backgroundColor,
    };
  });

  return (
    <Layout>
      <ScrollView style={styles.container}>
        {/* Chào mừng người dùng */}
        <View style={styles.welcomeContainer}>
          <Animated.Text style={[styles.welcomeText, animatedStyle]}>
            Welcome to HomePage !!
          </Animated.Text>
          <Text style={styles.subtitle}>
            Chào mừng bạn đến với ứng dụng học nhóm.
          </Text>
        </View>

        {/* Khung chứa tên người dùng với đôi cánh */}
        <View style={styles.shopContainer}>
          {/* Hình đôi cánh bên trái */}
          <Image
            source={require("../../../assets/images/leftWing.png")} // Thay bằng đường dẫn hình cánh trái
            style={styles.leftWing}
          />
          {/* Tiêu đề */}
          <Text style={styles.title}>{userName}</Text>
          {/* Hình đôi cánh bên phải */}
          <Image
            source={require("../../../assets/images/rightWing.png")} // Thay bằng đường dẫn hình cánh phải
            style={styles.rightWing}
          />
        </View>

        {/* danh sách các chức năng  */}
        {/* Thanh ngang */}
        <View style={styles.divider} />

        {/* Khung chứa các nút */}
        <View style={styles.buttonContainer}>
          {/* Chức năng 1 */}
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("MessageAllUser", {
                UserData: {
                  id: currentUserId, // ID người dùng hiện tại
                  fullName: userName, // Tên người dùng
                },
              })
            }
          >
            <Image
              source={require("../../../assets/images/friend.png")}
              style={styles.iconImage}
            />
            <Text style={styles.buttonText}>Bạn bè</Text>
          </TouchableOpacity>
          {/*END*/}

          {/* Chức năng 2 */}
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Image
              source={require("../../../assets/images/carlendarStudyIco.png")}
              style={styles.iconImage}
            />
            <Text style={styles.buttonText}>Chức năng 2</Text>
          </TouchableOpacity>

          {/* Chức năng 3 */}
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Image
              source={require("../../../assets/images/carlendarStudyIco.png")}
              style={styles.iconImage}
            />
            <Text style={styles.buttonText}>Chức năng 3</Text>
          </TouchableOpacity>

          {/* Chức năng 4 */}
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Image
              source={require("../../../assets/images/carlendarStudyIco.png")}
              style={styles.iconImage}
            />
            <Text style={styles.buttonText}>Chức năng 4</Text>
          </TouchableOpacity>
        </View>

        {/*end*/}

        {/* Group Box cho biểu đồ */}
        <View style={styles.groupBox}>
          <Text style={styles.groupBoxTitle}>Biểu đồ thống kê</Text>

          {/* Biểu đồ nhiệm vụ */}
          <View style={styles.Bieudo}>
            <Text style={styles.sectionTitle}>Nhiệm vụ</Text>
            <BarChart
              data={{
                labels: ["Đang thực hiện", "Đã hoàn thành", "Quá hạn"],
                datasets: [
                  {
                    data: [
                      taskStats.inProgress,
                      taskStats.completed,
                      taskStats.overdue,
                    ],
                  },
                ],
              }}
              width={Dimensions.get("window").width - 60} // Chiều rộng biểu đồ
              height={300} // Tăng chiều cao để dễ nhìn hơn
              yAxisLabel="" // Nhãn trục Y (để trống nếu không cần)
              yAxisSuffix="" // Hậu tố trục Y (để trống nếu không cần)
              fromZero={true} // Bắt đầu trục Y từ 0
              yAxisInterval={1} // Khoảng cách giữa các giá trị trên trục Y
              chartConfig={{
                backgroundColor: "#CFCFCF",
                backgroundGradientFrom: "#CFCFCF",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                fillShadowGradient: "#f1c40f",
                fillShadowGradientOpacity: 2,
                propsForBackgroundLines: {
                  strokeWidth: 2,
                  stroke: "#e3e3e3",
                  strokeDasharray: "4",
                },
                propsForLabels: {
                  fontSize: 14,
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              showValuesOnTopOfBars={true}
            />
          </View>

          {/* Biểu đồ phòng học */}
          <View style={styles.Bieudo}>
            <Text style={styles.sectionTitle}>Phòng học</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={[
                  {
                    name: "Phòng",
                    population: roomStats.created,
                    color: "#f39c12",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15,
                  },
                  {
                    name: "Phòng",
                    population: roomStats.joined,
                    color: "#3498db",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15,
                  },
                ]}
                width={Dimensions.get("window").width - 40}
                height={220}
                chartConfig={{
                  backgroundColor: "#1cc910",
                  backgroundGradientFrom: "#1cc910",
                  backgroundGradientTo: "#1cc910",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(255, 255, 255, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
              {/* Chú thích */}
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColorBox,
                      { backgroundColor: "#f39c12" },
                    ]}
                  />
                  <Text style={styles.legendText}>Phòng đã tạo</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColorBox,
                      { backgroundColor: "#3498db" },
                    ]}
                  />
                  <Text style={styles.legendText}>Phòng đã tham gia</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}
