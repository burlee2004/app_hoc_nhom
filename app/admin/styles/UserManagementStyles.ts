import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Container chính của màn hình
  container: { 
    flex: 1, 
    padding: 10, 
    backgroundColor: '#f5f5f5', 
    width: '100%',
    minHeight: '100%'
  },
  
  // Container cho ScrollView
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  // Tiêu đề của màn hình
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  
  // Input chung cho các trường nhập liệu
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    marginBottom: 15, 
    borderRadius: 5, 
    backgroundColor: '#fff',
    width: '100%'
  },
  
  // Container cho các nút
  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  
  // Nút chung cho các hành động
  button: { 
    backgroundColor: '#FF9933', 
    padding: 15, 
    borderRadius: 5, 
    flex: 1, 
    marginHorizontal: 5 
  },
  // Nút chung cho các hành động
  buttonHuy: { 
    backgroundColor: '#FF0000', 
    padding: 15, 
    borderRadius: 5, 
    flex: 1, 
    marginHorizontal: 5 
  },
  // Văn bản của nút
  buttonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontSize: 16 
  },
  
  // Item của người dùng trong danh sách
  userItem: { 
    padding: 15, 
    backgroundColor: '#fff', 
    marginBottom: 10, 
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '95%'
  },
  
  // Văn bản của người dùng
  userText: { 
    fontSize: 16, 
    marginBottom: 5 
  },
  
  // Container cho các hành động của người dùng
  userActions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  
  // Nút hành động (Sửa, Xóa)
  actionButton: { 
    backgroundColor: '#4caf50', 
    padding: 10, 
    borderRadius: 5, 
    flex: 1, 
    marginHorizontal: 5 
  },
  actionButton1: { 
    backgroundColor: '#888888', 
    padding: 10, 
    borderRadius: 5, 
    flex: 1, 
    marginHorizontal: 5 
  },
  // Văn bản của nút hành động
  actionButtonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontSize: 14 
  },
  
  // Nút thêm người dùng
  addButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#2196f3', 
    padding: 10, 
    borderRadius: 5, 
    marginBottom: 20 
  },
  
  // Văn bản của nút thêm người dùng
  addButtonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontSize: 16, 
    marginLeft: 5 
  },
  
  // Container cho trường mật khẩu và biểu tượng mắt
  passwordContainer: { 
    flexDirection: 'row', 
    alignItems: 'center',
    width: '99%' 
  },
  
  // Biểu tượng mắt để hiển thị/ẩn mật khẩu
  eyeIcon: { 
    marginLeft: -30 
  },
  
  // Input cho trường mật khẩu
  passwordInput: {
    flex: 1
  }
});

export default styles;