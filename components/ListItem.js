import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Switch } from 'react-native';

class ListItem extends Component {
    constructor(props) {
        super(props);
    }

    // Funkcja wywołująca funkcję w rodzicu zsmieniającą stan switcha 
    zmiana() {
        console.log(">> Kliknięto pojedyńczy switch")
        this.props.off(this.props.item, this.props.id)
    }

    render() {
        return (
            <View style={styles.main} >
                <View style={styles.obrazek}>

                    {/* OBRAZEK */}
                    <Image style={{ width: 80, height: 80 }}
                        source={require('./ikona.png')}
                    />

                </View>
                <View style={styles.opis}>

                    {/* OPIS */}
                    <Text style={styles.hed}>Timestamp: {this.props.item.item.timestamp}</Text>
                    <Text>Latitude: {this.props.item.item.coords.latitude}</Text>
                    <Text>Longitude: {this.props.item.item.coords.longitude}</Text>

                </View>
                <View style={styles.switch}>

                    {/* SWITCH */}
                    <Switch
                        trackColor={{ false: "#767577", true: "#4164cc" }}
                        thumbColor={this.props.stat ? "#ff99a7" : "#f4f3f4"}
                        value={this.props.stat}
                        onValueChange={this.zmiana.bind(this)}
                    />

                </View>
            </View>
        );
    }
}

export default ListItem;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexDirection: 'row',
        // alignItems: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#2f468a',
    },
    obrazek: {
        flex: 1,
        paddingRight: 20
    },
    opis: {
        flex: 3,

    },
    hed: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    switch: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 5
    },
});
