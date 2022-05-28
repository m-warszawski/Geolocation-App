import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyButton from "./MyButton"
import * as Font from "expo-font";

class Main extends Component {  
    constructor(props) {
        console.log(">>> MAIN <<<")
        super(props);
        this.state = {
            fontloaded: false
        }
        this.font();
    }

    // WŁASNY FONT
    async font() {
        await Font.loadAsync({
            'myfont': require('./fonts/vuldo.ttf'), 
        });
        this.setState({ fontloaded: true })
    }

    // Funkcja pobierająca zapisane wcześniej lokalizacje
    async start() {
        var rekordy = [];
        try {
            const jsonValue = await AsyncStorage.getItem('@save_position')
            if (jsonValue != null ? JSON.parse(jsonValue) : null) {
                rekordy.push(JSON.parse(jsonValue));
            }
        } catch (e) {
            // error reading value
        }

        var tablica = [];    
        if (rekordy[0] != undefined) {
            var len = rekordy[0].length;        
            for (let i = 0; i < len; i++) {      
                tablica.push(rekordy[0][i])
            }
        }
        var wszystko = [];
        for (let k = 0; k < tablica.length; k++) {
            wszystko.push(false);
        }
        // >>  Przejście do LISTY
        this.props.navigation.navigate("LIST", { records: tablica, navigation: this.props.navigation, wszystko: wszystko })
    }
    render() {
        return (
            <View style={styles.container}>
                {/* GÓRA */}
                {this.state.fontloaded
                    ?
                    < View style={styles.up}>
                        <Text style={styles.header}>GeoMap App</Text>
                        <Text style={styles.smallheader}> find and save yor position</Text>
                    </View>
                    :
                    null
                }

                {/* DÓŁ */}
                <View style={styles.down}>

                    {/* BUTTON */}
                    <MyButton
                        title='START'
                        style={styles.but}
                        onPress={this.start.bind(this)}>
                    </MyButton>
                    
                </View>
            </View >
        )
    };
}

export default Main

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    up: {
        flex: 2,
        alignItems: 'stretch',
        justifyContent: 'center',   
        backgroundColor: '#2f468a',
        alignItems: 'center',
        padding: 30,
    },
    header: {
        color: '#fff',
        fontSize: 48,
        textAlign: 'center',
        fontFamily: 'myfont'
    },
    smallheader: {
        color: '#fff',
        fontSize: 22,
        textAlign: 'center',
        fontFamily: 'myfont'
    },
    down: {
        flex: 3,
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    but: {
        padding: 10,
        backgroundColor: "#ff99a7",
    }
});


