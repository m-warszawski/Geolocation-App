import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyButton from "./MyButton"
import * as Font from "expo-font";

class Main extends Component {  
    constructor(props) {
        super(props);
        this.state = {
            fontloaded: false
        }
        this.customFont();
    }

    // Custom font setting
    async customFont() {
        await Font.loadAsync({
            'myfont': require('./fonts/vuldo.ttf'), 
        });
        this.setState({ fontloaded: true })
    }

    start() {
        // >>  Go to ListItem
        this.props.navigation.navigate("LIST", { navigation: this.props.navigation})
    }
    render() {
        return (
            <View style={styles.container}>
                {/* Upper part */}
                {this.state.fontloaded
                    ?
                    < View style={styles.up}>
                        <Text style={styles.header}>GeoMap App</Text>
                        <Text style={styles.smallheader}> find and save yor position</Text>
                    </View>
                    :
                    null
                }

                {/* Lower part*/}
                <View style={styles.down}>

                    {/* Button */}
                    <MyButton
                        title='START'
                        style={styles.mybutton}
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
    mybutton: {
        padding: 10,
        backgroundColor: "#ff99a7",
    }
});


