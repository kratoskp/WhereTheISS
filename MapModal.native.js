import React from 'react';
import { Dimensions, Modal } from 'react-native';
import { Button, ButtonText } from '@gluestack-ui/themed';
import MapView, { Polyline } from 'react-native-maps';

export default function MapModal({ data, onClose, visible }) {
  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <MapView
        style={{
          height: Dimensions.get('screen').height / 2,
          width: Dimensions.get('screen').width,
        }}
      >
        <Polyline
          coordinates={data}
          strokeColor="#7F0000"
          strokeWidth={6}
          lineDashPattern={[1]}
        />
      </MapView>
      <Button onPress={onClose}>
        <ButtonText>Close Map</ButtonText>
      </Button>
    </Modal>
  );
}