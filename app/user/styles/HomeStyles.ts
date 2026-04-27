import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F9F9F9',
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
    },
    notificationIcon: {
      position: 'relative',
    },
    notificationBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: '#FF3D00',
      borderRadius: 8,
      width: 16,
      height: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notificationText: {
      color: '#FFF',
      fontSize: 10,
      fontWeight: 'bold',
    },
    section: {
      backgroundColor: '#FFF',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#444',
    },
    sectionContent: {
      fontSize: 16,
      color: '#666',
      marginBottom: 12,
    },
    viewAllButton: {
      alignSelf: 'flex-end',
    },
    viewAllText: {
      fontSize: 14,
      color: '#1E90FF',
    },
    taskItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    taskName: {
      fontSize: 16,
      color: '#333',
    },
    taskStatus: {
      fontSize: 14,
      color: '#777',
    },
    groupItem: {
      marginBottom: 8,
    },
    groupName: {
      fontSize: 16,
      color: '#333',
    },
    groupButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 12,
    },
    createGroupButton: {
      backgroundColor: '#4CAF50',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 4,
    },
    joinGroupButton: {
      backgroundColor: '#2196F3',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 4,
    },
    groupButtonText: {
      color: '#FFF',
      fontSize: 14,
      fontWeight: 'bold',
    },

      content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
  });
  export default styles;