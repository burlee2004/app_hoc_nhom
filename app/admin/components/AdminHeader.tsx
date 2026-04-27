import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../user/screens/types/RootStackParamList';

type AdminHeaderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AdminAcc' | 'AdminAcc' | 'AdminAcc'>;

const AdminHeader = () => {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation<AdminHeaderScreenNavigationProp>();

  const handleSearch = (text: string) => {
    setSearchText(text);
    console.log('Search:', text);
  };

  const clearSearch = () => {
    setSearchText('');
  };

  const handleProfilePress = () => {
    navigation.navigate('AdminAcc');
  };

  const handleFilterPress = () => {
    navigation.navigate('AdminAcc');
  };

  const handleSearchPress = () => {
    navigation.navigate('AdminAcc');
  };

  return (
    <>
      {/* Spacer cho Status Bar */}
      <View style={styles.statusBarSpacer}>
        <StatusBar barStyle="light-content" backgroundColor="#444" />
      </View>

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <Image
            source={require('../../../assets/images/searchIcon.png')}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm..."
            placeholderTextColor="#aaa"
            value={searchText}
            onChangeText={handleSearch}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Image
                source={require('../../../assets/images/deleteIcon.png')}
                style={styles.deleteIcon}
              />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={handleFilterPress}>
          <Image
            source={require('../../../assets/images/filterICon.png')}
            style={styles.largeIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleProfilePress}>
          <Image
            source={require('../../../assets/images/userAdmin.png')}
            style={styles.largeIcon}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  statusBarSpacer: {
    height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#444',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#007bff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    flex: 1,
    marginRight: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#000',
  },
  deleteIcon: {
    width: 20,
    height: 20,
  },
  largeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default AdminHeader;