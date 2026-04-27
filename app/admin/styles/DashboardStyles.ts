import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold', // Chữ đậm
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
    textShadowColor: '#000', // Màu bóng
    textShadowOffset: { width: 0, height: 3 }, // Độ lệch của bóng
    textShadowRadius: 5, // Độ mờ của bóng
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold', // Chữ đậm
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#000', // Màu bóng
    textShadowOffset: { width: 0, height: 2 }, // Độ lệch của bóng
    textShadowRadius: 3, // Độ mờ của bóng
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold', // Chữ đậm
    color: '#333',
    marginBottom: 15,
    textShadowColor: '#000', // Màu bóng
    textShadowOffset: { width: 0, height: 2 }, // Độ lệch của bóng
    textShadowRadius: 3, // Độ mờ của bóng
  },
  contentText: {
    fontSize: 16,
    fontWeight: 'bold', // Chữ đậm
    color: '#666',
    marginBottom: 10,
    textShadowColor: '#000', // Màu bóng
    textShadowOffset: { width: 0, height: 1 }, // Độ lệch của bóng
    textShadowRadius: 2, // Độ mờ của bóng
  },
  chartContainer: {
    marginVertical: 20,
  },
  legendContainer: {
    marginTop: 15,
    paddingLeft: 10,
  },
  legendText: {
    fontSize: 14,
   
    color: '#333',
    textShadowColor: '#000', // Màu bóng
    textShadowOffset: { width: 0, height: 1 }, // Độ lệch của bóng
    textShadowRadius: 2, // Độ mờ của bóng
  },
});
