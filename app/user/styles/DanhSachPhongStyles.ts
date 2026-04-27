import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  tab: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#4CAF50",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  roomList: {
    flex: 1,
  },
  roomItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  roomName: {
    fontSize: 18,
  },
  actionContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  joinButton: {
    backgroundColor: "#FF9800",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  roomItemContainer: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  copyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  copyButton: {
    backgroundColor: "#3498db",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 5, // Khoảng cách giữa hai nút
  },
  tabButton: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  ownerActions: {
    flexDirection: "row",
    justifyContent: "flex-end", // Căn các nút về bên phải
    alignItems: "center",
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: "red", // Màu đỏ cho nút "Giải tán"
    padding: 8,
    borderRadius: 5,
  },
  roomAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
});
export default styles;
