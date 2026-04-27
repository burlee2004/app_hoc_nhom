import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDDDDD',
    padding: 15,
  },
  scrollContainer: {
    padding: 10,
    flexGrow: 1,
  },
  avatarSection: {
    backgroundColor: '#CC9966',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    borderWidth: 2,
    borderColor: '#996600',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 10,
  },
  infoContainer: {
    backgroundColor: '#996600',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#bbb',
    marginTop: 10,
  },
  infoValue: {
    fontSize: 16,
    color: '#ddd',
    marginTop: 5,
  },
  toolsContainer: {
    backgroundColor: '#3a3a3a',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  toolsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  toolsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  toolItem: {
    backgroundColor: '#4a4a4a',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    margin: 5,
    flex: 1,
    alignItems: 'center',
  },
  toolText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 15,
  },
  editButton: {
    backgroundColor: '#f06292',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  changePasswordButton: {
    backgroundColor: '#ba68c8',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  signOutButton: {
    backgroundColor: '#ff8a65',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
});

export default styles;