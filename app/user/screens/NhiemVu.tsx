import React, { useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Button,
  Alert,
} from 'react-native';

import { collection, addDoc, getDocs, deleteDoc,  query,
  where, doc, updateDoc } from 'firebase/firestore';
import firebase from '../../../FirebaseConfig';
import styles from '../styles/NhiemVuStyles';
import UserFooter from '../components/UserFooter';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth
import Task from '../screens/types/task';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import thư viện icon
import DateTimePicker from '@react-native-community/datetimepicker'; // Import thư viện DatePicker
// @ts-ignore
import { useNavigation } from '@react-navigation/native';
// @ts-ignore
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// @ts-ignore
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../screens/types/RootStackParamList'; // Đường dẫn đến file kiểu dữ liệu
import Subtask from './types/subtask'; // Thêm dòng này
import TaskDetail from "../screens/taskDetail"; // Import màn hình TaskDetail
import dayjs from 'dayjs';

// bỏ qua lỗi text View
import { LogBox } from 'react-native';
import { useEffect } from 'react';







const db = firebase.firestore();
const Stack = createNativeStackNavigator();
const NhiemVu = () => {

  const auth = getAuth(); // Lấy thông tin người dùng hiện tại
  const currentUserId = auth.currentUser?.uid; // ID người dùng hiện tại
  useEffect(() => {
    // Khi vào màn hình, tắt warning cụ thể
    LogBox.ignoreLogs([
      'Text strings must be rendered within a <Text> component',
    ]);
  
    return () => {
      // Khi rời khỏi màn hình, khôi phục lại
      LogBox.ignoreAllLogs(false); // Hoặc gọi LogBox.ignoreLogs([]) để clear
    };
  }, []);
  
  //---------------------------------------- chức năng chia sẻ Hàm 


  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [rooms, setRooms] = useState<{ id: string; name:string }[]>([]); // Danh sách phòng học
  const [friends, setFriends] = useState<{ id: string; fullName: string}[]>([]); // Danh sách bạn bè   
  // Lấy danh sách phòng học và bạn bè

  useEffect(() => {
    const fetchRooms = async () => {
      if (!currentUserId) return;
  
      const db = firebase.firestore();
  
      try {
        // 🔍 Chỉ lấy phòng học mà current user là thành viên
        const roomsSnapshot = await db
          .collection('rooms')
          .where('membersId', 'array-contains', currentUserId)
          .get();
  
        const roomsData = roomsSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || 'Phòng không tên',
        }));
  
        setRooms(roomsData);
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách phòng học:", error);
      }
    };
  
    fetchRooms();
  }, [currentUserId]);
  


