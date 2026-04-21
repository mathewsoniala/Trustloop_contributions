import { useLocalSearchParams } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { contributions as mockContributions } from '../Types/mockContribution';

export default function UserDetails() {
  const { id, name, phoneNumber, amount, date, avatarUrl } = useLocalSearchParams();

  // Get ALL contributions by this user (including the current one)
  const userContributions = mockContributions.filter(
    (item) => item.name === name
  );

  // Calculate total of all contributions by this user
  const totalAll = userContributions.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const renderContributionItem = ({ item }: { item: any }) => (
    <View style={[styles.otherItem, item.id === id && styles.currentItem]}>
      <View>
        <Text style={styles.otherAmount}>Ksh. {item.amount}</Text>
        <Text style={styles.otherDate}>{item.Date}</Text>
      </View>
      {item.id === id && <Text style={styles.currentBadge}>Current</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.selectedUserBox}>
        <Image 
         source={{ uri: Array.isArray(avatarUrl) ? avatarUrl[0] : avatarUrl }} 
         style={styles.avatar} 
         />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.detail}>Phone: {phoneNumber}</Text>
          <Text style={styles.detail}>This contribution: Ksh. {amount}</Text>
          <Text style={styles.detail}>Date: {date}</Text>
        </View>
      </View>

      <View style={styles.otherSection}>
        <Text style={styles.otherTitle}>All Contributions by {name}</Text>
        {userContributions.length > 0 ? (
          <>
            <FlatList
              data={userContributions}
              renderItem={renderContributionItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              style={styles.otherList}
            />
            <Text style={styles.totalOther}>
              Total all contributions: Ksh. {totalAll.toLocaleString()}
            </Text>
          </>
        ) : (
          <Text style={styles.noOther}>No contributions found.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedUserBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginVertical: 2,
  },
  otherSection: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
  },
  otherTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  otherList: {
    flex: 1,
  },
  otherItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  currentItem: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  otherAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#469065',
  },
  otherDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  currentBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
    backgroundColor: '#e1f0ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  totalOther: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    textAlign: 'right',
  },
  noOther: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});