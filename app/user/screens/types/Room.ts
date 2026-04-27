import { Message } from "./Message";
interface Room {
  id: string;
  name: string;
  ownerId: string;
  membersId: string[];
  date: Date;
  description: string;
  messages: Message[];
  state: string;
  avatarUri?: string;
}
export default Room;
