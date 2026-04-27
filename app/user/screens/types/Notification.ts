import {Message} from "./Message";
import UserData from "./UserData";
import Room from "./Room";
interface Notification {
    id: string;
    type: 'admin' | 'group' | 'user' | 'system'; // Loại thông báo
    title: string;
    content: Message;
    sender?: UserData; // ID người gửi (nếu có)
    state: string;
    UserData: UserData;
    room: Room;
    NotificationDetail: { notification: Notification };
}
export default Notification;