import React, { Component } from 'react';
import { View, FlatList, StyleSheet, Alert, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";

import MyButton from "./MyButton"
import ListItem from './ListItem';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            savedMarkers: [],
            selectedMarkers: [],
            mainSwitchState: false,
            switchesStates: [],
        }
        this.setSwitchesState = this.setSwitchesState.bind(this)
        this.changeSwitchState = this.changeSwitchState.bind(this);
        this.mainSwitchState = this.mainSwitchState.bind(this);
        this.autochangeMainSwitchState = this.autochangeMainSwitchState.bind(this);
        this.loadLocationData(true);
    }

    // Get location
    async getPosition() {
        let { status } = await Permissions.askAsync(Permissions.LOCATION_FOREGROUND);
        if (status !== 'granted') {
            alert('Odmowa dostępu do lokalizacji urządzenia')
        }
        let currentPosition = await Location.getCurrentPositionAsync()
        if (currentPosition != undefined) {
            this.confirmAlert(currentPosition)
        }
        else {
            alert("Nie udało się pobrać pozycji !!!")
        }
    }

    // Save confirmation
    confirmAlert(currentPosition) {
        var that = this;
        Alert.alert(
            "POZYCJA ZOSTAŁA POBRANA",
            "Czy zapisać?",
            [
                {
                    text: "NIE",
                    onPress: () => { return 0 },
                },
                {
                    text: "TAK",
                    onPress: () => { that.savePosition(currentPosition) },
                }
            ],
            { cancelable: false }
        );
    }

    // Location save
    async savePosition(currentPosition) {
        let savedMarkersCopy = this.state.savedMarkers;
        if (savedMarkersCopy.length > 0) {
            savedMarkersCopy.push({ id: savedMarkersCopy.length, item: currentPosition })
        }
        else {
            savedMarkersCopy = [{ id: savedMarkersCopy.length, item: currentPosition }];
        }

        try {
            await AsyncStorage.setItem('@save_position', JSON.stringify(savedMarkersCopy))
        } catch (e) {
            alert("Error")
        }

        let switchesStatesUpdated = this.state.switchesStates;
        switchesStatesUpdated.push(this.state.mainSwitchState)
        this.setState({
            switchesStates: switchesStatesUpdated
        })
        this.loadLocationData()
    }

    // Read locations stored in memory
    async loadLocationData(first=false) {
        let loadedData = []
        try {
            const jsonValue = await AsyncStorage.getItem('@save_position')
            if (jsonValue != null ? JSON.parse(jsonValue) : null) {
                loadedData.push(JSON.parse(jsonValue));
            }
        } catch (e) {
            alert("Error")
        }

        if (loadedData[0] != undefined) {
            var savedMarkersUpdated = [];
            for (let item of loadedData[0]) {
                savedMarkersUpdated.push(item)
            }
            this.setState({
                savedMarkers: savedMarkersUpdated
            });
        }
        if(first){
            this.setSwitchesState(savedMarkersUpdated.length)
        }
    }

    setSwitchesState(length){
        let initialSwitchesStates = [];
        for (let i = 0; i < length; i++) {
            initialSwitchesStates.push(this.state.mainSwitchState);
        }
        this.setState({
            switchesStates: initialSwitchesStates
        })
    }

    // Delete all saved locations
    async clearLocationData() {
        try {
            await AsyncStorage.clear()
            alert("Pamięć została wyczyszczona!")
        } catch (e) {
            alert("Niepowodzenie!")
        }

        this.setState({
            savedMarkers: [],
            mainSwitchState: false,
            selectedMarkers: [],
            switchesStates: []
        });
    }

    // >> Go to MAP
    showMap() {
        if (this.state.selectedMarkers.length == 0) {
            alert("Zaznacz przynajmniej jedną pozycję!")
        }
        else {
            this.props.navigation.navigate("MAP", { selectedMarkers: this.state.selectedMarkers })
        }
    }

    // Function changing the state of a single switch
    changeSwitchState(item, id) {
        if (this.state.switchesStates[id] == false) {
            let selectedMarkersCopy = this.state.selectedMarkers;
            selectedMarkersCopy.push(item)
            let switchesStatesCopy = this.state.switchesStates;
            switchesStatesCopy[id] = !switchesStatesCopy[id];

            this.setState({
                selectedMarkers: selectedMarkersCopy,
                switchesStates: switchesStatesCopy
            });
        }
        else if (this.state.switchesStates[id] == true) {
            let selectedMarkersCopy = this.state.selectedMarkers;
            for (let i in selectedMarkersCopy) {
                if (selectedMarkersCopy[i].id == id) {
                    selectedMarkersCopy.splice(i, 1);
                }
            }
            let switchesStatesCopy = this.state.switchesStates;
            switchesStatesCopy[id] = !switchesStatesCopy[id];

            this.setState({
                selectedMarkers: selectedMarkersCopy,
                switchesStates: switchesStatesCopy,
            });
        }
        this.autochangeMainSwitchState()
    }
    // A function that adapts the master switch to individual ones
    autochangeMainSwitchState() {
        let checkerTrue = arr => arr.every(v => v === true);
        if (checkerTrue(this.state.switchesStates)) {
            this.setState({
                mainSwitchState: true
            })
        }
        else {
            this.setState({
                mainSwitchState: false
            })
        }
    }

    // Function responsible for changing the state of the master switch
    mainSwitchState() {
        let switchesStatesCopy = this.state.switchesStates;
        if (this.state.mainSwitchState == false) {
            for (let i in switchesStatesCopy) {
                switchesStatesCopy[i] = true;
            }
            let selectedMarkersUpdated = [];
            let savedMarkersCopy = this.state.savedMarkers;
            for (let item of savedMarkersCopy) {
                selectedMarkersUpdated.push(item)
            }

            this.setState({
                selectedMarkers: selectedMarkersUpdated,
                mainSwitchState: true,
                switchesStates: switchesStatesCopy
            });

        }
        else {
            for (let i in switchesStatesCopy) {
                switchesStatesCopy[i] = false;
            }

            this.setState({
                selectedMarkers: [],
                mainSwitchState: false,
                switchesStates: switchesStatesCopy
            })

        }
    }

    render() {
        return (
            <View style={styles.options}>
                <View style={styles.options}>
                    <View style={styles.upper}>

                        <MyButton style={[styles.buttons, styles.upperbuttons]}
                            title='POBIERZ I ZAPISZ POZYCJĘ'
                            onPress={this.getPosition.bind(this)}>
                        </MyButton>

                        <MyButton style={[styles.buttons, styles.upperbuttons]}
                            title='USUŃ WSZYSTKIE DANE'
                            onPress={this.clearLocationData.bind(this)}>
                        </MyButton>

                    </View>
                    <View style={styles.lower}>

                        <MyButton style={[styles.buttons, styles.lowerbuttons]}
                            title='PRZEJDŹ DO MAPY'
                            onPress={this.showMap.bind(this)}>
                        </MyButton>

                        {/* Main Switch*/}
                        <Switch
                            trackColor={{ false: "#767577", true: "#4164cc" }}
                            thumbColor={this.state.mainSwitchState ? "#ff99a7" : "#f4f3f4"}
                            value={this.state.mainSwitchState}
                            onValueChange={this.mainSwitchState}
                            style={[styles.buttons, styles.lowerbuttons]} />

                    </View>
                </View>
                <View style={styles.list}>

                    {/* List of Markers */}
                    <FlatList
                        data={this.state.savedMarkers}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item, index }) => <ListItem key={index} pleaserefresh={Math.random()} stat={this.state.switchesStates[item.id]} id={item.id} item={item} navigation={this.props.navigation} changeSwitchState={this.changeSwitchState}></ListItem>}
                    />

                </View>
            </View>
        );
    }
}

export default List;

const styles = StyleSheet.create({
    options: {
        flex: 1,
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderBottomColor: '#2f468a',
    },
    buttons: {
        color: "#000",
        padding: 15,
    },
    upper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    upperbuttons: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lower: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    lowerbuttons: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        flex: 5
    }
});
