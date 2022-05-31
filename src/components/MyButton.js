import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

class MyButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={this.props.style}>
        <TouchableOpacity onPress={this.props.onPress}>
          <Text style={styles.tekst}> {this.props.title} </Text>
        </TouchableOpacity>
      </View >
    );
  }
}

export default MyButton;

const styles = StyleSheet.create({
  tekst: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center'
  }
});

