import React from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Button, ButtonText, GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import DateTimePickerModal from './DateTimePickerModal';
import Moment from 'moment';
import MapModal from './MapModal';
import { getIssData } from './issApi';

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
    try {
      let response = await this.getData(new Date())
      this.setState({ currentLocation: response[0] })
    } catch (error) {
      console.error('Unable to load the current ISS location.', error)
    }
  }

  getData = async (dateTime, multi) => {
    const timestamps = multi !== undefined ? multi : Moment(dateTime).unix()
    return getIssData(timestamps)
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
    try {
      let response = await this.getData(true, timeString)
      this.setState({ data: response, loading: false })
    } catch (error) {
      console.error('Unable to load the selected ISS path.', error)
      this.setState({ loading: false })
    }

	};

	render() {
		return (
  <GluestackUIProvider config={config}>
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
            <Button onPress={() => this.setState({ pickerOpened: true })}>
              <ButtonText>Choose date and time</ButtonText>
            </Button>
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
              <Button onPress={() => this.setState({ map: true })}>
                <ButtonText>Show ISS path Visualisation</ButtonText>
              </Button>
              </View>
            }
            <MapModal
              visible={this.state.map}
              data={this.state.data}
              onClose={() => this.setState({ map: false })}
            />
          </View>
          <DateTimePickerModal
            isVisible={this.state.pickerOpened}
            date={this.state.date}
            onConfirm={(e) => this.handleDatePicked(e)}
            onCancel={() => this.setState({ pickerOpened: false })}
            maximumDate={new Date()}
          />
        </View>
      </GluestackUIProvider>
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