// Hàm chia sẻ nhiệm vụ
const shareTask = async (targetId: string, targetType: 'room' | 'friend') => {
  try {
    const db = firebase.firestore();

    if (targetType === 'room') {
      // Chia sẻ vào phòng học
      await db.collection('rooms').doc(targetId).collection('sharedTasks').add({
        taskId: selectedTask?.id,
        taskTitle: selectedTask?.title,
        taskDeadline: selectedTask?.deadline,
        sharedBy: currentUserId,
        timestamp: firebase.firestore.Timestamp.now(),
      });
    } else if (targetType === 'friend') {
      // Chia sẻ với bạn bè
      await db.collection('users').doc(targetId).collection('sharedTasks').add({
        taskId: selectedTask?.id,
        taskTitle: selectedTask?.title,
        taskDeadline: selectedTask?.deadline,
        sharedBy: currentUserId,
        timestamp: firebase.firestore.Timestamp.now(),
      });
    }

    Alert.alert('Thành công', 'Nhiệm vụ đã được chia sẻ!');
    setShareModalVisible(false);
  } catch (error) {
    console.error('Lỗi khi chia sẻ nhiệm vụ:', error);
    Alert.alert('Lỗi', 'Không thể chia sẻ nhiệm vụ. Vui lòng thử lại.');
  }
};





  //-------------------------------------------- end



  // định dạng ngày tháng
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false); // Trạng thái hiển thị DatePicker
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'NhiemVu'>>(); // Sử dụng kiểu dữ liệu
  
  const handleConfirm = (date: Date) => {
    // Xử lý khi chọn ngày
    const formattedDate = dayjs(date).format('DD/MM/YYYY'); // Định dạng ngày (YYYY-MM-DD)
    setNewTask({ ...newTask, deadline: formattedDate });
    
    hideDatePicker();
  };

 
  

  const [filter, setFilter] = useState('Tất cả');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false); // Modal cập nhật
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // Nhiệm vụ được chọn để cập nhật
  const [modalVisible, setModalVisible] = useState(false);
  const [filterExpanded, setFilterExpanded] = useState(false); // Trạng thái mở rộng bộ lọc
  const [newTask, setNewTask] = useState({
    title: '',
    deadline: '',
    status: 'Đang thực hiện',
    description: '',
    assignedBy: '',
    createdAt: new Date().toISOString().split('T')[0],
    attachments: [],
  });
 



 

    // Lấy danh sách nhiệm vụ của người dùng hiện tại
    const fetchTasks = async () => {
      if (!currentUserId) return; // Nếu không có người dùng hiện tại, không tải nhiệm vụ

      const querySnapshot = await getDocs(
        query(collection(db, 'tasks'), where('createdBy', '==', currentUserId))
      );
      const tasksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      console.log('Danh sách nhiệm vụ:', tasksData); // Kiểm tra dữ liệu
      setTasks(tasksData);

      
    };
    // update task
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        fetchTasks(); // Tải lại danh sách nhiệm vụ khi quay lại màn hình
      });
    
      return unsubscribe;
    }, [navigation]);



   // Thêm nhiệm vụ mới
   const addTask = async () => {
    if (!currentUserId) {
      console.error('Không thể thêm nhiệm vụ: Không tìm thấy ID người dùng hiện tại.');
      return;
    }

    // Kiểm tra xem tên nhiệm vụ đã tồn tại chưa
    const exitstingTask = tasks.find((task) => task.title === newTask.title);
    if (exitstingTask) {
      Alert.alert('Lỗi', 'Nhiệm vụ đã tồn tại. Vui lòng chọn tên khác.');
      
      return;
    }




    const newTaskWithCreator = {
      ...newTask,
      createdBy: currentUserId, // Thêm ID người tạo
      progress: 0, // Giá trị mặc định cho progress
      subtasks: [], // Danh sách nhiệm vụ con mặc định
    };

    try {
    await addDoc(collection(db, 'tasks'), newTaskWithCreator);
    fetchTasks(); // Tải lại danh sách nhiệm vụ
    setModalVisible(false); // Đóng modal
    setNewTask({
      title: '',
      deadline: '',
      status: 'Đang thực hiện',
      description: '',
      assignedBy: '',
      createdAt: new Date().toISOString().split('T')[0],
      attachments: [],
    }); // xóa thông tin các trường nhập liệu
    console.log('Nhiệm vụ đã được thêm thành công');

  } catch (error) {
    console.error('Lỗi khi thêm nhiệm vụ: ', error);
    Alert.alert('Đã xảy ra lỗi khi thêm nhiệm vụ. Vui lòng thử lại sau.');
  }
}
    
