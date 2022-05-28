import React, { Component } from 'react';
import { View, FlatList, StyleSheet, Alert, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";

import MyButton from "./MyButton"
import ListItem from './ListItem';

class List extends Component {
    constructor(props) {
        console.log(">>> LIST <<<")
        super(props);
        this.state = {
            records: this.props.route.params.records,
            markery: [],
            isAll: false,
            wszystkie: this.props.route.params.wszystko,
        }
        this.off = this.off.bind(this);
        this.all = this.all.bind(this);
        this.przestaw = this.przestaw.bind(this);
    }

    // Pobranie loalizacji
    async lokalizacja() {
        console.log(">> KLiknięto POBIERZ I ZAPISZ POZYCJĘ")
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            alert('Odmowa dostępu do lokalizacji urządzenia')
        }
        var pos = await Location.getCurrentPositionAsync()
        if (pos != undefined) {
            console.log("\tPobrano lokalizację")
            this.confirmAlert(pos)
        }
        else {
            alert("Nie udało się pobrać pozycji !!!")
        }
    }

    // Confirm z pytaniem czy zapisać ?
    confirmAlert(pos) {
        var that = this;
        Alert.alert(
            "POZYCJA ZOSTAŁA POBRANA",
            "Czy zapisać?",
            [
                {
                    text: "NIE",
                    onPress: () => { return 0 },
                    style: "NIE"
                },
                {
                    text: "TAK",
                    onPress: () => { that.zapisz(pos) },
                }
            ],
            { cancelable: false }
        );
    }

    // Zapis lokalizacji
    async zapisz(dane) {
        if (this.state.records.length > 0) {
            var records = this.state.records;
            var nr = this.state.records.length;
            records.push({ id: nr, item: dane })
        }
        else {
            var nr = this.state.records.length;
            var records = [{ id: nr, item: dane }];
        }

        try {
            await AsyncStorage.setItem('@save_position', JSON.stringify(records))
        } catch (e) {
            // **errors    
        }

        // Dodanie do tablicy "wszystkie"
        let wszystkie = this.state.wszystkie;
        wszystkie.push(this.state.isAll)
        this.setState({
            wszystkie: wszystkie
        })

        console.log("\tZapisano lokalizację")
        this.czytaj()
    }

    // Odczyt lokalizacji zapisanych w pamięci
    async czytaj() {
        console.log("\tCzytaj...")
        var rekordy = [];
        try {
            const jsonValue = await AsyncStorage.getItem('@save_position')
            if (jsonValue != null ? JSON.parse(jsonValue) : null) {
                rekordy.push(JSON.parse(jsonValue));
            }
        } catch (e) {
            // error reading value
        }

        if (rekordy[0] != undefined) {
            var len = rekordy[0].length;
            var tablica = [];
            for (let i = 0; i < len; i++) {
                tablica.push(rekordy[0][i])
            }
            this.setState({
                records: tablica
            });
        }
    }

    // Usunięcie wszystkich zapisanych lokalizacji
    async czysc() {
        console.log(">> KLiknięto USUŃ WSZYSTKIE DANE")
        try {
            await AsyncStorage.clear()
            alert("Pamięć została wyczyszczona!")
            console.log("\tPamięć została wyczyszczona!")
        } catch (e) {
            alert("Niepowodzenie!")
            console.log("\tNiepowodzenie!")
        }

        this.setState({
            records: [],
            isAll: false,
            markery: [],
            wszystkie: []
        });
    }

    // >> Przejście do MAPY
    mapa() {
        console.log(">> Kliknięto PRZEJDŹ DO MAPY")
        if(this.state.markery.length == 0){
            alert("Zaznacz przynajmniej jedną pozycję!")
            console.log("\tAlert")
        }
        else{
            this.props.navigation.navigate("MAP", { markery: this.state.markery })
        }
    }

    // Funkcja zmieniajaca stan pojedyńczego switcha
    off(it, id) {
        if (this.state.wszystkie[id] == false) {
            let tym = this.state.markery;
            tym.push(it)
            let wszystkie = this.state.wszystkie;
            wszystkie[id] = !wszystkie[id];

            this.setState({
                markery: tym,
                wszystkie: wszystkie
            });

            console.log("\tZmieniono stan: " + id + " na TRUE")
            this.przestaw("+")
        }
        else if (this.state.wszystkie[id] == true) {
            var tym = this.state.markery;
            for (var i = 0; i < this.state.markery.length; i++) {
                if (tym[i].id == id) {
                    tym.splice(i, 1);
                    // -- console.log("WYCIĘTO", tym)
                }
            }
            let wszystkie = this.state.wszystkie;
            wszystkie[id] = !wszystkie[id];

            this.setState({
                markery: tym,
                wszystkie: wszystkie,
            });

            console.log("\tZmieniono stan: " + id + " na FALSE")
            this.przestaw("-")
        }
    }

    // Funkcja dostosuwująca nadrzędny switch do pojedyńczych
    przestaw(ss) {
        console.log("\tSpradzam...")
        if (ss == "-") {
            let czy = this.state.wszystkie.includes(true)
            if (czy == false) {
                this.setState({
                    isAll: false
                })
                console.log("\tisAll = FALSE")
            }
        }
        else if (ss == "+") {
            let czy = this.state.wszystkie.includes(false)
            if (czy == false) {
                this.setState({
                    isAll: true
                })
                console.log("\tisAll = TRUE")
            }
        }
    }

    // Funkcja odpowiedzialna za zmianę nadrzędnego switcha
    all() {
        console.log(">> Kliknięto główny switch")
        if (this.state.isAll == false) {
            var wszystkie = this.state.wszystkie;
            for (let i = 0; i < wszystkie.length; i++) {
                wszystkie[i] = true;
            }
            var rek = [];
            for (let j = 0; j < this.state.records.length; j++) {
                rek.push(this.state.records[j])
            }

            this.setState({
                markery: rek,
                isAll: true,
                wszystkie: wszystkie
            });

            console.log("\tisAll = TRUE")
        }
        else {
            let wszystkie = this.state.wszystkie;
            for (let i = 0; i < wszystkie.length; i++) {
                wszystkie[i] = false;
            }

            this.setState({
                markery: [],
                isAll: false,
                wszystkie: wszystkie
            })

            console.log("\tisAll = FALSE")
        }
    }

    render() {
        return (
            <View style={styles.opcje}>
                <View style={styles.opcje}>
                    <View style={styles.gora}>

                        <MyButton style={[styles.buttony, styles.gorne]}
                            title='POBIERZ I ZAPISZ POZYCJĘ'
                            onPress={this.lokalizacja.bind(this)}>
                        </MyButton>

                        <MyButton style={[styles.buttony, styles.gorne]}
                            title='USUŃ WSZYSTKIE DANE'
                            onPress={this.czysc.bind(this)}>
                        </MyButton>

                    </View>
                    <View style={styles.dol}>

                        <MyButton style={[styles.buttony, styles.dolne]}
                            title='PRZEJDŹ DO MAPY'
                            onPress={this.mapa.bind(this)}>
                        </MyButton>

                        {/* GŁÓWNY SWITCH */}
                        <Switch
                            trackColor={{ false: "#767577", true: "#4164cc" }}
                            thumbColor={this.state.isAll ? "#ff99a7" : "#f4f3f4"}
                            value={this.state.isAll}
                            onValueChange={this.all}
                            style={[styles.buttony, styles.dolne]} />

                    </View>
                </View>
                <View style={styles.lista}>

                    {/* LISTA ZAPISANYCH LOKALIZACJI */}
                    <FlatList
                        data={this.state.records}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item, index }) => <ListItem key={index} pleaserefresh={Math.random()} stat={this.state.wszystkie[item.id]} id={item.id} item={item} navigation={this.props.navigation} off={this.off}></ListItem>}
                    />

                </View>
            </View>
        );
    }
}

export default List;

const styles = StyleSheet.create({
    opcje: {
        flex: 1,
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderBottomColor: '#2f468a',
    },
    buttony: {
        color: "#000",
        padding: 15,
    },
    gora: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    gorne: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dol: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    dolne: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lista: {
        flex: 5
    }
});
