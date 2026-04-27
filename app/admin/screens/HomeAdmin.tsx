import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Adlayout from '../components/mainLayout';
import * as Animatable from 'react-native-animatable'; // Import thư viện animatable
import { styles } from '../styles/DashboardStyles';

const screenWidth = Dimensions.get('window').width;

const HomeAdmin = () => {
  const activityData = [
    { name: 'Giám sát hoạt động', population: 40, color: '#FF6384' },
    { name: 'Can thiệp xung đột', population: 25, color: '#36A2EB' },
    { name: 'Quản lý tài liệu', population: 20, color: '#FFCE56' },
    { name: 'Duyệt tài liệu', population: 15, color: '#4BC0C0' },
  ];

  const chatData = [
    { name: 'Theo dõi nội dung chat', population: 60, color: '#FF6384' },
    { name: 'tin nhắn vi phạm', population: 40, color: '#36A2EB' },
  ];

  return (
    <Adlayout>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Chào mừng đến với Admin Home!</Text>
        <Text style={styles.subtitle}>Giám sát và Quản lý Hệ thống</Text>

        {/* Quản lý hoạt động nhóm */}
          <Text>212312312 hoàng đẹp trai vãi cứt</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quản lý hoạt động nhóm</Text>
          <PieChart
            data={activityData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
              labelColor: () => '#333',
            }}
            accessor={'population'}
            backgroundColor={'transparent'}
            paddingLeft={'5'}
          />
        </View>

        {/* Quản lý Nội dung Chat */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quản lý Nội dung Chat</Text>
          <PieChart
            data={chatData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
              labelColor: () => '#333',
            }}
            accessor={'population'}
            backgroundColor={'transparent'}
            paddingLeft={'5'}
          />
        </View>

        {/* Quản lý Tài liệu */}
        <Animatable.View animation="fadeInUp" duration={2000} style={styles.section}>
          <Text style={styles.sectionTitle}>Hệ thống Quản lý Tài liệu</Text>
          <Animatable.Text animation="fadeIn" iterationCount="infinite" direction="alternate" style={styles.contentText}>
            - Tổng số tài liệu: 500
          </Animatable.Text>
          <Animatable.Text animation="fadeIn" iterationCount="infinite" direction="alternate" style={styles.contentText}>
            - Tài liệu vi phạm: 25
          </Animatable.Text>
          <Animatable.Text animation="fadeIn" iterationCount="infinite" direction="alternate" style={styles.contentText}>
            - Tài liệu đã duyệt: 475
          </Animatable.Text>
        </Animatable.View>

        {/* Thông báo Hệ thống */}
        <Animatable.View animation="fadeInUp" duration={2000} style={styles.section}>
          <Text style={styles.sectionTitle}>Thông báo Hệ thống</Text>
          <Animatable.Text animation="fadeIn" iterationCount="infinite" direction="alternate" style={styles.contentText}>
            - Thông báo gửi: 3
          </Animatable.Text>
          <Animatable.Text animation="fadeIn" iterationCount="infinite" direction="alternate" style={styles.contentText}>
            - Thông báo chờ gửi: 1
          </Animatable.Text>
        </Animatable.View>
      </ScrollView>
    </Adlayout>
  );
};

export default HomeAdmin;
