type UserData = {
  id: string;
  avatarUri?: string;
  fullName: string;
  [key: string]: any;
  email: string;
  password: string;
  role: string;

  gender?: string; // Thêm giới tính nếu cần
  birthday?: string; // Thêm ngày sinh nếu cần
  phone?: string; // Thêm số điện thoại nếu cần
  isRequestSent?: boolean; // Thuộc tính kiểm tra trạng thái "Đã gửi lời mời"
  isFriend?: boolean; // Thuộc tính kiểm tra trạng thái "Đã là bạn bè"
};
export default UserData;
