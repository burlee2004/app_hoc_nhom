import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    top: 10, // Khoảng cách từ đỉnh màn hình
    left: 10, // Khoảng cách từ cạnh trái
    zIndex: 10, // Đảm bảo nút menu luôn nằm phía trên các phần tử khác
    backgroundColor: '#007bff', // Màu nền (có thể thay đổi)
    padding: 10, // Khoảng cách bên trong
    borderRadius: 5, // Bo góc
    shadowColor: '#000', // Đổ bóng
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // Đổ bóng cho Android
  },
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
 
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#343a40',
    marginTop: 10,
  },
  input: {
    fontSize: 16,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ced4da',
    borderWidth: 1,
    marginTop: 5,
  },
  chartContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 8,
    marginBottom:50
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },

  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  details: {
    fontSize: 14,
    color: '#666',
  },

  // Thay đổi màu sắc của phần background avartar
  avatarContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#0f0', // green glow border
    shadowColor: '#0f0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0f0',
    borderRadius: 15,
    padding: 5,
    borderWidth: 1,
    borderColor: '#1c1c1e',
    shadowColor: '#0f0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    
  },
  background:{
    borderRadius: 20,
  padding: 20,
  backgroundColor: '#1c1c1e', // dark mode base
  width: '100%',
  height: '30%',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden', // 🔥 CHÍNH CHỖ NÀY GIÚP CHẶN TRÀN
  position: 'relative',
    },

  buttonRow: {
    flexDirection: 'row',
  justifyContent: 'space-between',
  width: screenWidth * 0.8, // 90% chiều rộng của màn hình
  marginTop: 10,
  alignSelf: 'center' // giúp canh giữa cho an toàn
  },
  editButton: {
    backgroundColor: '#6a1b9a',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    marginHorizontal: 5,
    shadowColor: '#ba68c8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  changePasswordButton: {
    backgroundColor: '#283593',
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 30,
  marginHorizontal: 5,
  shadowColor: '#7986cb',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.5,
  shadowRadius: 6,
  },
  signOutButton: {
    backgroundColor: '#b71c1c',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    marginHorizontal: 5,
    shadowColor: '#ef5350',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },


  // pass
 
});

export default styles;
