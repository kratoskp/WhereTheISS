import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { NativeBaseProvider, Button  } from 'native-base';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import Moment from 'moment';
import * as Location from 'expo-location';

let url = 'https://api.wheretheiss.at/v1/satellites/25544/positions'
class ISS extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pickerOpened: false,
      date: new Date(),
      currentLocation: ''
		};
	}
	closePicker = () => this.setState({ pickerOpened: false })

  componentDidMount = async () => {
    Location.requestForegroundPermissionsAsync();
    let response = await this.getData(this.state.date)
    let location = await this.getCity(response[0])
    this.setState({ currentLocation: location[0] })
  }

  getCity = async (coordinate) => {
    let response = await Location.reverseGeocodeAsync({ latitude: coordinate.latitude, longitude: coordinate.longitude })
    return response;
  }

  getData = async (dateTime) => {
    let response = await axios.get(url, {
      params: {
        timestamps : Moment(dateTime).unix()
      },
    }) 
    return response.data;
  }

	handleDatePicked = async (value) => {
		this.setState({ pickerOpened: false, date: value });
	};

	render() {
		return (
      <NativeBaseProvider>
        <View style={{ flex: 1, paddingVertical: 100, alignItems: 'center' }}>
          {this.state.currentLocation !== '' &&
            <Text>Current Location: {this.state.currentLocation.name} {this.state.currentLocation.city} {this.state.currentLocation.country}</Text>
          }
          <View 
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button onPress={() => this.setState({ pickerOpened: true })}>Choose date and time</Button>
          </View>
          <DateTimePickerModal
            isVisible={this.state.pickerOpened}
            mode="datetime"
            onConfirm={this.handleDatePicked}
            onCancel={() => this.setState({ pickerOpened: false })}
            maximumDate={new Date()}
          />
        </View>
      </NativeBaseProvider>
		);
	}
}

export default ISS;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
