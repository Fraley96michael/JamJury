import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import firebase from "firebase/app";
import "firebase/firestore";
import { auth, db } from "./firebase";

const CompetitorSignUpScreen = ({ navigation, route }) => {
  const [competitorName, setCompetitorName] = useState("");
  const [crewName, setCrewName] = useState("");
  const battleId = route.params.battleId;

  const handleSignUp = async () => {
    if (!competitorName || !crewName) {
      Alert.alert(
        "Error",
        "Please enter both a competitor name and a crew name"
      );
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert(
          "Error",
          "You need to be signed in to sign up as a competitor"
        );
        return;
      }

      const competitor = {
        name: competitorName,
        crew: crewName,
        uid: user.uid,
      };
      const competeRef = db
        .collection("battles")
        .doc(battleId)
        .collection("competitors")
        .doc(user.uid);
      await competeRef.set({
        competitor,
      });

      Alert.alert("Success", "You have successfully signed up as a competitor");
      navigation.replace("CurrentCompetitonScreen", { battleId });
    } catch (error) {
      Alert.alert("Error", "Failed to sign up as a competitor");
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Competitor Name"
        onChangeText={(text) => setCompetitorName(text)}
        value={competitorName}
      />
      <TextInput
        placeholder="Crew Name"
        onChangeText={(text) => setCrewName(text)}
        value={crewName}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

export default CompetitorSignUpScreen;
