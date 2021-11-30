import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
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
      currentLocation: '',
      data: []
		};
	}
	closePicker = () => this.setState({ pickerOpened: false })

  componentDidMount = async () => {
    Location.requestForegroundPermissionsAsync();
    let response = await this.getData(new Date())
    let location = await this.getCity(response[0])
    // console.log(response, location)
    this.setState({ currentLocation: location[0] })
  }

  getCity = async (coordinate) => {
    // console.log(coordinate)
    let response = await Location.reverseGeocodeAsync({ latitude: coordinate.latitude, longitude: coordinate.longitude })
    // console.log(response)
    return response;
  }

  getData = async (dateTime, multi) => {
    let response = await axios.get(url, {
      params: {
        timestamps : multi !== undefined ? multi : Moment(dateTime).unix()
      },
    })
    return response.data;
  }

	handleDatePicked = async (value) => {
		this.setState({ pickerOpened: false, date: value });
    let timeString = ''

    // add time before selected to string
    for (let i = 3600; i > 0; i = i - 600) {
      if (timeString === '') {
        timeString = Moment(value).unix() - i
      } else {
        timeString = timeString + ',' + (Moment(value).unix() - i)
      }
    }

    // add time selected into string
    timeString = timeString + ',' + Moment(value).unix()

    // add time after selected to string 
    for (let i = 600; i <= 3600; i = i + 600) {
        timeString = timeString + ',' + (Moment(value).unix() + i)
    }

    let response = await this.getData(true, timeString)
    this.setState({ data: response })
    
	};

	render() {
		return (
      <NativeBaseProvider>
        <View style={{ flex: 1, paddingVertical: 100, alignItems: 'center' }}>
          {(this.state.currentLocation !== '' && this.state.currentLocation !== undefined) ?
            <View>
            <Text>Current Location: {this.state.currentLocation.name} {this.state.currentLocation.city} {this.state.currentLocation.country}</Text>
            </View>
            :
            <Text>Current Location: Somewhere over the sea</Text>
          }
          <View 
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button onPress={() => this.setState({ pickerOpened: true })}>Choose date and time</Button>
            <FlatList
              data={this.state.data}
              renderItem={({ item, index }) => (
                <Text style={{ fontWeight: index === 6 ? 'bold' : '100' }}>Time: {Moment.unix(item.timestamp).format('DD/MM/YYYY hh:mm:ss')}</Text>
              )}
              keyExtractor={(item) => item.latitude}
            />
          </View>
          <DateTimePickerModal
            isVisible={this.state.pickerOpened}
            mode="datetime"
            onConfirm={(e) => this.handleDatePicked(e)}
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
