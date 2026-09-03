import React, { useEffect, useState } from 'react';
import { Modal, Platform, StyleSheet, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, ButtonText } from '@gluestack-ui/themed';

export default function DateTimePickerModal({
  date,
  isVisible,
  maximumDate,
  onCancel,
  onConfirm,
}) {
  const [draftDate, setDraftDate] = useState(date);
  const [androidMode, setAndroidMode] = useState('date');

  useEffect(() => {
    if (isVisible) {
      setDraftDate(date);
      setAndroidMode('date');
    }
  }, [date, isVisible]);

  if (!isVisible) {
    return null;
  }

  if (Platform.OS === 'android') {
    const handleValueChange = (_event, selectedDate) => {
      if (androidMode === 'date') {
        const nextDate = new Date(selectedDate);
        nextDate.setHours(draftDate.getHours(), draftDate.getMinutes());
        setDraftDate(nextDate);
        setAndroidMode('time');
        return;
      }

      const nextDate = new Date(draftDate);
      nextDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      onConfirm(nextDate);
    };

    return (
      <DateTimePicker
        maximumDate={maximumDate}
        mode={androidMode}
        onDismiss={onCancel}
        onValueChange={handleValueChange}
        value={draftDate}
      />
    );
  }

  return (
    <Modal animationType="slide" transparent visible={isVisible} onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.content}>
          <DateTimePicker
            maximumDate={maximumDate}
            mode="datetime"
            onDismiss={onCancel}
            onValueChange={(_event, selectedDate) => setDraftDate(selectedDate)}
            value={draftDate}
          />
          <View style={styles.actions}>
            <Button action="secondary" onPress={onCancel}>
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button onPress={() => onConfirm(draftDate)}>
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
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#fff',
    gap: 16,
    padding: 20,
  },
});