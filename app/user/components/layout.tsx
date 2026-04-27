import React from 'react';
import { View, StyleSheet } from 'react-native';
import UserHeader from './UserHeader';
import UserFooter from './UserFooter';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={styles.container}>
      <UserHeader />
      <View style={styles.content}>
        {children}
      </View>
      <UserFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    padding: 10,
  },
});

export default Layout;