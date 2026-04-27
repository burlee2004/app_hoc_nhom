import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  Modal,
  
} from 'react-native';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
// @ts-ignore
import { useRoute, RouteProp } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import firebase from '../../../FirebaseConfig';
import Task from './types/task'; // Import kiểu dữ liệu Task
import Subtask from './types/subtask'; // Import kiểu dữ liệu Subtask
import taskDetailStyles from '../styles/taskDetailStyles'; // Import taskDetailStyles
import * as DocumentPicker from 'expo-document-picker';
import UpFile from "../components/UpFile";
import  UserData  from './types/UserData';
import { useNavigation } from '@react-navigation/native';




const TaskDetail = () => {
  const navigation = useNavigation();
  const db = firebase.firestore();
  
  type RootStackParamList = {
   TaskDetail: { taskId: string; viewOnly?: boolean; subtaskOnlyForUser?: string, openSubtaskId?: string; };
  };
  

  const route = useRoute<RouteProp<RootStackParamList, 'TaskDetail'>>();
  const { taskId, viewOnly, subtaskOnlyForUser, openSubtaskId} = route.params;
  console.log("🧭 Đã điều hướng tới TaskDetail với taskId:", taskId);
    // ✅ Thêm dòng này:
    const currentUserId = firebase.auth().currentUser?.uid || '';

  // Tạo form chi tiết nhiệm vụ con
  const [isEditingSubtask, setIsEditingSubtask] = useState<boolean>(false);
  const [editingSubtask, setEditingSubtask] = useState<Subtask | null>(null);

  const [isAddingSubtask, setIsAddingSubtask] = useState<boolean>(false);
  const [task, setTask] = useState<Task | null>(null);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState<string>('');
  const [assignees, setAssignees] = useState<string[]>([]);
  const [newAssignee, setNewAssignee] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState<string>('');

  // const fetchTaskDetails = async () => {
  //   try {
  //     const taskDoc = await getDoc(doc(db, 'tasks', taskId));
  //     if (taskDoc.exists()) {
  //       const taskData = taskDoc.data() as Task;;
  //       const filteredSubtasks = taskData.subtasks || []
  //       setTask(taskData);
  //       setSubtasks(filteredSubtasks);
  //     } else {
  //       Alert.alert('Lỗi', 'Không tìm thấy nhiệm vụ.');
  //     }
  //   } catch (error) {
  //     Alert.alert('Lỗi', 'Không thể tải chi tiết nhiệm vụ.');
  //   }
  // };

  useEffect(() => {
    fetchTaskDetails();
  }, []);

  // add subtask
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [newSubtaskDeadline, setNewSubtaskDeadline] = useState<Date | null>(null);
  const [newChecklistItem, setNewChecklistItem] = useState<string>(''); // Khai báo state
  const isOwner = task?.createdBy === currentUserId;
  const isAssigned = editingSubtask?.members?.some((m) => m.id === currentUserId);
  
  const fetchTaskDetails = async () => {
    try {
      const taskDoc = await getDoc(doc(db, 'tasks', taskId));
      console.log('🧭 Đã điều hướng tới TaskDetail với taskId:', taskId);

      if (taskDoc.exists()) {
        const taskData = taskDoc.data() as Task;
        // Lọc subtask nếu có subtaskOnlyForUser
      let filteredSubtasks = taskData.subtasks || [];
      if (subtaskOnlyForUser) {
        filteredSubtasks = filteredSubtasks.filter(subtask =>
          subtask.members?.some(m => m.id === subtaskOnlyForUser)
        );
      }
        setTask({
            id: taskDoc.id,
            title: taskData.title,
            deadline: taskData.deadline, // Ngày hết hạn
            status: taskData.status, // Trạng thái nhiệm vụ
            description: taskData.description,
            assignedBy: taskData.assignedBy, // Người giao nhiệm vụ
            createdAt: taskData.createdAt,
            attachments: taskData.attachments,
            createdBy: taskData.createdBy,
            subtasks: taskData.subtasks || [],
            assignees: taskData.assignees || [],
            notes: taskData.notes || '',
            comments: taskData.comments || [],
            progress: taskData.progress || 0, // Thêm giá trị mặc định cho progress
        });
        setSubtasks(filteredSubtasks);
        if (openSubtaskId) {
          const subtaskToOpen = filteredSubtasks.find(st => st.id === openSubtaskId);
          if (subtaskToOpen) {
            setEditingSubtask({
              ...subtaskToOpen,
              checklist: subtaskToOpen.checklist || [],
            });
            setIsEditingSubtask(true);
          }
        }
        setAssignees(taskData.assignees || []);
        setNotes(taskData.notes || '');
        setComments(taskData.comments || []);
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy nhiệm vụ.');
      }
    } catch (error) {
      console.error('Lỗi khi tải chi tiết nhiệm vụ:', error);
    Alert.alert('Lỗi', 'Không thể tải chi tiết nhiệm vụ.');
    }
  };

  // ADĐ SUBTASK--------------------------//
  // Hàm thêm nhiệm vụ con

    const addSubtask = async () => {
      if (newSubtask.trim() === '' || !newSubtaskDeadline) {
        Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin.');
        return;
      }
    
      const updatedSubtasks = [...subtasks];
      const editingIndex = subtasks.findIndex((subtask) => subtask.title === newSubtask);
    
      if (editingIndex !== -1) {
        // Chỉnh sửa nhiệm vụ con
        updatedSubtasks[editingIndex] = {
          ...updatedSubtasks[editingIndex],
          title: newSubtask,
          deadline: newSubtaskDeadline.toISOString(),
        };
      } else {
        // Thêm nhiệm vụ con mới
        updatedSubtasks.push({
          id: Date.now().toString(), // Tạo ID duy nhất dựa trên timestamp
          title: newSubtask,
          deadline: newSubtaskDeadline.toISOString(),
          progress: 0,
          completed: false,
          labelColor: "#FFFFFF", // Giá trị mặc định cho nhãn màu sắc
          description: "", // Giá trị mặc định cho mô tả
          checklist: [], // Giá trị mặc định cho danh sách mục tiêu
          members: [], // danh sách ID người được thêm vào nhiệm vụ con

        });
      }
      
      setSubtasks(updatedSubtasks);
      setNewSubtask('');
      setNewSubtaskDeadline(null);
      setIsAddingSubtask(false);
    
      try {
        await updateDoc(doc(db, 'tasks', taskId), { subtasks: updatedSubtasks });
        Alert.alert('Thành công', editingIndex !== -1 ? 'Nhiệm vụ con đã được cập nhật.' : 'Nhiệm vụ con đã được thêm.');
      } catch (error) {
        console.error('Lỗi khi cập nhật nhiệm vụ con:', error);
      }
    };
  // END ADD SUBTASK--------------------------//


  const toggleSubtask = async (index: number) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
    setSubtasks(updatedSubtasks);

    try {
      await updateDoc(doc(db, 'tasks', taskId), { subtasks: updatedSubtasks });
    } catch (error) {
      console.error('Lỗi khi cập nhật nhiệm vụ con:', error);
    }
  };

  const addAssignee = async () => {
    if (newAssignee.trim() === '') return;

    const updatedAssignees = [...assignees, newAssignee];
    setAssignees(updatedAssignees);
    setNewAssignee('');

    try {
      await updateDoc(doc(db, 'tasks', taskId), { assignees: updatedAssignees });
      Alert.alert('Thành công', 'Người thực hiện đã được thêm.');
    } catch (error) {
      console.error('Lỗi khi thêm người thực hiện:', error);
    }
  };

  const addComment = async () => {
    if (newComment.trim() === '') return;

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    setNewComment('');

    try {
      await updateDoc(doc(db, 'tasks', taskId), { comments: updatedComments });
      Alert.alert('Thành công', 'Bình luận đã được thêm.');
    } catch (error) {
      console.error('Lỗi khi thêm bình luận:', error);
    }
  };

  const updateNotes = async () => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), { notes });
      Alert.alert('Thành công', 'Ghi chú đã được cập nhật.');
    } catch (error) {
      console.error('Lỗi khi cập nhật ghi chú:', error);
    }
  };

  if (!task) {
    return (
      <View style={taskDetailStyles.container}>
        <Text>Đang tải chi tiết nhiệm vụ...</Text>
      </View>
    );
  }

  //--------------------------------------------//

    // Hàm xóa nhiệm vụ con
    const deleteSubtask = async (index: number) => {
      const subtask = subtasks[index];
      if (task?.createdBy !== currentUserId) {
        Alert.alert("Không có quyền", "Chỉ người giao nhiệm vụ mới có thể xóa.");
        return;
      }
      const updatedSubtasks = subtasks.filter((_, i) => i !== index);
      setSubtasks(updatedSubtasks);
      try {
        await updateDoc(doc(db, 'tasks', taskId), { subtasks: updatedSubtasks });
        Alert.alert('Thành công', 'Nhiệm vụ con đã được xóa.');
      } catch (error) {
        console.error('Lỗi khi xóa nhiệm vụ con:', error);
      }
    };

    // Hàm mở form chi tiết nhiệm vụ con
    const openSubtaskDetail = (index: number) => {
      const subtask = subtasks[index];
      const isAssignedToUser = subtask.members?.some((m) => m.id === currentUserId);
     
      
      if (!isAssignedToUser && !isOwner) {
        Alert.alert('Không có quyền', 'Bạn không được phép xem nhiệm vụ con này.');
        return;
      }
      setEditingSubtask({
        ...subtask
      });
      setIsEditingSubtask(true); // Hiển thị form chi tiết
    };

    //component chọn bạn bè và gửi qua chat screen----------------------------------------------------------------//
    
    
    const AddMembers = ({ onSelect }: { onSelect: (user: UserData) => void }) => {
      const [friends, setFriends] = useState<UserData[]>([]);
      const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
      const currentUserId = firebase.auth().currentUser?.uid || '';
      const isRestrictedView = !!subtaskOnlyForUser;

    
      useEffect(() => {
        const fetchFriends = async () => {
          const db = firebase.firestore();
          const userDoc = await db.collection('users').doc(currentUserId).get();
          const friendIds = userDoc.data()?.friends || [];
    
          const data: UserData[] = [];
          for (const id of friendIds) {
            const friendDoc = await db.collection('users').doc(id).get();
            if (friendDoc.exists) data.push({ id, ...friendDoc.data() } as UserData);
          }
          setFriends(data);
        };
    
        fetchFriends();
      }, []);
    
      return (
        <View>
          <Text style={taskDetailStyles.label}>Chọn thành viên:</Text>
          {friends.map((friend) => (
            <TouchableOpacity
              key={friend.id}
              style={[
                taskDetailStyles.memberItem,
                selectedUser?.id === friend.id && { backgroundColor: '#cceeff' },
              ]}
              onPress={() => setSelectedUser(friend)}
            >
              <Text>{friend.fullName}</Text>
            </TouchableOpacity>
          ))}
    
          <TouchableOpacity
            style={{
              backgroundColor: '#4caf50',
              padding: 10,
              marginTop: 10,
              borderRadius: 5,
              alignItems: 'center',
            }}
            disabled={!selectedUser}
            onPress={() => {
              if (selectedUser) {
                onSelect(selectedUser);
                setSelectedUser(null); // reset chọn sau khi thêm
              }
            }}
          >
            <Text style={{ color: 'white' }}>Thêm thành viên</Text>
          </TouchableOpacity>
        </View>
      );
    };
    


    const handleAddMember = async (selectedUser: UserData) => {
      // ✅ Chỉ người tạo nhiệm vụ được phép thêm thành viên
      if (task?.createdBy !== currentUserId) {
        Alert.alert("Không có quyền", "Chỉ người tạo nhiệm vụ mới có thể thêm thành viên.");
        return;
      }
    
      console.log('🔹 Thêm thành viên qua handleAddMember:', selectedUser);
    
      const currentUser = firebase.auth().currentUser;
      const senderId = currentUser?.uid ?? '';
      const senderName = currentUser?.displayName ?? 'Người giao';
    
      let updatedSubtask: any = null;
    
      setEditingSubtask((prev) => {
        if (!prev) return null;
    
        const members = prev.members ?? [];
    
        if (members.find((m) => m.id === selectedUser.id)) return prev;
    
        updatedSubtask = {
          ...prev,
          members: [...members, selectedUser],
        };
    
        return updatedSubtask;
      });
    
      await new Promise((resolve) => setTimeout(resolve, 100));
    
      const parentTaskId = updatedSubtask.parentTaskId;
    
      if (updatedSubtask) {
        await firebase.firestore().collection('messages').add({
          content: `📌 nhiệm vụ con: "${updatedSubtask.title}" đã được giao cho ${selectedUser.fullName}`,
          senderId: senderId,
          receiverId: selectedUser.id,
          participants: [senderId, selectedUser.id],
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          task: {
            title: updatedSubtask.title,
            taskId: updatedSubtask.id,
            fileUrl: '',
            parentTaskId: taskId,
          },
          senderName: senderName,
          type: 'task',
        });
      }
    
      (navigation as any).navigate('ChatScreen', {
        senderId: senderId,
        receiverId: selectedUser.id,
        taskId: parentTaskId,
      });
    };
    
    
    

    //--------------------------end-----------------------------//

  const isRestrictedView = !!subtaskOnlyForUser;
  const canAddSubtask = !subtaskOnlyForUser; // nghĩa là không bị hạn chế quyền
  const canEdit = (editingSubtask?.members?.some((m) => m.id === currentUserId) || task?.createdBy === currentUserId);

  const hasPermission =
  !viewOnly || editingSubtask?.members?.some((m) => m.id === currentUserId);

  return (
   
   
   
    <FlatList
    data={[{ key: 'content' }]} // Dữ liệu giả để hiển thị toàn bộ nội dung
    keyExtractor={(item) => item.key}
    renderItem={() => (

      
      <View style={taskDetailStyles.container}>
  {/* Tiêu đề nhiệm vụ */}
  <Text style={taskDetailStyles.title}>{task.title}</Text>

  {/* Khung chứa thông tin nhiệm vụ */}
  <View style={taskDetailStyles.infoContainer}>
    {/* Người giao nhiệm vụ và trạng thái */}
    <View style={taskDetailStyles.infoRow}>
      <View style={taskDetailStyles.infoBox}>
        <Text style={taskDetailStyles.label}>Người giao:</Text>
        <Text style={taskDetailStyles.value}>{task.assignedBy}</Text>
      </View>
      <View style={taskDetailStyles.infoBox}>
        <Text style={taskDetailStyles.label}>Ngày hết hạn:</Text>
        <Text style={taskDetailStyles.value}>{task.deadline}</Text>
      </View>
    </View>

      {/* Trạng thái và mô tả */}
      <View style={[taskDetailStyles.infoRow, { flexDirection: 'row', alignItems: 'center' }]}>
        <Text style={taskDetailStyles.label1}>Trạng thái:</Text>
        <Text
          style={[
            taskDetailStyles.value1,
            { marginLeft: 10 }, // Tạo khoảng cách giữa tiêu đề và dữ liệu
            task.status === 'Đang thực hiện' && { color: '#FFC107' }, // Màu vàng
            task.status === 'Đã hoàn thành' && { color: '#4CAF50' }, // Màu xanh lá cây
            task.status === 'Quá hạn' && { color: '#F44336' }, // Màu đỏ
          ]}
        >
          {task.status}
        </Text>
      </View>

    {/* Mô tả nhiệm vụ */}
    <View style={taskDetailStyles.infoBox}>
      <Text style={taskDetailStyles.label}>Mô tả:</Text>
      <Text style={taskDetailStyles.value}>{task.description}</Text>
    </View>
  </View>
          
  {/* Danh sách nhiệm vụ con */}
<Text style={taskDetailStyles.label}>Nhiệm vụ con:</Text>
<View style={{ flex: 1 }}>
  <FlatList
    data={subtasks}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item, index }) => {
      // ✅ Thêm kiểm tra quyền hạn ở đây
      if (isRestrictedView && !item.members?.some((m) => m.id === currentUserId)) {
        return null; // ❌ Không hiển thị subtask không được giao
      }
    
      return (
        <View style={taskDetailStyles.subtaskContainer}>
          {/* Nhãn màu sắc */}
          <View
            style={[
              taskDetailStyles.labelColorIndicator,
              { backgroundColor: item.labelColor || '#FFFFFF' },
            ]}
          />
          <Text style={taskDetailStyles.subtaskTitle}>Tên: {item.title}</Text>
          <Text style={taskDetailStyles.subtaskDeadline}>
            Deadline: {item.deadline ? new Date(item.deadline).toLocaleDateString('vi-VN') : 'Chưa đặt'}
          </Text>
    
          {/* Thanh progress */}
          <View style={taskDetailStyles.progressBarContainer}>
            <View
              style={[
                taskDetailStyles.progressBar,
                { width: `${item.progress || 0}%` },
              ]}
            />
          </View>
          <Text style={taskDetailStyles.progressText}>
            Hoàn thành: {item.progress || 0}%
          </Text>
    
          {/* Nút hành động */}
          <View style={taskDetailStyles.buttonRow}>
            <TouchableOpacity
              style={taskDetailStyles.detailButton}
              onPress={() => openSubtaskDetail(index)}
              disabled={isRestrictedView && !item.members?.some((m) => m.id === currentUserId)}
            >
              <Text style={taskDetailStyles.detailButtonText}>Chi tiết</Text>
            </TouchableOpacity>
    
            {task?.createdBy === currentUserId && (
              <TouchableOpacity
                style={taskDetailStyles.deleteButton}
                onPress={() => deleteSubtask(index)}
                disabled={isRestrictedView && !item.members?.some((m) => m.id === currentUserId)}
              >
                <Text style={taskDetailStyles.deleteButtonText}>Xóa</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    }}

  />
</View>

    {/* Nút thêm nhiệm vụ con */}
    {canAddSubtask && (
      isAddingSubtask ? (
        <View style={taskDetailStyles.formContainer}>
          <TextInput
            style={taskDetailStyles.input}
            placeholder="Tên nhiệm vụ con..."
            value={newSubtask}
            onChangeText={setNewSubtask}
          />
          <View style={[taskDetailStyles.infoRow, { flexDirection: 'row', alignItems: 'center' }]}>
            <Text style={taskDetailStyles.label}>Deadline:</Text>
            <TouchableOpacity
              style={{ flex: 1, marginLeft: 10, marginBottom: 5 }}
              onPress={() => setDatePickerVisibility(true)}
            >
              <Text style={taskDetailStyles.value}>
                {newSubtaskDeadline
                  ? newSubtaskDeadline.toLocaleDateString('vi-VN')
                  : 'Chọn Thời gian'}
              </Text>
            </TouchableOpacity>
          </View>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={(date) => {
              setDatePickerVisibility(false);
              setNewSubtaskDeadline(date);
            }}
            onCancel={() => {
              setDatePickerVisibility(false);
            }}
          />
          <View style={taskDetailStyles.buttonRow}>
            <TouchableOpacity
              style={taskDetailStyles.saveButton}
              onPress={addSubtask}
            >
              <Text style={taskDetailStyles.saveButtonText}>Lưu</Text>
            </TouchableOpacity>

            {hasPermission && (
              <TouchableOpacity
                style={taskDetailStyles.cancelButton}
                onPress={() => setIsAddingSubtask(false)}
              >
                <Text style={taskDetailStyles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        task?.createdBy === currentUserId && (
          <TouchableOpacity
            style={taskDetailStyles.addButton1}
            onPress={() => setIsAddingSubtask(true)}
          >
            <Text style={taskDetailStyles.addButtonText1}>Thêm nhiệm vụ con</Text>
          </TouchableOpacity>
        )
      )
    )}



  {/* ----------Form chi tiết nhiệm vụ con---------- */}



     {/* Form chi tiết nhiệm vụ con dưới dạng Modal */}
    
     <Modal
  visible={isEditingSubtask}
  animationType="slide"
  transparent={true}
  onRequestClose={() => {
    setIsEditingSubtask(false);
    setEditingSubtask(null);
  }}
>
  <View style={taskDetailStyles.modalOverlay}>
    <View style={taskDetailStyles.modalContainer}>
      {/* Tiêu đề */}
      <TextInput
  style={taskDetailStyles.input}
  placeholder="Tiêu đề nhiệm vụ con..."
  value={editingSubtask?.title || ''}
  onChangeText={(text) =>
    setEditingSubtask((prev) => ({
      ...(prev || {
        id: Date.now().toString(), // Tạo ID duy nhất dựa trên timestamp
        title: '', // Giá trị mặc định cho title
        deadline: '', // Giá trị mặc định cho deadline
        progress: 0, // Giá trị mặc định cho progress
        completed: false, // Giá trị mặc định cho completed
        labelColor: '#FFFFFF', // Giá trị mặc định cho labelColor
        description: '', // Giá trị mặc định cho description
        checklist: [], // Giá trị mặc định cho checklist
        members: [], // danh sách ID người được thêm vào nhiệm vụ con

      }),
      title: text || '', // Đảm bảo title luôn là string
    }))
  }
/>

      {/* Deadline */}
      <View style={[taskDetailStyles.infoRow, { flexDirection: 'row', alignItems: 'center' }]}>
        <Text style={taskDetailStyles.label}>Deadline:</Text>
        <TouchableOpacity
          style={{ flex: 1, marginLeft: 10, marginBottom: 5 }}
          onPress={() => setDatePickerVisibility(true)}
        >
          <Text style={taskDetailStyles.value}>
            {editingSubtask?.deadline
              ? new Date(editingSubtask.deadline).toLocaleDateString('vi-VN')
              : 'Chọn Thời gian'}
          </Text>
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
      isVisible={isDatePickerVisible}
      mode="date"
      onConfirm={(date) => {
        setDatePickerVisibility(false);
        setEditingSubtask((prev) => ({
          ...(prev || {
            id: Date.now().toString(), // Tạo ID duy nhất dựa trên timestamp
            title: '', // Giá trị mặc định cho title
            deadline: '', // Giá trị mặc định cho deadline
            progress: 0, // Giá trị mặc định cho progress
            completed: false, // Giá trị mặc định cho completed
            labelColor: '#FFFFFF', // Giá trị mặc định cho labelColor
            description: '', // Giá trị mặc định cho description
            checklist: [], // Giá trị mặc định cho checklist
            members: [], // danh sách ID người được thêm vào nhiệm vụ con

          }),
          deadline: date.toISOString(), // Đảm bảo deadline luôn là string
        }));
      }}
      onCancel={() => setDatePickerVisibility(false)}
    />

      {/* Nhãn màu sắc */}
<View style={taskDetailStyles.colorPickerContainer}>
  <Text style={taskDetailStyles.label}>Chọn màu nhãn:</Text>
  <View style={taskDetailStyles.colorOptions}>
    {/* Tùy chọn "Không có màu" */}
    <TouchableOpacity
      key="none"
      style={{
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#FFFFFF', // Màu trắng đại diện cho "None"
        margin: 5,
        borderWidth: editingSubtask?.labelColor === '#FFFFFF' ? 2 : 0,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={() =>
        setEditingSubtask((prev) => ({
          ...(prev || {
            id: Date.now().toString(), // Tạo ID duy nhất dựa trên timestamp
            title: '', // Giá trị mặc định cho title
            deadline: '', // Giá trị mặc định cho deadline
            progress: 0, // Giá trị mặc định cho progress
            completed: false, // Giá trị mặc định cho completed
            labelColor: '#FFFFFF', // Giá trị mặc định cho labelColor
            description: '', // Giá trị mặc định cho description
            checklist: [], // Giá trị mặc định cho checklist
            members: [], // danh sách ID người được thêm vào nhiệm vụ con

          }),
          labelColor: '#FFFFFF', // Đặt nhãn màu thành "None"
        }))
      }
    >
      <Text style={{ fontSize: 10, color: '#000' }}>None</Text>
    </TouchableOpacity>

    {/* Các tùy chọn màu sắc */}
    {[
      '#FFC107', // Vàng
      '#4CAF50', // Xanh lá
      '#F44336', // Đỏ
      '#2196F3', // Xanh dương
      '#9C27B0', // Tím
      '#FF5722', // Cam
      '#795548', // Nâu
      '#607D8B', // Xanh xám
    ].map((color) => (
      <TouchableOpacity
        key={color}
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: color,
          margin: 5,
          borderWidth: editingSubtask?.labelColor === color ? 2 : 0,
          borderColor: '#000',
        }}
        onPress={() =>
          setEditingSubtask((prev) => ({
            ...(prev || {
              id: Date.now().toString(), // Tạo ID duy nhất dựa trên timestamp
              title: '', // Giá trị mặc định cho title
              deadline: '', // Giá trị mặc định cho deadline
              progress: 0, // Giá trị mặc định cho progress
              completed: false, // Giá trị mặc định cho completed
              labelColor: '#FFFFFF', // Giá trị mặc định cho labelColor
              description: '', // Giá trị mặc định cho description
              checklist: [], // Giá trị mặc định cho checklist
              members: [], // danh sách ID người được thêm vào nhiệm vụ con

            }),
            labelColor: color, // Đặt nhãn màu thành màu được chọn
          }))
        }
      />
    ))}
  </View>
</View>

      {/* Mô tả */}
      <TextInput
        style={taskDetailStyles.textArea}
        placeholder="Mô tả nhiệm vụ con..."
        value={editingSubtask?.description || ''}
        onChangeText={(text) =>
          setEditingSubtask((prev) => ({
            ...(prev || {
              id: Date.now().toString(), // Tạo ID duy nhất dựa trên timestamp
              title: '', // Giá trị mặc định cho title
              deadline: '', // Giá trị mặc định cho deadline
              progress: 0, // Giá trị mặc định cho progress
              completed: false, // Giá trị mặc định cho completed
              labelColor: '#FFFFFF', // Giá trị mặc định cho labelColor
              description: '', // Giá trị mặc định cho description
              checklist: [], // Giá trị mặc định cho checklist
              members: [], // danh sách ID người được thêm vào nhiệm vụ con

            }),
            description: text || '', // Đảm bảo description luôn là string
          }))
        }
        multiline
      />
    

    {/* Checklist */}
<Text style={taskDetailStyles.label}>Mục tiêu thực hiện:</Text>
{(editingSubtask?.checklist || []).map((item, index) => (
  <View key={item.id} style={taskDetailStyles.checklistItem}>
    <TouchableOpacity
      style={taskDetailStyles.checkboxContainer}
      onPress={() => {
        const updatedChecklist = [...(editingSubtask?.checklist || [])];
        updatedChecklist[index].completed = !updatedChecklist[index].completed;
        const completedCount = updatedChecklist.filter((i) => i.completed).length;
        const progress = Math.round((completedCount / updatedChecklist.length) * 100);
        setEditingSubtask((prev) => ({
          ...(prev || {
            id: Date.now().toString(), // Tạo ID duy nhất dựa trên timestamp
            title: '', // Giá trị mặc định cho title
            deadline: '', // Giá trị mặc định cho deadline
            progress: 0, // Giá trị mặc định cho progress
            completed: false, // Giá trị mặc định cho completed
            labelColor: '#FFFFFF', // Giá trị mặc định cho labelColor
            description: '', // Giá trị mặc định cho description
            checklist: [], // Giá trị mặc định cho checklist
            members: [], // danh sách ID người được thêm vào nhiệm vụ con

          }),
          checklist: updatedChecklist,
          progress, // Cập nhật progress
        }));
      }}
    >
      <View
        style={[
          taskDetailStyles.checkbox,
          item.completed && taskDetailStyles.checkboxChecked,
        ]}
      />
      <Text
        style={[
          taskDetailStyles.checklistText,
          item.completed && taskDetailStyles.checklistTextCompleted,
        ]}
        numberOfLines={1} // Giới hạn hiển thị 1 dòng, nếu dài thì cắt
        ellipsizeMode="tail" // Hiển thị dấu "..." nếu nội dung bị cắt
      >
        {item.title}
      </Text>
    </TouchableOpacity>
    {/* Nút xóa mục tiêu */}
    <TouchableOpacity
      style={taskDetailStyles.deleteChecklistButton}
      onPress={() => {
        const updatedChecklist = (editingSubtask?.checklist || []).filter((_, i) => i !== index);
        const completedCount = updatedChecklist.filter((i) => i.completed).length;
        const progress = Math.round((completedCount / updatedChecklist.length) * 100);
        setEditingSubtask((prev) => ({
          ...(prev || {
            id: Date.now().toString(), // Tạo ID duy nhất dựa trên timestamp
            title: '', // Giá trị mặc định cho title
            deadline: '', // Giá trị mặc định cho deadline
            progress: 0, // Giá trị mặc định cho progress
            completed: false, // Giá trị mặc định cho completed
            labelColor: '#FFFFFF', // Giá trị mặc định cho labelColor
            description: '', // Giá trị mặc định cho description
            checklist: [], // Giá trị mặc định cho checklist
            members: [], // danh sách ID người được thêm vào nhiệm vụ con

          }),
          checklist: updatedChecklist,
          progress, // Cập nhật progress
        }));
      }}
    >
      <Text style={taskDetailStyles.deleteChecklistButtonText}>X</Text>
    </TouchableOpacity>
  </View>
))}

{/* Thêm mục tiêu */}
<View style={taskDetailStyles.addChecklistContainer}>
  <TextInput
    style={taskDetailStyles.input}
    placeholder="Nhập mục tiêu mới..."
    value={newChecklistItem}
    onChangeText={setNewChecklistItem}
  />
  <TouchableOpacity
    style={taskDetailStyles.addButton}
    onPress={() => {
      if (!newChecklistItem.trim()) return;

      const newChecklist = {
        id: Date.now().toString(),
        title: newChecklistItem.trim(),
        completed: false,
      };

      setEditingSubtask((prev) => ({
        ...(prev || {
          id: Date.now().toString(), // Tạo ID duy nhất dựa trên timestamp
          title: '', // Giá trị mặc định cho title
          deadline: '', // Giá trị mặc định cho deadline
          progress: 0, // Giá trị mặc định cho progress
          completed: false, // Giá trị mặc định cho completed
          labelColor: '#FFFFFF', // Giá trị mặc định cho labelColor
          description: '', // Giá trị mặc định cho description
          checklist: [], // Giá trị mặc định cho checklist
          members: [], // danh sách ID người được thêm vào nhiệm vụ con

        }),
        checklist: [...(prev?.checklist || []), newChecklist],
      }));

      setNewChecklistItem(''); // Xóa nội dung trong ô nhập liệu
    }}
  >
    <Text style={taskDetailStyles.addButtonText}>Thêm mục tiêu</Text>
  </TouchableOpacity>

  {/*thêm thanh viên cho nhiệm vụ con--------------------------------------------*/}
    
    
    </View>
    {task?.createdBy === currentUserId && (
      <AddMembers onSelect={handleAddMember} />
    )}
    <View>
      {editingSubtask?.members?.map((m) => (
        <View key={m.id} style={taskDetailStyles.memberItem}>
          <Text>{m.fullName}</Text>
        </View>
      ))}
    </View> 


    {/*end-------------------------------------*/}

    
      {/* đính file */}

      
      






        {/* end đính file */}
    

    {/* Nút lưu và hủy */}
    <View style={taskDetailStyles.buttonRow}>

      {/* Nút Lưu */}
      {canEdit && (
      <TouchableOpacity
        style={taskDetailStyles.saveButton}
        onPress={async () => {
          

          if (!editingSubtask) return;
          if (!isOwner && !isAssigned) {
            Alert.alert("Không có quyền", "Bạn không được phép chỉnh sửa nhiệm vụ con này.");
            return;
            }
        const updatedSubtasks = subtasks.map((subtask) => {
          if (subtask.id === editingSubtask.id) {
            // 🔒 Nếu là restricted view thì chỉ cập nhật nếu user được giao nhiệm vụ này
            
            return editingSubtask;
          }
          return subtask;
        });

          // Cập nhật state
          setSubtasks(updatedSubtasks);

          // Đồng bộ với Firestore
          try {
            await updateDoc(doc(db, 'tasks', taskId), { subtasks: updatedSubtasks });
            Alert.alert('Thành công', 'Nhiệm vụ con đã được cập nhật.');
          } catch (error) {
            console.error('Lỗi khi cập nhật nhiệm vụ con:', error);
            Alert.alert('Lỗi', 'Không thể cập nhật nhiệm vụ con.');
            return; // Thoát nếu có lỗi
          }

          // Đóng form sau khi cập nhật thành công
          setIsEditingSubtask(false);
          setEditingSubtask(null);
        }}
      >
        <Text style={taskDetailStyles.saveButtonText}>Lưu</Text>
      </TouchableOpacity>
      )}

      {/* Nút Hủy */}
      <TouchableOpacity
        style={taskDetailStyles.cancelButton}
        onPress={() => {
          setIsEditingSubtask(false);
          setEditingSubtask(null);
        }}
      >
        <Text style={taskDetailStyles.cancelButtonText}>Hủy</Text>
      </TouchableOpacity>
    </View>



    </View>
  </View>
</Modal>




    </View>
   )}
    />

  );
  
};


export default TaskDetail;