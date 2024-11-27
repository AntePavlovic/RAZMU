import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, TextInput, Button, Image, TouchableOpacity, Alert } from 'react-native';
import { addDoc, getDocs, collection } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

export default function GamesScreen() {
  const [gameTitle, setGameTitle] = useState("");
  const [gameDescription, setGameDescription] = useState("");
  const [gameImageUrl, setGameImageUrl] = useState("");
  const [games, setGames] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesCollection = collection(firestore, "games");
        const gamesSnapshot = await getDocs(gamesCollection);
        const gamesList = gamesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGames(gamesList);
      } catch (error) {
        console.error("Error loading games: ", error);
      }
    };
    fetchGames();
  }, []);

  const handleAddGame = async () => {
    if (gameTitle !== "" && gameDescription !== "" && gameImageUrl !== "") {
      try {
        const newGame = {
          title: gameTitle,
          description: gameDescription,
          imageUrl: gameImageUrl,
        };
        const docRef = await addDoc(collection(firestore, "games"), newGame);
        setGames([...games, { id: docRef.id, ...newGame }]);
        setGameTitle("");
        setGameDescription("");
        setGameImageUrl("");
        Alert.alert("Igrica dodana u bazu podataka.");
        setModalVisible(false);
      } catch (error) {
        console.error("Error adding game: ", error);
        Alert.alert("Greška pri dodavanju igrice.");
      }
    } else {
      Alert.alert("Morate unijeti sva polja!");
    }
  };

  const renderGameItem = ({ item }) => (
    <View style={styles.gameItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.gameImage} />
      <Text style={styles.gameTitle}>{item.title}</Text>
      <Text style={styles.gameDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dobrodošli u sekciju Igrice!</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Dodaj novu igru</Text>
      </TouchableOpacity>
      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={renderGameItem}
      />
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContent}>
          <TextInput
            value={gameTitle}
            onChangeText={setGameTitle}
            placeholder="Naslov igrice"
            style={styles.input}
          />
          <TextInput
            value={gameDescription}
            onChangeText={setGameDescription}
            placeholder="Opis igrice"
            style={styles.input}
          />
          <TextInput
            value={gameImageUrl}
            onChangeText={setGameImageUrl}
            placeholder="Slika igrice"
            style={styles.input}
          />
          <Button title="Dodaj" onPress={handleAddGame} />
          <Button title="Zatvori" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
  },
  gameItem: {
    marginBottom: 20,
    alignItems: "center",
  },
  gameImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  gameDescription: {
    fontSize: 14,
    textAlign: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});
