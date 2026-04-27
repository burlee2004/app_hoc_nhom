import firebase from "firebase/compat/app";
import "firebase/compat/firestore"; // 👈 Thêm dòng này
export interface SharedTask {
  taskId: string;
  taskTitle: string;
  taskDeadline: string;
  sharedBy: string;
  timestamp: firebase.firestore.Timestamp;
  type: "task";
}
