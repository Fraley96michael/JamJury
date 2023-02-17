import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";
import { db } from "./firebase";
import { useNavigation } from "@react-navigation/core";
import { auth } from "./firebase";

const ActiveCompetitionScreen = () => {
  const [competitions, setCompetitions] = useState([]);
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigation = useNavigation();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
  };

  useEffect(() => {
    const unsubscribe = db
      .collection("competitionParticipants")
      .where("userId", "==", auth.currentUser?.uid)
      .onSnapshot((querySnapshot) => {
        const competitions = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          db.collection("competitions")
            .doc(data.competitionId)
            .get()
            .then((competitionDoc) => {
              const competitionData = competitionDoc.data();
              competitions.push({ id: competitionDoc.id, ...competitionData });
              setCompetitions(competitions);
            })
            .catch((error) => {
              console.error("Error getting competition: ", error);
            });
        });
      });
    return () => unsubscribe();
  }, []);

  const handleJoinCompetition = () => {
    db.collection("competitions")
      .where("code", "==", code.toUpperCase())
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          setErrorMessage("Invalid competition code");
        } else {
          const competition = querySnapshot.docs[0];
          db.collection("competitionParticipants")
            .add({
              userId: auth.currentUser?.uid,
              competitionId: competition.id,
              timestamp: new Date(),
            })
            .then(() => {
              // Success, do something
            })
            .catch((error) => {
              console.error("Error adding participant: ", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error joining competition: ", error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Competitions</Text>
      {competitions.length > 0 ? (
        <View style={styles.list}>
          {competitions.map((competition) => (
            <TouchableOpacity
              key={competition.id}
              style={styles.item}
              onPress={() =>
                navigation.navigate("RolePage", { battleId: competition.id })
              }
            >
              <Text style={styles.itemTitle}>{competition.name}</Text>
              <Text style={styles.itemCode}>Code: {competition.code}</Text>
              <Text style={styles.itemDetails}>
                Start Time: {competition.startTime.toDate().toString()}
              </Text>
              <Text style={styles.itemDetails}>
                End Time: {competition.endTime.toDate().toString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text>No active competitions found</Text>
      )}
      <Text style={styles.joinTitle}>Join a Competition</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter competition code"
        value={code}
        onChangeText={(text) => setCode(text)}
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Button title="Join" onPress={handleJoinCompetition} />
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  list: {
    flex: 1,
  },
  item: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemCode: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 5,
  },
  itemDetails: {
    fontSize: 14,
    marginBottom: 5,
  },
  joinTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default ActiveCompetitionScreen;
