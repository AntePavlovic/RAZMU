import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Dimensions, TextInput } from "react-native";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from '../firebaseConfig'; // Make sure the path is correct

export default function MathGame() {
  const [currentNumber, setCurrentNumber] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [resultInput, setResultInput] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const [showStartButton, setShowStartButton] = useState(true);
  const [showNumberContainer, setShowNumberContainer] = useState(true);
  const [userScore, setUserScore] = useState(0); // Track the score in the game

  const user = getAuth().currentUser;

  useEffect(() => {
    if (user) {
      const getUserScore = async () => {
        try {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (userDoc.exists()) {
            setUserScore(userDoc.data().score || 0);
          }
        } catch (error) {
          console.error("Error fetching user score: ", error);
        }
      };

      getUserScore();
    }
  }, [user]);

  const generateNumbers = async () => {
    setNumbers([]);
    setCurrentNumber(null);
    setShowInput(false);
    setShowPlayAgain(false);
    setResultInput("");
    setFeedbackMessage("");
    setShowStartButton(false);
    setShowNumberContainer(true);

    const randomNumbers = [];
    let previousNumber = null;

    for (let i = 0; i < 10; i++) {
      let randomNumber;
      do {
        randomNumber = Math.floor(Math.random() * 9) + 1;
      } while (randomNumber === previousNumber);

      randomNumbers.push(randomNumber);
      previousNumber = randomNumber;
    }

    for (let i = 0; i < randomNumbers.length; i++) {
      setCurrentNumber(randomNumbers[i]);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setNumbers(randomNumbers);
    setCurrentNumber(null);
    setShowNumberContainer(false);
    setShowInput(true);
  };

  const checkResult = async () => {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    let newScore = userScore;

    if (parseInt(resultInput) === sum) {
      setFeedbackMessage("Čestitamo! Točan rezultat!");
      newScore += 5; // Correct answer, +5 points
    } else {
      setFeedbackMessage(`Pogrešan rezultat! Točan zbroj je ${sum}.`);
      newScore -= 7; // Incorrect answer, -7 points
    }

    setUserScore(newScore);
    await updateDoc(doc(firestore, "users", user.uid), { score: newScore });

    setShowPlayAgain(true);
  };

  const resetGame = () => {
    setNumbers([]);
    setCurrentNumber(null);
    setShowInput(false);
    setResultInput("");
    setFeedbackMessage("");
    setShowPlayAgain(false);
    setShowStartButton(true);
    setShowNumberContainer(true);
  };

  return (
    <View style={styles.container}>
      {showNumberContainer && (
        <View style={styles.numberContainer}>
          {currentNumber !== null ? (
            <Text style={styles.numberText}>{currentNumber}</Text>
          ) : (
            <Text style={styles.placeholderText}>Čekanje...</Text>
          )}
        </View>
      )}

      {showStartButton && <Button title="Pokreni" onPress={generateNumbers} />}

      {showInput && !showPlayAgain && (
        <View style={styles.resultContainer}>
          <Text style={styles.scoreText}>Trenutni score: {userScore}</Text>
          <TextInput
            style={styles.input}
            placeholder="Unesite rezultat"
            keyboardType="numeric"
            value={resultInput}
            onChangeText={setResultInput}
          />
          <Button title="Unesi" onPress={checkResult} />
        </View>
      )}

      {feedbackMessage !== "" && <Text style={styles.feedbackText}>{feedbackMessage}</Text>}

      {showPlayAgain && <Button title="Igraj ispočetka" onPress={resetGame} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  numberContainer: {
    height: Dimensions.get("window").height * 0.3,
    width: Dimensions.get("window").width * 0.2,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
  },
  numberText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
  },
  placeholderText: {
    fontSize: 24,
    color: "gray",
  },
  resultContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  input: {
    height: 40,
    width: Dimensions.get("window").width * 0.3,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  feedbackText: {
    fontSize: 18,
    color: "blue",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 18,
    color: "#000",
    marginBottom: 10,
  },
});
