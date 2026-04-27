import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  //---------- chào thành viên có đôi cánh

  // end----------------------------------

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  chartContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 25,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Hiệu ứng đổ bóng trên Android
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColorBox: {
    width: 15,
    height: 15,
    marginRight: 5,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 15,
    color: "#7F7F7F",
  },

  // chào thành viên

  welcomeContainer: {
    backgroundColor: "#3498db",
    marginBottom: 20,
    width: "100%", // Tràn viền
    borderRadius: 10,
    alignItems: "center", // Căn giữa nội dung theo chiều ngang
    justifyContent: "center", // Căn giữa nội dung theo chiều dọc
    paddingVertical: 20, // Thêm khoảng cách trên và dưới
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    overflow: "hidden", // Đảm bảo chữ không bị tràn ra ngoài
    textAlign: "center", // Căn giữa chữ
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    marginTop: 10, // Khoảng cách giữa chữ chạy và subtitle
    textAlign: "center", // Căn giữa subtitle
  },

  // groupBox biểu đồ
  groupBox: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Hiệu ứng đổ bóng trên Android
    width: "110%", // Chiều rộng 90% màn hình
    alignSelf: "center", // Căn giữa khung
  },
  groupBoxTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  Bieudo: {
    marginVertical: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Hiệu ứng đổ bóng trên Android
    width: "105%", // Chiều rộng 90% màn hình
    alignSelf: "center", // Căn giữa biểu đồ
  },

  // các nút chức năng chuyển trang của Home
  divider: {
    //thanh ngang
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 15,
  },

  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Cho phép các nút xuống dòng nếu không đủ chỗ
    justifyContent: "space-around",
    marginVertical: 15,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3498db",
    padding: 10, // Giảm padding để nút nhỏ hơn
    borderRadius: 10,
    width: 80, // Giảm chiều rộng của nút
    height: 80, // Giảm chiều cao của nút
    margin: 5, // Thêm khoảng cách giữa các nút
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    marginTop: 1,
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },
  iconImage: {
    width: 40, // Chiều rộng của icon
    height: 40, // Chiều cao của icon
    marginTop: 1, // Khoảng cách giữa icon và text
  },

  //----------------------//
  container1: {
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#e0f7fa",
    paddingBottom: 25,
    paddingTop: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    width: 100,
    height: 45,
    marginBottom: 10,
  },
  wingWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative", // Set position relative để quản lý vị trí của cánh
  },
  bigWingLeft: {
    position: "absolute",
    left: -10, // Đẩy cánh trái vào sát viền trái
    width: 50,
    height: 60,
  },
  bigWingRight: {
    position: "absolute",
    right: -20, // Đẩy cánh phải vào sát viền phải
    width: 50,
    height: 80,
  },
  nameContainer: {
    width: 120,
    height: 60,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(0, 121, 107, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 0, // Không đẩy cánh ra xa
  },

  // cánh
  shopContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 15, // Bo góc
    borderWidth: 2, // Độ dày viền
    borderColor: "#FFD700", // Màu viền vàng
    backgroundColor: "#4B0082", // Nền tím đậm
    shadowColor: "#000", // Màu đổ bóng
    shadowOffset: { width: 0, height: 4 }, // Đổ bóng xuống dưới
    shadowOpacity: 0.3, // Độ mờ của bóng
    shadowRadius: 5, // Bán kính bóng
    elevation: 5, // Hiệu ứng đổ bóng trên Android
    alignItems: "center", // Căn giữa nội dung
    width: "80%", // Chiều rộng 100% màn hình
    alignSelf: "center", // Căn giữa thẻ
    position: "relative", // Để chứa các hình ảnh đôi cánh
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700", // Màu chữ vàng
    textShadowColor: "#000", // Màu bóng chữ
    textShadowOffset: { width: 2, height: 2 }, // Đổ bóng chữ
    textShadowRadius: 3, // Bán kính bóng chữ
  },
  leftWing: {
    position: "absolute",
    left: -50, // Đặt vị trí cánh trái
    top: "50%",
    width: 60, // Chiều rộng cánh
    height: 60, // Chiều cao cánh
    resizeMode: "contain", // Giữ tỉ lệ hình ảnh
  },
  rightWing: {
    position: "absolute",
    right: -50, // Đặt vị trí cánh phải
    top: "50%",
    width: 60, // Chiều rộng cánh
    height: 60, // Chiều cao cánh
    resizeMode: "contain", // Giữ tỉ lệ hình ảnh
  },
});

export default styles;
