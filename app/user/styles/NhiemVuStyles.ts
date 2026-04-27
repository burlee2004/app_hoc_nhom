import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  header: {
    paddingVertical: 15,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'flex-end', // Đẩy phần filter sang bên phải
  },
  filterIconButton: {
    padding: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10, // Để căn sang bên trái
  },
  filterDropdown: {
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    padding: 10,
  },
  filterOption: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginVertical: 5,
  },
  filterOptionActive: {
    backgroundColor: '#4CAF50',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#333',
  },
  filterOptionTextActive: {
    color: '#fff',
  },
  taskList: {
    paddingVertical: 10,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10, // Thêm khoảng cách phía trên
  },

  actionButton: {
    paddingVertical: 10, // Tăng chiều cao của nút
    paddingHorizontal: 20, // Tăng chiều rộng của nút
    backgroundColor: '#4CAF50', // Màu nền cho nút
    borderRadius: 8, // Bo tròn góc nút
    marginLeft: 20, // Khoảng cách giữa các nút
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16, // Tăng kích thước chữ
    fontWeight: 'bold',
  },

  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  taskStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusInProgress: {
    color: '#FFC107',
  },
  statusCompleted: {
    color: '#4CAF50',
  },
  statusOverdue: {
    color: '#F44336',
  },
  taskDeadline: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  detailButton: {
    alignSelf: 'flex-end', // Đẩy nút sang bên phải
    backgroundColor: '#4CAF50', // Màu nền cho nút
    paddingVertical: 8, // Tăng chiều cao của nút
    paddingHorizontal: 15, // Tăng chiều rộng của nút
    borderRadius: 8, // Bo tròn góc nút
    marginTop: 10, // Thêm khoảng cách phía trên
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  TitleTask: {
    fontSize: 20, 
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 20,
  },

  // Styles for the modal and input fields
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 20, // Kích thước chữ lớn hơn
    fontWeight: 'bold', // Chữ đậm
    color: '#4CAF50', // Màu chữ (xanh lá cây)
    textAlign: 'center', // Căn giữa chữ
    marginBottom: 20, // Khoảng cách phía dưới
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
   
  modalButtonsContainer: {
    flexDirection: 'row', // Đặt các nút theo hàng ngang
    justifyContent: 'space-between', // Tạo khoảng cách đều giữa các nút
    marginTop: 20, // Thêm khoảng cách phía trên
  },
  modalButton: {
    flex: 1, // Để các nút chiếm đều không gian
    marginHorizontal: 5, // Thêm khoảng cách giữa các nút
    paddingVertical: 10, // Tăng chiều cao của nút
    backgroundColor: '#4CAF50', // Màu nền cho nút
    borderRadius: 8, // Bo tròn góc nút
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16, // Tăng kích thước chữ
    fontWeight: 'bold',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },

  // thêm nhiệm vụ
  datePickerButton: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    alignItems: 'center',
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100, // Chiều cao cho textarea
    textAlignVertical: 'top', // Căn chữ bắt đầu từ trên cùng
  },

  // cập nhật nhiệm vụ
 
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333', // Màu chữ
    },
    radioGroup: {
      flexDirection: 'column', // Hiển thị các radio button theo cột
      marginBottom: 20,
    },
    radioButton: {
      flexDirection: 'row', // Hiển thị vòng tròn và text theo hàng ngang
      alignItems: 'center',
      marginBottom: 10,
    },
    radioCircle: {
      width: 20,
      height: 20,
      borderRadius: 10, // Tạo hình tròn
      borderWidth: 2,
      borderColor: '#4CAF50', // Màu viền
      marginRight: 10, // Khoảng cách giữa vòng tròn và text
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioCircleSelected: {
      backgroundColor: '#4CAF50', // Màu nền khi được chọn
    },
    radioText: {
      fontSize: 16,
      color: '#333', // Màu chữ
    },

    // nhiệm vụ hoàn thành 
    progressBarContainer: {
      height: 10,
      width: '100%',
      backgroundColor: '#e0e0e0', // Màu nền của thanh
      borderRadius: 5,
      marginVertical: 5,
      overflow: 'hidden',
      marginTop: 20, // Khoảng cách phía trên
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


    // chia sẻ nhiệm vụ styles
    shareButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#2196F3', // Màu xanh dương
      borderRadius: 8,
      alignItems: 'center',
      marginLeft: 10, // Khoảng cách giữa các nút
    },
    shareButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },

    modalSubtitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
      textAlign: 'center',
    },
    modalItem: {
      padding: 15,
      marginVertical: 5,
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      alignItems: 'center',
    },
    modalItemText: {
      fontSize: 16,
      color: '#333',
    },
    modalCloseButton: {
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#F44336', // Màu đỏ
      borderRadius: 8,
      alignItems: 'center',
    },
    modalCloseButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    // END chia sẽ nhiệm vu





});

export default styles;