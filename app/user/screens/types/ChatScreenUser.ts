import UserData from "./UserData";
import { Message } from "./Message";
interface ChatScreenUser {
  senderData: UserData; // Người gửi tin nhắn
  receiverData: UserData; // Người nhận tin nhắn
  messages: Message[]; // Danh sách tin nhắn
}
export default ChatScreenUser;
