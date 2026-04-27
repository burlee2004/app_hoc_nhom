import firebase from "firebase/compat/app";

export interface Message {
  id: string;
  content: string;
  image?: string | null;
  file?: string | null;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId?: string;
  timestamp: firebase.firestore.Timestamp;
  type: 'message' | 'task'; // Thêm thuộc tính type
}
export interface MessageWithTask extends Message {
  task?: {
    title: string;
    fileUrl: string;
    taskId: string;
    parentTaskId?: string; // ✅ Thêm dòng này để tránh lỗi TS
  };
}