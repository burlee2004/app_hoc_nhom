import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  roomTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  messageList: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageButton: {
    backgroundColor: '#FF9800',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fileButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  fileButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  messageContent: {
    flex: 1,
    maxWidth: "75%",
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  
  messageHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    justifyContent: 'flex-end',
  },
  senderName: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
    marginTop: 4,
  },
  messageBubble: {
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
  },
  currentUserBubble: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  otherUserBubble: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
  },
  currentUserContainer: {
    flexDirection: "row-reverse",

  },
  otherUserContainer: {
    flexDirection: "row",

  },
  messageText: {
    fontSize: 16,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
  },
  // supabase
  otherFileContainer: {
    alignItems: "center",
    padding: 10,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  webview: {
    width: "100%",
    height: 400,
  },
  fileInfoText: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  fileLinkText: {
    color: "#007bff", // Màu xanh giống như link
    textDecorationLine: "underline", // Gạch chân như link
    fontSize: 16,
    marginTop: 5,
  },
  uploadButton: {
    backgroundColor: "#6A5ACD", // Màu tím nhẹ, phù hợp chat app
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30, // Bo tròn nút
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5, // Hiệu ứng nổi trên Android
  },

  uploadButtonText: {
    color: "#fff", // Màu chữ trắng nổi bật
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1, // Khoảng cách giữa các chữ
  },
  iconButton: {
    padding: 8,
  },
  callButton: {
    backgroundColor: '#4CAF50', // Màu xanh lá cây nổi bật
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems:'flex-start',
    justifyContent: 'flex-start',
    marginVertical: 10,
  },
  callButtonText: {
    color: '#FFFFFF', // Màu trắng để dễ đọc
    fontSize: 16,
    fontWeight: 'bold',
  },
  // styles list of task was shared by user 
  sharedTask: {

    backgroundColor: '#f9f9f9', // Màu nền nhạt
    padding: 15, // Khoảng cách bên trong
    marginVertical: 8, // Khoảng cách giữa các mục
    borderRadius: 10, // Bo góc
    borderWidth: 1, // Đường viền
    borderColor: '#ddd', // Màu đường viền
    shadowColor: '#000', // Hiệu ứng đổ bóng
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Hiệu ứng đổ bóng trên Android
  }, 

  sharedTaskTitle: {
    fontSize: 18, // Kích thước chữ lớn hơn
    fontWeight: 'bold', // Chữ đậm
    color: '#333', // Màu chữ
    marginBottom: 5, // Khoảng cách dưới
  },
  sharedTaskDeadline: {
    fontSize: 16, // Kích thước chữ trung bình
    color: '#FF5722', // Màu cam để nổi bật
    marginBottom: 5, // Khoảng cách dưới
  },
  sharedTaskSharedBy: {
    fontSize: 14, // Kích thước chữ nhỏ hơn
    color: '#757575', // Màu xám
    fontStyle: 'italic', // Chữ nghiêng
  },

  downloadButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
 
  sentMessage: {
    backgroundColor: "#eeeeee",
    padding: 16,
    borderRadius: 16,
    maxWidth: "75%",
    marginBottom: 8,
    marginLeft: 8,
  },
  receivedMessage: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    maxWidth: "75%",
    marginBottom: 8,
    marginLeft: "auto",
  },
 

});

export default styles;