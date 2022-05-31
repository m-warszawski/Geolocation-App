import React, { Component } from 'react';
import MapView from 'react-native-maps';
import { View, StyleSheet, Dimensions } from 'react-native';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMarkers: this.props.route.params.selectedMarkers
    };
  }

  render() {
    // Creating markers based on the obtained data
    let mapMarkersArray = [];
    let key = 0;
    for (let singleMarker of this.state.selectedMarkers) {
      mapMarkersArray.push(< MapView.Marker coordinate={
        {
          latitude: singleMarker.item.coords.latitude,
          longitude: singleMarker.item.coords.longitude,
        }
      }
        title={"Single marker"}
        description={"Place for descripiton"}
        key={key}
      />)
      key++;
    }
    return (
      <View style={styles.container} >
        <MapView style={styles.mapstyle} >
          {mapMarkersArray}
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
  mapstyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});