import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { NativeBaseProvider, Button  } from 'native-base';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import Moment from 'moment';
import * as Location from 'expo-location';
import MapView, { Polyline } from 'react-native-maps';

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

  getLocation = async (num) => {
    let data = this.state.data[num]
    let location = await this.getCity(data)
    let newData = this.state.data.map((item, index) => {
      if (num === index) {
        return {...item, location: location[0]}
      }
      return item
    })
    this.setState({ data: newData })
  }

	render() {
		return (
      <NativeBaseProvider>
        <View style={{ flex: 1, paddingVertical: 50, alignItems: 'center' }}>
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
                <TouchableOpacity onPress={() => this.getLocation(index)} style={{ flexDirection: 'row' }}>
                  <Text style={{ fontWeight: index === 6 ? 'bold' : '100' }}>Time: {Moment.unix(item.timestamp).format('DD/MM/YYYY hh:mm:ss')}</Text>
                  {item.location !== undefined &&
                  <Text>City: {item.location.name} {item.location.city} {item.location.country}</Text>
                  }
                  </TouchableOpacity>
              )}
              keyExtractor={(item) => item.latitude}
            />
            <MapView 
              style={{ height: 500, width: 500 }}
            >
              <Polyline 
                coordinates={[
                  { latitude: 37.8025259, longitude: -122.4351431 },
			{ latitude:  49.06787771343, longitude: -102.24701351878 },
			{ latitude: 37.7665248, longitude: -122.4161628 },
			{ latitude: 37.7734153, longitude: -122.4577787 },
			{ latitude: 37.7948605, longitude: -122.4596065 },
			{ latitude: 37.8025259, longitude: -122.4351431 }
                ]}
                strokeColor='#7F0000'
                strokeWidth={6}
                // lineCap="round"
                lineDashPattern={[1]}
              />
              </MapView>
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
