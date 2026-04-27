import { StyleSheet } from 'react-native';

const taskDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28, // Tăng kích thước tiêu đề
    fontWeight: 'bold',
    textAlign: 'center', // Căn giữa tiêu đề
    color: '#4CAF50', // Thêm màu sắc cho tiêu đề
    marginBottom: 20,
  },
  infoContainer: {
    borderWidth: 1, // Viền cho khung thông tin
    borderColor: '#ccc',
    borderRadius: 10, // Bo góc khung
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#f9f9f9', // Màu nền nhẹ cho khung
  },
  infoRow: {
    flexDirection: 'row', // Sắp xếp 2 thông tin trên 1 hàng
    justifyContent: 'space-between', // Cách đều các thông tin
    marginBottom: 10,
  },
  infoBox: {
    flex: 1, // Đảm bảo mỗi thông tin chiếm 1 nửa hàng
    marginHorizontal: 5, // Khoảng cách giữa các thông tin
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },

  label1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: 100, // Đặt chiều rộng cố định để căn đều các label
    textAlign: 'left', // Căn trái nội dung
    marginLeft: 5, // Khoảng cách giữa label và value
  },

  value: {
    fontSize: 16,
    color: '#555', // Màu mặc định
    fontWeight: '500', // Tăng độ đậm chữ
  },

  
value1: {
  fontSize: 16,
  color: '#555', // Màu mặc định
  fontWeight: '500', // Tăng độ đậm chữ
  flex: 1, // Để value chiếm không gian còn lại
  marginLeft: 10, // Khoảng cách giữa label và value
},

  subtask: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 3,
    marginRight: 10,
  },
  checkboxCompleted: {
    backgroundColor: '#4CAF50',
  },
  subtaskText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    marginTop: -10,
  },

  addButton1: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    marginTop: 10,
  },

  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButtonText1: {
    color: '#fff',
    fontWeight: 'bold',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  comment: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  assignee: {
    fontSize: 16,
    marginBottom: 5,
  },


  // thêm task con
  subtaskContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  subtaskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  subtaskDeadline: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  subtaskProgress: {
    fontSize: 14,
    color: '#4CAF50',
  },
  formContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },

  // xóa và chi tiết subtask
  detailButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
    flex: 1,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // mức độ hoàn thành 
  progressBarContainer: {
    height: 10,
    width: '100%',
    backgroundColor: '#e0e0e0', // Màu nền của thanh
    borderRadius: 5,
    marginVertical: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50', // Màu của thanh tiến trình
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    textAlign: 'right', // Căn phải để hiển thị phần trăm hoàn thành
  },


  colorPickerContainer: {
    marginVertical: 10,
  },
  colorOptions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
 
  checklistItem: {
    flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between', // Đảm bảo các nút nằm trong cùng dòng
  flexWrap: 'wrap', // Cho phép nội dung xuống dòng nếu quá dài
  marginBottom: 10,
  padding: 5,
  borderWidth: 1,
  borderColor: '#E0E0E0',
  borderRadius: 5,
  backgroundColor: '#F9F9F9',
  },
  addChecklistButton: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  }, 
  // modal chi tiêt nhiệm vụ
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền mờ
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  // mục tiêu
  addChecklistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Chiếm không gian còn lại
    overflow: 'hidden', // Ẩn nội dung tràn
    },
  
  checkboxChecked: {
    backgroundColor: '#4CAF50', // Màu xanh khi được chọn
  },
  checklistText: {
    fontSize: 16,
    color: '#000',
    flex: 1, // Chiếm không gian còn lại
    maxWidth: '80%', // Giới hạn chiều rộng tối đa
  },
  checklistTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#888', // Màu xám khi hoàn thành
  },
  
  deleteChecklistButton: {
    marginLeft: 10,
    backgroundColor: '#F44336', // Màu đỏ
    padding: 5,
    borderRadius: 5,
  },
  deleteChecklistButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // nhãn màu
  labelColorIndicator: {
    width: 50, // Kích thước nhãn màu
    height: 10,
    borderRadius: 5, // Hình tròn
    marginBottom: 15, // Khoảng cách giữa nhãn màu và nội dung
    alignSelf: 'flex-start', // Căn trái
  },

  // đính file
  attachmentsContainer: {
    marginTop: 20,
  },
  attachmentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  attachmentName: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  attachmentActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  openFileText: {
    color: "#2196F3",
    marginRight: 10,
  },
  deleteFileText: {
    color: "#F44336",
  },

  //thêm thành viên 
  memberItem: {
    padding: 8,
    marginVertical: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  


});

export default taskDetailStyles;