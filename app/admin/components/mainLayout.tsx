import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';

interface AdminLayoutProps {
  children: React.ReactNode; // Định nghĩa kiểu cho children
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <AdminHeader />

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Sidebar */}
        <View style={[styles.sidebarContainer, isCollapsed && styles.sidebarCollapsed]}>
          <AdminSidebar isCollapsed={isCollapsed} />
        </View>

        {/* Nút toggle */}
        <TouchableOpacity
          style={[
            styles.toggleButton,
            isCollapsed ? styles.toggleButtonCollapsed : styles.toggleButtonExpanded,
          ]}
          onPress={() => setIsCollapsed(!isCollapsed)}
        >
          <Text style={styles.toggleButtonText}>{isCollapsed ? '>' : '<'}</Text>
        </TouchableOpacity>

        {/* Content Area */}
        <View style={styles.contentArea}>{children}</View>
      </View>

      {/* Footer */}
      <AdminFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', // Header và Footer nằm trên/dưới
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row', // Sidebar nằm cạnh nội dung chính
  },
  sidebarContainer: {
    backgroundColor: '#555',
    width: 200, // Chiều rộng mặc định
   
  },
  sidebarCollapsed: {
    width: 0, // Thu gọn hoàn toàn
  },
  toggleButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -50 }],
    width: 25,
    height: 45,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Đảm bảo nút nằm trên sidebar
    borderRadius:10,
    
  },
  toggleButtonExpanded: {
    left: 195, // Nằm ngoài sidebar khi mở rộng
  },
  toggleButtonCollapsed: {
    left: 0, // Sát mép màn hình khi thu gọn
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});

export default AdminLayout;
