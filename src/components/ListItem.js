import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Switch } from 'react-native';

class ListItem extends Component {
    constructor(props) {
        super(props);
    }

    // A function that calls a function in the parent that changes the state of the switch 
    changeState() {
        this.props.changeSwitchState(this.props.item, this.props.id)
    }

    render() {
        return (
            <View style={styles.main} >
                <View style={styles.picture}>

                    {/* Picture */}
                    <Image style={{ width: 80, height: 80 }}
                        source={require('../assets/images/ikona.png')}
                    />

                </View>
                <View style={styles.description}>

                    {/* Description */}
                    <Text style={styles.head}>Timestamp: {this.props.item.item.timestamp}</Text>
                    <Text>Latitude: {this.props.item.item.coords.latitude}</Text>
                    <Text>Longitude: {this.props.item.item.coords.longitude}</Text>

                </View>
                <View style={styles.switch}>

                    {/* Switch */}
                    <Switch
                        trackColor={{ false: "#767577", true: "#4164cc" }}
                        thumbColor={this.props.stat ? "#ff99a7" : "#f4f3f4"}
                        value={this.props.stat}
                        onValueChange={this.changeState.bind(this)}
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
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#2f468a',
    },
    picture: {
        flex: 1,
        paddingRight: 20
    },
    description: {
        flex: 3,

    },
    head: {
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
