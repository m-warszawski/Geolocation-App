import React, { Component } from 'react';
import MapView from 'react-native-maps';
import { View, StyleSheet, Dimensions } from 'react-native';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markery: this.props.route.params.markery
    };
  }

  render() {
    console.log(this.state.markery)
    // Utworzenie markerów na podstawie otrzymanych danych
    var elementy = [];
    for (let i = 0; i < this.state.markery.length; i++) {
      var lati = this.state.markery[i].item.coords.latitude;
      var long = this.state.markery[i].item.coords.longitude;
      elementy.push(<MapView.Marker
        coordinate={{
          latitude: lati,
          longitude: long,
        }}
        title={"pos"}
        description={"opis"}
        key={i}
      />)
    }

    return (
      <View style={styles.container}>
        <MapView style={styles.mapStyle}>
          {elementy}
        </MapView>
      </View>
    );
  }
}

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});