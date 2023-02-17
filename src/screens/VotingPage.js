import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { db } from "./firebase";

const VotingPage = ({ navigation, route }) => {
  const [pair, setPair] = useState(null);
  const [votedDancer, setVotedDancer] = useState(null);

  useEffect(() => {
    if (!route.params.pairId) {
      return;
    }

    const pairId = route.params.pairId;
    const battleId = route.params.battleId;
    console.log("Pair ID:", pairId);
    console.log("Battle ID:", battleId);

    const pairRef = db
      .collection("battles")
      .doc(battleId)
      .collection("pairs")
      .doc(pairId);

    const unsubscribe = pairRef.onSnapshot((doc) => {
      setPair(doc.data());
      console.log("Pair:", doc.data());
    });

    return () => unsubscribe();
  }, [route.params.pairId]);

  const handleVote = (dancer) => {
    console.log("Voting for", dancer);

    if (dancer === "dancer1" && pair.dancer1 !== route.params.competitor) {
      const pairRef = db
        .collection("battles")
        .doc(route.params.battleId)
        .collection("pairs")
        .doc(route.params.pairId);

      const newVotesDancer1 = votedDancer === "dancer1" ? 0 : 1;
      pairRef.update({
        votesDancer1: newVotesDancer1,
        votesDancer2: votedDancer === "dancer2" ? 0 : pair.votesDancer2,
      });
      setVotedDancer(votedDancer === "dancer1" ? null : "dancer1");
    } else if (
      dancer === "dancer2" &&
      pair.dancer2 !== route.params.competitor
    ) {
      const pairRef = db
        .collection("battles")
        .doc(route.params.battleId)
        .collection("pairs")
        .doc(route.params.pairId);

      const newVotesDancer2 = votedDancer === "dancer2" ? 0 : 1;
      pairRef.update({
        votesDancer2: newVotesDancer2,
        votesDancer1: votedDancer === "dancer1" ? 0 : pair.votesDancer1,
      });
      setVotedDancer(votedDancer === "dancer2" ? null : "dancer2");
    }
  };

  const getVoteButtonStyle = (dancer) => {
    if (votedDancer === dancer) {
      return styles.votedButton;
    } else {
      return styles.unvotedButton;
    }
  };

  return (
    <View style={styles.container}>
      {pair && (
        <View style={styles.pairContainer}>
          <View style={styles.pairHeader}>
            <View style={styles.pairHeaderTextContainer}>
              <Text style={styles.pairHeaderText}>{pair.dancer1}</Text>
            </View>
            <View style={styles.pairHeaderTextContainer}>
              <Text style={styles.pairHeaderText}>{pair.dancer2}</Text>
            </View>
          </View>
          <View style={styles.pairBody}>
            <TouchableOpacity
              onPress={() => handleVote("dancer1")}
              style={[
                styles.voteButton,
                votedDancer === "dancer1" && styles.votedButton,
              ]}
            >
              <Text style={styles.voteButtonText}>Round 1</Text>
              <Text style={styles.voteButtonText}>
                {pair.votesDancer1 || 0}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleVote("dancer2")}
              style={[
                styles.voteButton,
                votedDancer === "dancer2" && styles.votedButton,
              ]}
            >
              <Text style={styles.voteButtonText}>Round 1</Text>
              <Text style={styles.voteButtonText}>
                {pair.votesDancer2 || 0}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pairContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    width: "90%",
    maxWidth: 500,
  },
  pairHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  pairHeaderTextContainer: {
    flex: 1,
  },
  pairHeaderText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  pairBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  voteButton: {
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  voteButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  votedButton: {
    backgroundColor: "#1f78b4",
  },
});

export default VotingPage;
