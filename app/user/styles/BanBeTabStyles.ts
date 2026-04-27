import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { padding: 10 },
  searchInput: { borderWidth: 1, padding: 8, borderRadius: 5 },
  searchButton: { backgroundColor: 'blue', marginTop: 10, padding: 10 },
  buttonText: { color: 'white', textAlign: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
});

export default styles;