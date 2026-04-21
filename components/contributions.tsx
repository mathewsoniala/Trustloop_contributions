import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Contribution, contributions as mockContributions } from "../Types/mockContribution";
import { mockGroupdata } from "../Types/mockdata";

const styles = StyleSheet.create({
  container: {
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(54, 52, 52, 0.5)",
  },
  modalView: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#999",
  },
  submitButton: {
    backgroundColor: "#469065",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  pickerContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#999",
  },
  pinModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  pinModalView: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  pinDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
    textAlign: "center",
  },
  pinInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 4,
    marginBottom: 15,
  },
});

const Contributions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contributions, setContributions] = useState(mockContributions);
  const [groupdata] = useState(mockGroupdata);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pin, setPin] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState("");

  // Derive unique users from existing contributions for dropdown
  const uniqueUsers = React.useMemo(() => {
    const userMap = new Map();
    contributions.forEach((contribution) => {
      if (!userMap.has(contribution.name)) {
        userMap.set(contribution.name, {
          name: contribution.name,
          phoneNumber: contribution.phoneNumber,
        });
      }
    });
    return Array.from(userMap.values());
  }, [contributions]);

  const [newContribution, setNewContribution] = useState({
    name: "",
    phoneNumber: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
  });

  // Auto-fill phone number when user is selected from dropdown
  useEffect(() => {
    if (selectedUserName) {
      const selectedUser = uniqueUsers.find((user) => user.name === selectedUserName);
      if (selectedUser) {
        setNewContribution((prev) => ({
          ...prev,
          name: selectedUserName,
          phoneNumber: selectedUser.phoneNumber,
        }));
      }
    }
  }, [selectedUserName, uniqueUsers]);

  const filteredContributions = contributions.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContributionItem = ({ item }: { item: Contribution }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "../userDetails",
          params: {
            id: item.id,
            name: item.name,
            phoneNumber: item.phoneNumber,
            amount: item.amount,
            date: item.Date,
            avatarUrl: item.avatarUrl,
          },
        })
      }
      activeOpacity={0.7}
    >
      <View style={styles.contributionItem}>
        <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
        <View style={styles.contributionDetails}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
          <Text style={styles.date}>{item.Date}</Text>
        </View>
        <Text style={styles.amount}>Ksh. {item.amount}</Text>
      </View>
    </TouchableOpacity>
  );

  const calculateTotalContributions = () => {
    const total = contributions.reduce((sum, item) => {
      const amountValue = parseFloat(item.amount.toString().replace(/[^0-9.-]+/g, ""));
      return sum + amountValue;
    }, 0);
    return total.toLocaleString("en-US", {
      style: "currency",
      currency: "KES",
    });
  };

  // When user clicks "Add" in the first modal, close it and show PIN prompt
  const handleAddPress = () => {
    if (!selectedUserName) {
      Alert.alert("Error", "Please select a user");
      return;
    }
    if (!newContribution.amount) {
      Alert.alert("Error", "Please enter an amount");
      return;
    }
    setAddModalVisible(false);   // close the add modal
    setPinModalVisible(true);    // open the PIN modal
  };

  // Process M-Pesa payment simulation
  const processPayment = () => {
    if (!pin || pin.length < 4) {
      Alert.alert("Error", "Please enter a valid PIN (at least 4 digits)");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const isSuccess = Math.random() < 0.8; // 80% success rate for demo

      setIsProcessing(false);
      setPinModalVisible(false);
      setPin("");

      if (isSuccess) {
        const newEntry = {
          id: Date.now().toString(),
          name: newContribution.name,
          phoneNumber: newContribution.phoneNumber,
          amount: parseFloat(newContribution.amount),
          Date: newContribution.date,
          avatarUrl: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? "men" : "women"}/${Math.floor(Math.random() * 100)}.jpg`,
        };

        setContributions([newEntry, ...contributions]);

        // Reset form
        setNewContribution({
          name: "",
          phoneNumber: "",
          amount: "",
          date: new Date().toISOString().split("T")[0],
          avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
        });
        setSelectedUserName("");

        Alert.alert(
          "Transaction Successful",
          `You have successfully added Ksh. ${newContribution.amount} from ${newContribution.name}.`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Transaction Failed",
          "M-Pesa payment failed. Please check your balance and try again.",
          [
            { text: "Retry", onPress: () => setPinModalVisible(true) },
            { text: "Cancel", style: "cancel" },
          ]
        );
      }
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Hello Mathews,</Text>

      <View style={styles.infoView}>
        <View style={styles.box}>
          <Text style={styles.title}>{groupdata.groupName}</Text>
        </View>
        <View>
          <Text style={styles.totalAmount}>Total: {calculateTotalContributions()}</Text>
        </View>
      </View>

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
          <MaterialIcons name="search" size={24} color="#000" style={{ marginRight: 10 }} />
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.contributionsTitle}>Contributions</Text>
        <FlatList
          data={filteredContributions}
          renderItem={renderContributionItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: 500 }}
        />
      </View>

      <View style={styles.addButton}>
        <TouchableOpacity onPress={() => setAddModalVisible(true)}>
          <MaterialIcons name="add" size={40} color="#f8f2f2" />
        </TouchableOpacity>
      </View>

      {/* Modal for adding contribution (with dropdown) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add New Contribution</Text>

            {/* Dropdown for user selection */}
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Select User</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedUserName}
                  onValueChange={(itemValue) => setSelectedUserName(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="-- Select a user --" value="" />
                  {uniqueUsers.map((user) => (
                    <Picker.Item key={user.name} label={user.name} value={user.name} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Phone Number (auto-filled, read-only) */}
            <TextInput
              style={[styles.modalInput, styles.disabledInput]}
              placeholder="Phone Number"
              value={newContribution.phoneNumber}
              editable={false}
              pointerEvents="none"
            />

            {/* Amount input */}
            <TextInput
              style={styles.modalInput}
              placeholder="Amount (KES)"
              keyboardType="numeric"
              value={newContribution.amount}
              onChangeText={(text) =>
                setNewContribution({ ...newContribution, amount: text })
              }
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setAddModalVisible(false);
                  setSelectedUserName("");
                  setNewContribution({
                    name: "",
                    phoneNumber: "",
                    amount: "",
                    date: new Date().toISOString().split("T")[0],
                    avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
                  });
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleAddPress}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* PIN Entry Modal – appears alone, without the add modal behind */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={pinModalVisible}
        onRequestClose={() => {
          setPinModalVisible(false);
          setPin("");
        }}
      >
        <View style={styles.pinModalOverlay}>
          <View style={styles.pinModalView}>
            <Text style={styles.modalTitle}>Enter M-Pesa PIN</Text>
            <Text style={styles.pinDescription}>
              You are about to pay Ksh. {newContribution.amount} from {newContribution.name}
            </Text>
            <TextInput
              style={styles.pinInput}
              placeholder="Enter PIN"
              keyboardType="numeric"
              secureTextEntry
              value={pin}
              onChangeText={setPin}
              maxLength={6}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setPinModalVisible(false);
                  setPin("");
                }}
                disabled={isProcessing}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={processPayment}
                disabled={isProcessing}
              >
                <Text style={styles.buttonText}>{isProcessing ? "Processing..." : "Confirm"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Contributions;