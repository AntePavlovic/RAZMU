import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { firestore } from '../firebaseConfig'; 
import { collection, onSnapshot } from 'firebase/firestore';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "users"),
      (querySnapshot) => {
        const usersData = querySnapshot.docs.map((doc) => doc.data());

        const validUsers = usersData.filter((user) => !isNaN(user.score));

        const sortedUsers = validUsers.sort((a, b) => b.score - a.score);

        setLeaderboard(sortedUsers);
      },
      (error) => {
        console.error("Error fetching leaderboard: ", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item, index }) => {
    let backgroundColor = 'white';

    if (index === 0) {
      backgroundColor = 'gold';
    } else if (index === 1) {
      backgroundColor = 'silver';
    } else if (index === 2) {
      backgroundColor = '#cd7f32';
    }

    return (
      <View style={[styles.item, { backgroundColor }]}>
        <Text style={styles.rank}>{index + 1}</Text>
        <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.score}>{item.score} bodova</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ljestvica</Text>
      <FlatList
        data={leaderboard}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id ? item.id : index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  listWrapper: {
    width: '80%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flexGrow: 1,
  },
  item: {
    marginVertical: 10,
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    width: '100%',
    marginHorizontal: 0,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 50,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  score: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    width: 100,
  },
});
