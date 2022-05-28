import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Main from "./components/Main";
import Map from "./components/Map"
import List from "./components/List";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer >
      <Stack.Navigator >

        {/* EKRAN GŁÓWNY */}
        <Stack.Screen name="MAIN" component={Main}
          options={{
            headerShown: false
          }}
        />

        {/* LISTA */}
        <Stack.Screen name="LIST" component={List} options={{
          title: "ZAPIS POZYCJI",
          headerStyle: {
            backgroundColor: '#2f468a',
          },
          headerTintColor: '#fff',
        }} />

        {/* MAPA */}
        <Stack.Screen name="MAP" component={Map} options={{
          title: "LOKALIZACJA NA MAPIE",
          headerStyle: {
            backgroundColor: '#2f468a',
          },
          headerTintColor: '#fff',
        }} />
      </Stack.Navigator>

    </NavigationContainer>
  );
}




