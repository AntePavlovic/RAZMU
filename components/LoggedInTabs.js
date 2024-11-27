import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from 'react-native-vector-icons'; // Adjust icon library as needed
import LoggedInView from './LoggedInView';
import GamesScreen from './GamesScreen';
import MathGame from './MathGame'; // Import MathGame komponenta
import Leaderboard from './Leaderboard'; // Import Leaderboard komponenta

const Tab = createBottomTabNavigator();

export default function LoggedInTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          // Define icons based on the route name
          if (route.name === 'Profil') {
            iconName = 'person'; // Icon name for the Profile tab
          } else if (route.name === 'Igrice') {
            iconName = 'sports-esports'; // Icon name for the Games tab
          } else if (route.name === 'Matematika') {
            iconName = 'calculate'; // Icon name for the MathGame tab
          } else if (route.name === 'Ljestvica') {
            iconName = 'leaderboard'; // Icon name for the Leaderboard tab
          }

          // Return the icon component
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'navy',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Profil" 
        component={LoggedInView} 
        options={{ tabBarLabel: 'Profil' }} 
      />
      <Tab.Screen 
        name="Igrice" 
        component={GamesScreen} 
        options={{ tabBarLabel: 'Igrice' }} 
      />
      <Tab.Screen 
        name="Matematika" 
        component={MathGame} 
        options={{ tabBarLabel: 'Matematika' }} 
      />
      {/* Adding the Leaderboard Tab */}
      <Tab.Screen 
        name="Ljestvica" 
        component={Leaderboard} 
        options={{ tabBarLabel: 'Ljestvica' }} 
      />
    </Tab.Navigator>
  );
}
