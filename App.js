import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Main from "./pages/Main";
import Map from "./pages/Map"
import List from "./pages/List";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer >
      <Stack.Navigator >

        {/* MAIN SCREEN */}
        <Stack.Screen name="MAIN" component={Main}
          options={{
            headerShown: false
          }}
        />

        {/* LIST ITEM */}
        <Stack.Screen name="LIST" component={List} options={{
          title: "ZAPIS POZYCJI",
          headerStyle: {
            backgroundColor: '#2f468a',
          },
          headerTintColor: '#fff',
        }} />

        {/* MAP */}
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




