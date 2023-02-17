import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import firebase from "firebase/app";
import "firebase/firestore";
import { auth, db } from "./firebase";

const RolePage = ({ navigation, route }) => {
  const [role, setRole] = useState("");

  const handleVotePress = async () => {
    const battleId = route.params.battleId;
    const user = auth.currentUser;
    const voteRef = db
      .collection("battles")
      .doc(battleId)
      .collection("votes")
      .doc(user.uid);

    try {
      await voteRef.set({ role: "voter" });
      navigation.navigate("VoterPage", { battleId });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompetePress = async () => {
    const battleId = route.params.battleId;
    const user = auth.currentUser;
    const competeRef = db
      .collection("battles")
      .doc(battleId)
      .collection("competitors")
      .doc(user.uid);

    try {
      await competeRef.set({ role: "competitor" });
      navigation.navigate("CompetitorSignUpScreen", { battleId });
    } catch (error) {
      console.error(error);
    }
  };

  const handleBothPress = async () => {
    const battleId = route.params.battleId;
    const user = auth.currentUser;
    const voteRef = db
      .collection("battles")
      .doc(battleId)
      .collection("votes")
      .doc(user.uid);
    const competeRef = db
      .collection("battles")
      .doc(battleId)
      .collection("competitors")
      .doc(user.uid);

    try {
      await voteRef.set({ role: "voter" });
      await competeRef.set({ role: "competitor" });
      navigation.navigate("CompetitorSignUpScreen", { battleId });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Text>Select your role:</Text>
      <TouchableOpacity onPress={handleVotePress}>
        <Text>Voter</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCompetePress}>
        <Text>Competitor</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleBothPress}>
        <Text>Both</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RolePage;
