import Subtask from './subtask'; // Import kiểu Subtask

interface Task {
  id: string;
  title: string;
  deadline: string;
  status: string;
  description: string;
  assignedBy: string;
  createdAt: string;
  attachments: string[];
  createdBy: string; // ID của người tạo nhiệm vụ
  subtasks: Subtask[]; // Danh sách nhiệm vụ con
  assignees: string[]; // Danh sách người thực hiện
  notes: string; // Ghi chú
  comments: string[]; // Danh sách bình luận
  progress: number; // Thêm thuộc tính progress (phần trăm hoàn thành)
  
}

export default Task;