// xóa nhiệm vụ
  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, 'tasks', id));
    fetchTasks();
  };
 // Cập nhật nhiệm vụ
 const updateTask = async () => {
  if (!selectedTask || !selectedTask.id){
    console.error('Không tìm thấy nhiệm vụ được chọn hoặc ID không hợp lệ.');
    return;

  } ;

  try {
    await updateDoc(doc(db, 'tasks', selectedTask.id), {
      title: selectedTask.title,
      deadline: selectedTask.deadline,
      description: selectedTask.description,
      assignedBy: selectedTask.assignedBy,
      status: selectedTask.status,
    });
    fetchTasks();
    setUpdateModalVisible(false); // Đóng modal cập nhật
    Alert.alert('Thành công', 'Nhiệm vụ đã được cập nhật.');
  } catch (error) {
    console.error('Lỗi khi cập nhật nhiệm vụ:', error);
    Alert.alert('Lỗi', 'Không thể cập nhật nhiệm vụ. Vui lòng thử lại.');
  }
};

  const countTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status).length;
  };

  const filteredTasks = tasks.filter(
    (task) =>
      filter === 'Tất cả' ||
      (filter === 'Đang thực hiện' && task.status === 'Đang thực hiện') ||
      (filter === 'Đã hoàn thành' && task.status === 'Đã hoàn thành') ||
      (filter === 'Quá hạn' && task.status === 'Quá hạn')
  );

 

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskCard}>
    <View style={styles.taskHeader}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text
        style={[
          styles.taskStatus,
          item.status === 'Đang thực hiện'
            ? styles.statusInProgress
            : item.status === 'Đã hoàn thành'
            ? styles.statusCompleted
            : styles.statusOverdue,
        ]}
      >
        {item.status}
      </Text>
    </View>
    <Text style={styles.taskDeadline}>Hạn chót: {item.deadline}</Text>    
      
        {/* Nút Chi tiết */}
        <TouchableOpacity
        style={styles.detailButton}
        onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })} // Điều hướng với ID nhiệm vụ
      >
        <Text style={styles.detailButtonText}>Chi tiết</Text>
      </TouchableOpacity>

     {/* Thêm hàng chứa nút sửa và xóa */}
     <View style={styles.actionButtonsContainer}>
     <TouchableOpacity
        style={styles.detailButton}
        onPress={() => {
          setSelectedTask(item); // Gán nhiệm vụ được chọn
          setUpdateModalVisible(true); // Hiển thị modal cập nhật
        }}
      >
    <Text style={styles.actionButtonText}>Cập nhật</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={styles.actionButton}
    onPress={() => deleteTask(item.id)}
  >
    <Text style={styles.actionButtonText}>Xóa</Text>
  </TouchableOpacity>
  
      <TouchableOpacity
        style={styles.shareButton}
        onPress={() => {
          setSelectedTask(item); // Gán nhiệm vụ được chọn
          setShareModalVisible(true); // Hiển thị modal chia sẻ
        }}
      >
        <Text style={styles.shareButtonText}>Chia sẻ</Text>
      </TouchableOpacity> 



</View>
</View>
    






  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nhiệm vụ</Text>
      </View>

     {/* Bộ lọc */}
<View style={styles.filterContainer}>
  <TouchableOpacity
    style={styles.filterIconButton}
    onPress={() => setFilterExpanded(!filterExpanded)}
  >
    <Icon name="filter-list" size={24} color="#fff" /> {/* Icon cho bộ lọc */}
  </TouchableOpacity>
  {filterExpanded && (
    <View style={styles.filterDropdown}>
    {['Tất cả', 'Đang thực hiện', 'Đã hoàn thành', 'Quá hạn'].map((status) => (
      <TouchableOpacity
        key={status}
        style={[
          styles.filterOption,
          filter === status && styles.filterOptionActive,
        ]}
        onPress={() => {
          setFilter(status);
          setFilterExpanded(false); // Thu gọn sau khi chọn
        }}
      >
        <Text
          style={[
            styles.filterOptionText,
            filter === status && styles.filterOptionTextActive,
          ]}
        >
          {status} ({status === 'Tất cả' ? tasks.length : countTasksByStatus(status)})
        </Text>
      </TouchableOpacity>
    ))}
  </View>
  )}
