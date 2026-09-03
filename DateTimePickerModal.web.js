import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Button, ButtonText } from '@gluestack-ui/themed';

const toInputValue = (date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

export default function DateTimePickerModal({
  date,
  isVisible,
  maximumDate,
  onCancel,
  onConfirm,
}) {
  const [value, setValue] = useState(toInputValue(date));

  useEffect(() => {
    if (isVisible) {
      setValue(toInputValue(date));
    }
  }, [date, isVisible]);

  return (
    <Modal animationType="fade" transparent visible={isVisible} onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.content}>
          {React.createElement('input', {
            max: maximumDate ? toInputValue(maximumDate) : undefined,
            onChange: (event) => setValue(event.target.value),
            type: 'datetime-local',
            value,
          })}
          <View style={styles.actions}>
            <Button action="secondary" onPress={onCancel}>
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button onPress={() => onConfirm(new Date(value))}>
              <ButtonText>Confirm</ButtonText>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    backgroundColor: '#fff',
    gap: 16,
    maxWidth: 420,
    padding: 24,
    width: '90%',
  },
});