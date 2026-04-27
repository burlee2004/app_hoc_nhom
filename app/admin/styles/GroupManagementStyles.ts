import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  scrollContainer: {
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 28, // Tăng kích thước tiêu đề
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18, // Tăng kích thước phụ đề
    color: '#666',
    marginBottom: 25,
  },
  groupCard: {
    backgroundColor: '#fff',
    borderRadius: 12, // Tăng độ bo góc
    marginBottom: 20, // Giãn cách giữa các nhóm
    padding: 20, // Tăng padding trong card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // Tạo bóng đổ rõ ràng hơn
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6, // Android shadow effect
  },
  groupInfo: {
    marginBottom: 20,
  },
  groupName: {
    fontSize: 20, // Tăng kích thước tên nhóm
    fontWeight: 'bold',
    color: '#333',
  },
  groupDescription: {
    fontSize: 16, // Tăng kích thước mô tả
    color: '#666',
    marginTop: 8,
  },
  groupMembers: {
    fontSize: 16, // Tăng kích thước thông tin thành viên
    color: '#888',
    marginTop: 8,
  },
  groupActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10, // Tăng padding trên và dưới của nút
    paddingHorizontal: 20, // Tăng padding trái và phải của nút
    borderRadius: 8, // Bo góc nút nhiều hơn
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 16, // Tăng kích thước chữ trong nút
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  input: {
    fontSize: 16,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
});