import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Button, ButtonText } from '@gluestack-ui/themed';

export default function MapModal({ onClose, visible }) {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.content}>
          <Text style={styles.message}>The ISS path map is available on iOS and Android.</Text>
          <Button onPress={onClose}>
            <ButtonText>Close Map</ButtonText>
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 16,
    maxWidth: 420,
    padding: 24,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});