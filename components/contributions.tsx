import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { contributions as mockContributions } from "../Types/mockContribution";
import { mockGroupdata } from "../Types/mockdata";

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // paddingTop: 20,
    backgroundColor: "#fbfbfb",
    paddingLeft: 20,
    paddingRight: 20,
    height: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
  },
  infoView: {
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderColor: "#272323",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#8e8e97",
    height: 130,
    marginTop: 10,
  },
  box: {
    paddingTop: 30,
    justifyContent: "center",
    width: "60%",
    backgroundColor: "",
    margin: 5,
    alignItems: "center",
  },
  totalAmount: {
    paddingBottom: 10,
    fontWeight: "600",
    fontSize: 18,
    textAlign: "left",
  },
  infoSearch: {
    paddingTop: 1,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderColor: "#272323",
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 3,
    backgroundColor: "#9b8a8a",
  },
  contributionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderBottomColor: "#bebbbb",
    borderBottomWidth: 2,
    paddingVertical: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  contributionDetails: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  phoneNumber: {
    fontSize: 12,
    color: "#565151",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#469065",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  contributionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 2,
  },
  nextContributionText: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  viewTransactions: {
    paddingVertical: 4,
    width: "100%",
    height: 55,
    backgroundColor: "#8e8e97",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 10,
  },
  transactionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  viewTransactionStyle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#181616",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#000",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    elevation: 5,
  },
});

const Contributions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contributions, setContributions] = useState(mockContributions);
  const [groupdata, setGroupdata] = useState(mockGroupdata);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  // filter contributions based on search query
  const filteredContributions = contributions.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // render mock contributions data as a list
  const renderContributionItem = ({
    item,
  }: {
    item: (typeof mockContributions)[0];
  }) => (
    <View style={styles.contributionItem}>
      <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
      <View style={styles.contributionDetails}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
        <Text style={styles.date}>{item.Date}</Text>
      </View>
      <Text style={styles.amount}>Ksh. {item.amount}</Text>
    </View>
  );

  const calculateTotalContributions = () => {
    const total = contributions.reduce((sum, item) => {
      const amountValue = parseFloat(
        item.amount.toString().replace(/[^0-9.-]+/g, ""),
      );
      return sum + amountValue;
    }, 0);
    return total.toLocaleString("en-US", {
      style: "currency",
      currency: "KES",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Hello Mathews,</Text>

      {/* Render group data from mockGroupdata */}
      <View style={styles.infoView}>
        <View style={styles.box}>
          <Text style={styles.title}>{groupdata.groupName}</Text>
        </View>
        <View>
          <Text style={styles.totalAmount}>
            Total contributions: {calculateTotalContributions()}
          </Text>
        </View>
      </View>

      {/* Render next contribution from mockGroupdata */}
      <Text style={styles.nextContributionText}>
        Next contribution will be on {groupdata.nextContribution}
      </Text>

      <View style={styles.infoSearch}>
        <TextInput
          placeholder="Search by name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ flex: 1, padding: 8, color: "#000" }}
        />
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <MaterialIcons
            name="search"
            size={24}
            color="#000"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.contributionsTitle}>Contributions</Text>
        <FlatList
          data={filteredContributions.slice(0, 7)} // Show only the first 5 contributions
          renderItem={renderContributionItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: 500 }}
        />
      </View>
      <>
        <View style={styles.addButton}>
          <TouchableOpacity onPress={() => setAddModalVisible(true)}>
            <MaterialIcons name="add" size={40} color="#f8f2f2" />
          </TouchableOpacity>
        </View>
      </>
    </SafeAreaView>
  );
};

export default Contributions;
