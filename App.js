import React from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, Dimensions, Modal } from 'react-native';
import { NativeBaseProvider, Button  } from 'native-base';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import Moment from 'moment';
import MapView, { Polyline } from 'react-native-maps';

let url = 'https://wheretheiss.000webhostapp.com/api.php'
class ISS extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pickerOpened: false,
      date: new Date(),
      currentLocation: '',
      data: [],
      map: false,
      loading: false
		};
	}
	closePicker = () => this.setState({ pickerOpened: false })

  componentDidMount = async () => {
    let response = await this.getData(new Date())
    this.setState({ currentLocation: response[0] })
  }

  getData = async (dateTime, multi) => {
    let response = await axios.get(url, {
      params: {
        time : multi !== undefined ? multi : Moment(dateTime).unix()
      },
    })
    return response.data.responses;
    
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
    this.setState({ loading: true })
    let response = await this.getData(true, timeString)
    this.setState({ data: response, loading: false })

	};

	render() {
		return (
      <NativeBaseProvider>
        <View style={{ flex: 1, paddingVertical: 50, alignItems: 'center' }}>
          {(this.state.currentLocation !== '' && this.state.currentLocation !== undefined) ?
            <View>
            <Text>Current Location: {this.state.currentLocation.features[0].properties.name} {this.state.currentLocation.features[0].properties.state} {this.state.currentLocation.features[0].properties.country}</Text>
            </View>
            :
            <Text>Current Location: Somewhere over the sea</Text>
          }
          <View 
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 8 }}>
            <Button onPress={() => this.setState({ pickerOpened: true })}>Choose date and time</Button>
            {this.state.data.length !== 0 &&
              <Text>Tap time to reveal location</Text>
            }
            {this.state.loading === true &&
            <ActivityIndicator color="#FF0000"/>
            }
            <FlatList
              data={this.state.data}
              renderItem={({ item, index }) => (
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontWeight: index === 6 ? 'bold' : '100' }}>{Moment.unix(item.timestamp).format('DD/MM/YYYY hh:mm')}</Text>
                  <Text>{item.features[0].properties.name} {item.features[0].properties.city} {item.features[0].properties.country} / {item.current.weather[0].description}</Text>
                  </View>
              )}
              keyExtractor={(item) => item.latitude}
              ItemSeparatorComponent={() => <View style={{ padding: 4 }}/>}
              style={{ paddingTop: 8 }}
              showsVerticalScrollIndicator={false}
            />
            {this.state.data.length !== 0 &&
              <View style={{ marginTop: 30 }}>
              <Button onPress={() => this.setState({ map: true })}>Show ISS path Visualisation</Button>
              </View>
            }
            <Modal
              animationType="slide"
              visible={this.state.map}
              onRequestClose={() => {
                this.setState({ map: false })
              }}
              style={{ backgroundColor: 'white' }}
            >
                <MapView 
                  style={{ height: Dimensions.get('screen').height / 2, width: Dimensions.get('screen').width }}
                >
                  <Polyline 
                    coordinates={this.state.data}
                    strokeColor='#7F0000'
                    strokeWidth={6}
                    // lineCap="round"
                    lineDashPattern={[1]}
                  />
                </MapView>
                <Button onPress={() => this.setState({ map: false })}>Close Map</Button>
            </Modal>
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
