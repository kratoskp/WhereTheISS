import { Button, ButtonText } from '@gluestack-ui/themed';
import { Modal, Platform, StyleSheet, View } from 'react-native';
import MapView, {
  Polyline,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';

import { COPY } from './constants';
import type { MapModalProps } from './types';

export default function MapModal({ data, onClose, visible }: MapModalProps) {
  const firstPosition = data[0];

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={styles.container}>
        {firstPosition && (
          <MapView
            initialRegion={{
              latitude: firstPosition.latitude,
              latitudeDelta: 45,
              longitude: firstPosition.longitude,
              longitudeDelta: 90,
            }}
            provider={Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFill}
          >
            <Polyline
              coordinates={data}
              geodesic
              strokeColor="#D34836"
              strokeWidth={5}
            />
          </MapView>
        )}
        <View style={styles.closeButton}>
          <Button action="secondary" onPress={onClose}>
            <ButtonText>{COPY.closeMap}</ButtonText>
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  closeButton: { position: 'absolute', right: 20, top: 54 },
  container: { backgroundColor: '#DDE2DC', flex: 1 },
});