</View>

      {/* Danh sách nhiệm vụ */}
      <FlatList
      data={filteredTasks}
      keyExtractor= {(item) => item.id}
      renderItem={renderTask}
      contentContainerStyle={styles.taskList}
      extraData={tasks}
      />

      {/* Nút thêm nhiệm vụ */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Thêm nhiệm vụ</Text>
      </TouchableOpacity>

      {/* Modal thêm nhiệm vụ */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.TitleTask}>Tạo nhiệm vụ</Text>
           
          

            {/* Tiêu đề */}
            <TextInput
              style={styles.input}
              placeholder="Tiêu đề"
              value={newTask.title}
              onChangeText={(text) => setNewTask({ ...newTask, title: text })}
            />
              {/* Hạn chót */}
              
              <TouchableOpacity
              style={styles.datePickerButton}
              onPress={showDatePicker}
            >
              <Text style={styles.datePickerText}>
                {newTask.deadline ? newTask.deadline : 'Ngày hết hạn'}
              </Text>
            </TouchableOpacity>

            {/* DateTimePicker */}
            {isDatePickerVisible && (
              <DateTimePicker
              value={new Date()} // Ngày mặc định
              mode="date" // Chỉ chọn ngày
              display="default" // Kiểu hiển thị
              onChange={(event, date) => {
                if (date) {
                  // Định dạng ngày thành dd/mm/yyyy
                  const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
                    .toString()
                    .padStart(2, '0')}/${date.getFullYear()}`;
                  setNewTask({ ...newTask, deadline: formattedDate });
                }
                setDatePickerVisibility(false); // Ẩn DatePicker sau khi chọn
              }}
            />
            )}


            {/* Mô tả */}
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Mô tả"
                  value={newTask.description}
                  onChangeText={(text) => setNewTask({ ...newTask, description: text })}
                  multiline={true} // Cho phép nhập nhiều dòng
                  numberOfLines={4} // Số dòng hiển thị mặc định
                />

            {/* Người giao */}
            <TextInput
              style={styles.input}
              placeholder="Người giao"
              value={newTask.assignedBy}
              onChangeText={(text) => setNewTask({ ...newTask, assignedBy: text })}
            />
            <View style={styles.modalButtonsContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={addTask}>
              <Text style={styles.modalButtonText}>Thêm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Hủy</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>  
              
        {/* Modal cập nhật nhiệm vụ */}
        {/* Modal cập nhật nhiệm vụ */}
{selectedTask && (
  <Modal
    animationType="slide"
    transparent={true}
    visible={updateModalVisible}
    onRequestClose={() => setUpdateModalVisible(false)}
  >
    <View style={styles.modalContainer}>
     
      <View style={styles.modalContent}>
        <Text style={styles.TitleTask}>Cập nhật nhiệm vụ</Text>

        {/* Tiêu đề */}
        <TextInput
          style={styles.input}
          placeholder="Tiêu đề"
          value={selectedTask.title}
          onChangeText={(text) =>
            setSelectedTask({ ...selectedTask, title: text })
          }
        />

        {/* Hạn chót */}
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setDatePickerVisibility(true)}
        >
          <Text style={styles.datePickerText}>
            {selectedTask.deadline ? selectedTask.deadline : 'Ngày hết hạn'}
          </Text>
        </TouchableOpacity>

        {isDatePickerVisible && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              if (date) {
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
                  .toString()
                  .padStart(2, '0')}/${date.getFullYear()}`;
                setSelectedTask({
                  ...selectedTask,
                  deadline: formattedDate,
                });
              }
              setDatePickerVisibility(false);
            }}
          />
        )}

        {/* Mô tả */}
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Mô tả"
          value={selectedTask.description}
          onChangeText={(text) =>
            setSelectedTask({ ...selectedTask, description: text })
          }
          multiline
        />

        {/* Người giao */}
        <TextInput
          style={styles.input}
          placeholder="Người giao"
          value={selectedTask.assignedBy}
          onChangeText={(text) =>
            setSelectedTask({ ...selectedTask, assignedBy: text })
          }
        />

        {/* Trạng thái */}
        <Text style={styles.label}>Trạng thái:</Text>
        <View style={styles.radioGroup}>
          {['Đang thực hiện', 'Đã hoàn thành', 'Quá hạn'].map((status) => (
            <TouchableOpacity
              key={status}
              style={styles.radioButton}
              onPress={() =>
                setSelectedTask({ ...selectedTask, status })
              }
            >
              <View
                style={[
                  styles.radioCircle,
                  selectedTask.status === status &&
                    styles.radioCircleSelected,
                ]}
              />
              <Text style={styles.radioText}>{status}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.modalButtonsContainer}>
          <TouchableOpacity style={styles.modalButton} onPress={updateTask}>
            <Text style={styles.modalButtonText}>Cập nhật</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={() => setUpdateModalVisible(false)}>
            <Text style={styles.modalButtonText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
)}


  {/* Modal chia sẻ nhiệm vụ */}

  <Modal
  animationType="slide"
  transparent={true}
  visible={shareModalVisible}
  onRequestClose={() => setShareModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Chia sẻ nhiệm vụ</Text>
      
      <Text style={styles.modalSubtitle}>Chọn phòng học</Text>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: {item: {id: string; name: string} }) => (
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => shareTask(item.id, 'room')}
          >
            <Text style={styles.modalItemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      
      <TouchableOpacity
        style={styles.modalCloseButton}
        onPress={() => setShareModalVisible(false)}
      >
        <Text style={styles.modalCloseButtonText}>Đóng</Text>
      </TouchableOpacity>
      </View>
    </View>
  </Modal>

  {/*---------------------------------------------------------- END */}

      <UserFooter />
    </View>
  );
};

export default NhiemVu;