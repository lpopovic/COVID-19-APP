
import React, { Component } from 'react';

import MapScreen from './src/screen/MapScreen'
import Geolocation from '@react-native-community/geolocation';
import CustomActivityIndicator from './src/components/common/CustomActivityIndicator'
import { BASE_COLOR, strings } from './src/helper';
import CustomAlert from './src/components/common/CustomAlert';
class App extends Component {
  state = {
    initialPosition: null,
    loading: true
  };
  watchID = null;

  componentDidMount() {

    this.getCurrentLocation()
    this.watchID = Geolocation.watchPosition(position => {
      const initialPosition = {
        latitude: Number(position.coords.latitude),
        longitude: Number(position.coords.longitude),
      };
      this.setState({ initialPosition });
    });
  }
  componentWillUnmount() {
    this.watchID != null && Geolocation.clearWatch(this.watchID);

  }

  getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const initialPosition = {
          latitude: Number(position.coords.latitude),
          longitude: Number(position.coords.longitude),
        };
        this.setState({ initialPosition, loading: false });
      },
      error => { CustomAlert.showAlert(strings.acsessLocation), this.setState({ loading: false }) },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  render() {
    const { loading } = this.state
    if (loading == true) {
      return (
        <CustomActivityIndicator size="large" color={BASE_COLOR.black} />
      );
    } else {
      return (
        <MapScreen
          userLocation={this.state.initialPosition}
          requestUserLocation={() => this.getCurrentLocation()} />
      );
    }
  };
}


export default App;
