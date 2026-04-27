import UserData from './UserData'; // Đảm bảo import đúng

export default interface Subtask {
  id: string;
  title: string;
  deadline: string;
  progress: number;
  completed: boolean;
  labelColor: string;
  description: string;
  checklist: { id: string; title: string; completed: boolean }[];
  attachments?: { name: string; url: string }[];
  members: UserData[]; // ✅ CHỖ NÀY NÈ
}
