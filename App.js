import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { NativeBaseProvider, Button  } from 'native-base';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

class Poll extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pickerOpened: false,
      date: new Date()
		};
	}
	closePicker = () => this.setState({ pickerOpened: false })

	handleDatePicked = value => {
		this.setState({ pickerOpened: false, date: value });
	};

	render() {
		return (
      <NativeBaseProvider>
        <View 
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Button onPress={() => this.setState({ pickerOpened: true })}>Choose date and time</Button>
        </View>
        <DateTimePickerModal
          isVisible={this.state.pickerOpened}
          mode="datetime"
          onConfirm={this.handleDatePicked}
          onCancel={() => console.log('canceled')}
        />
      </NativeBaseProvider>
		);
	}
}

export default Poll;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
