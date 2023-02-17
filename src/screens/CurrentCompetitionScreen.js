import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { db } from "./firebase";

const CurrentCompetitionScreen = ({ navigation, route }) => {
  const [pairs, setPairs] = useState([]);
  function createPairs(competitorsList) {
    const pairs = [];

    for (let i = 0; i < competitorsList.length - 1; i++) {
      for (let j = i + 1; j < competitorsList.length; j++) {
        const pair = {
          id: `pair${i}-${j}`,
          dancer1: competitorsList[i].competitor.name,
          dancer2: competitorsList[j].competitor.name,
          clickable: j === i + 1,
        };
        pairs.push(pair);
      }
    }

    console.log(pairs); // add this line to see the pairs generated

    return pairs;
  }

  useEffect(() => {
    if (!route.params.battleId) {
      return;
    }

    const battleId = route.params.battleId;
    const competitorsRef = db
      .collection("battles")
      .doc(battleId)
      .collection("competitors");

    // Listen for changes to the competitors collection
    const unsubscribe = competitorsRef.onSnapshot((querySnapshot) => {
      const competitorsList = [];
      querySnapshot.forEach((doc) => {
        competitorsList.push({ id: doc.id, ...doc.data() });
      });

      // Create the pairs based on the list of competitors
      const temp_Pair = createPairs(competitorsList);
      console.log("Competitors list:", competitorsList);
      console.log("Pairs:", temp_Pair);

      // Update the pairs collection in Firestore
      const pairsRef = db
        .collection("battles")
        .doc(battleId)
        .collection("pairs");
      temp_Pair.forEach((pair) => {
        pairsRef.doc(pair.id).set(pair);
      });
      setPairs(temp_Pair);
    });

    return () => unsubscribe();
  }, [route.params.battleId]);

  const handlePairPress = (pair) => {
    if (
      pair.clickable &&
      pair.dancer1 !== pair.dancer2 &&
      pair.dancer1 !== "" &&
      pair.dancer2 !== ""
    ) {
      navigation.navigate("VotingPage", {
        pairId: pair.id,
        battleId: route.params.battleId,
      });
    } else {
      console.log("You can't vote on this pair yet");
      console.log("Pair index:", pair);
    }
  };

  const renderPair = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handlePairPress(item)}>
        <Text>{`${item.dancer1} vs. ${item.dancer2}`}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Text>Current Competition:</Text>
      <FlatList
        data={pairs}
        renderItem={renderPair}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default CurrentCompetitionScreen;
