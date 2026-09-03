import { Button, ButtonText } from '@gluestack-ui/themed';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { COPY } from './constants';
import type { MapModalProps } from './types';

export default function MapModal({ onClose, visible }: MapModalProps) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.content}>
          <Text style={styles.title}>{COPY.mapMobileTitle}</Text>
          <Text style={styles.message}>{COPY.mapMobileDescription}</Text>
          <Button onPress={onClose}>
            <ButtonText>{COPY.close}</ButtonText>
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(23, 35, 31, 0.72)',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    gap: 16,
    maxWidth: 420,
    padding: 28,
  },
  message: { color: '#68746C', fontSize: 15, lineHeight: 22 },
  title: { color: '#17231F', fontSize: 22, fontWeight: '700' },
});