import { Button, ButtonText } from '@gluestack-ui/themed';
import { useEffect, useState, type ChangeEvent, type CSSProperties } from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import { COPY } from './constants';
import type { DateTimePickerModalProps } from './types';

const toInputValue = (date: Date): string => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
};

export default function DateTimePickerModal({
  date,
  isVisible,
  maximumDate,
  onCancel,
  onConfirm,
}: DateTimePickerModalProps) {
  const [value, setValue] = useState(toInputValue(date));

  useEffect(() => {
    if (isVisible) setValue(toInputValue(date));
  }, [date, isVisible]);

  return (
    <Modal animationType="fade" transparent visible={isVisible} onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.content}>
          <input
            aria-label={COPY.dateTimeLabel}
            max={maximumDate ? toInputValue(maximumDate) : undefined}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setValue(event.target.value)
            }
            style={inputStyle}
            type="datetime-local"
            value={value}
          />
          <View style={styles.actions}>
            <Button action="secondary" onPress={onCancel}>
              <ButtonText>{COPY.cancel}</ButtonText>
            </Button>
            <Button onPress={() => onConfirm(new Date(value))}>
              <ButtonText>{COPY.confirm}</ButtonText>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const inputStyle: CSSProperties = {
  border: '1px solid #AAB3A9',
  borderRadius: 4,
  color: '#17231F',
  fontFamily: 'sans-serif',
  fontSize: 16,
  padding: 12,
};

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 12, justifyContent: 'flex-end' },
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(23, 35, 31, 0.72)',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    gap: 18,
    maxWidth: 420,
    padding: 28,
    width: '100%',
  },
});