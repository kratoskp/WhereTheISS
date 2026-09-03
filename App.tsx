import { config } from '@gluestack-ui/config';
import { Button, ButtonText, GluestackUIProvider } from '@gluestack-ui/themed';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { COPY, FALLBACK_LOCATION_NAME } from './constants';
import DateTimePickerModal from './DateTimePickerModal';
import { getIssData } from './issApi';
import MapModal from './MapModal';
import type { IssRecord } from './types';

const formatDateTime = (timestamp: number): string =>
  new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(timestamp * 1000));

const formatLocation = (record: IssRecord): string => {
  const properties = record.features[0]?.properties;
  const parts = [
    properties?.name,
    properties?.city,
    properties?.state,
    properties?.country,
  ];
  return [...new Set(parts.filter((part): part is string => Boolean(part)))].join(', ') || FALLBACK_LOCATION_NAME;
};

const buildTimeline = (date: Date): string => {
  const selectedTime = Math.floor(date.getTime() / 1000);
  return Array.from(
    { length: 13 },
    (_, index) => selectedTime + (index - 6) * 600
  ).join(',');
};

export default function App() {
  const [currentLocation, setCurrentLocation] = useState<IssRecord | null>(null);
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState<IssRecord[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadCurrentLocation = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await getIssData(Math.floor(Date.now() / 1000));
      setCurrentLocation(response[0] ?? null);
    } catch {
      setErrorMessage(COPY.livePositionError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCurrentLocation();
  }, [loadCurrentLocation]);

  const handleDatePicked = async (selectedDate: Date) => {
    setDate(selectedDate);
    setIsPickerOpen(false);
    setIsLoading(true);
    setErrorMessage(null);
    try {
      setData(await getIssData(buildTimeline(selectedDate)));
    } catch {
      setErrorMessage(COPY.pathLoadError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <GluestackUIProvider config={config}>
        <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F7F4" />
        <FlatList
          contentContainerStyle={styles.content}
          data={data}
          keyExtractor={(item) => `${item.timestamp}-${item.latitude}`}
          ListHeaderComponent={
            <View>
              <View style={styles.header}>
                <View style={styles.orbitMark} />
                <View>
                  <Text style={styles.eyebrow}>{COPY.orbitalTracker}</Text>
                  <Text style={styles.title}>{COPY.appTitle}</Text>
                </View>
              </View>

              <View style={styles.livePanel}>
                <View style={styles.liveHeading}>
                  <View style={styles.liveIndicator} />
                  <Text style={styles.liveLabel}>{COPY.livePosition}</Text>
                </View>
                <Text style={styles.location}>
                  {currentLocation
                    ? formatLocation(currentLocation)
                    : COPY.locatingStation}
                </Text>
                {currentLocation && (
                  <Text style={styles.coordinates}>
                    {`${currentLocation.latitude.toFixed(3)}°, ${currentLocation.longitude.toFixed(3)}°`}
                  </Text>
                )}
              </View>

              <View style={styles.actions}>
                <Text style={styles.sectionTitle}>{COPY.exploreTitle}</Text>
                <Text style={styles.supportingText}>{COPY.exploreDescription}</Text>
                <Button
                  style={styles.primaryButton}
                  onPress={() => setIsPickerOpen(true)}
                >
                  <ButtonText style={styles.primaryButtonText}>
                    {COPY.chooseDateTime}
                  </ButtonText>
                </Button>
              </View>

              {errorMessage && (
                <View style={styles.errorPanel}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                  {!currentLocation && (
                    <Button
                      action="secondary"
                      size="sm"
                      onPress={() => void loadCurrentLocation()}
                    >
                      <ButtonText>{COPY.retry}</ButtonText>
                    </Button>
                  )}
                </View>
              )}

              {isLoading && (
                <ActivityIndicator
                  color="#D34836"
                  size="large"
                  style={styles.loader}
                />
              )}

              {data.length > 0 && (
                <View style={styles.resultsHeading}>
                  <Text style={styles.sectionTitle}>{COPY.orbitalTimeline}</Text>
                  <Text style={styles.resultCount}>
                    {`${data.length} ${COPY.positions}`}
                  </Text>
                </View>
              )}
            </View>
          }
          renderItem={({ item, index }) => (
            <View style={[styles.positionRow, index === 6 && styles.selectedRow]}>
              <View style={[styles.timelineDot, index === 6 && styles.selectedDot]} />
              <View style={styles.positionContent}>
                <Text style={styles.positionTime}>{formatDateTime(item.timestamp)}</Text>
                <Text style={styles.positionLocation}>{formatLocation(item)}</Text>
                <Text style={styles.weather}>
                  {item.current.weather[0]?.description ?? COPY.weatherUnavailable}
                </Text>
              </View>
              {index === 6 && (
                <Text style={styles.selectedLabel}>{COPY.selected}</Text>
              )}
            </View>
          )}
          ListFooterComponent={
            data.length > 0 ? (
              <Button style={styles.mapButton} onPress={() => setIsMapOpen(true)}>
                <ButtonText style={styles.primaryButtonText}>{COPY.viewMap}</ButtonText>
              </Button>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />

        <MapModal
          data={data}
          visible={isMapOpen}
          onClose={() => setIsMapOpen(false)}
        />
        <DateTimePickerModal
          date={date}
          isVisible={isPickerOpen}
          maximumDate={new Date()}
          onCancel={() => setIsPickerOpen(false)}
          onConfirm={(value) => void handleDatePicked(value)}
        />
        </SafeAreaView>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  actions: { marginTop: 34 },
  content: {
    alignSelf: 'center',
    maxWidth: 960,
    paddingBottom: 48,
    paddingHorizontal: 20,
    width: '100%',
  },
  coordinates: { color: '#AAB3A9', fontSize: 13, marginTop: 8 },
  errorPanel: {
    alignItems: 'center',
    backgroundColor: '#FCE9E6',
    borderLeftColor: '#D34836',
    borderLeftWidth: 3,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 18,
    padding: 14,
  },
  errorText: { color: '#76291F', flex: 1, fontSize: 14 },
  eyebrow: { color: '#D34836', fontSize: 11, fontWeight: '700', letterSpacing: 0 },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    paddingBottom: 24,
    paddingTop: 18,
  },
  liveHeading: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  liveIndicator: { backgroundColor: '#49B78A', borderRadius: 4, height: 8, width: 8 },
  liveLabel: { color: '#AAB3A9', fontSize: 11, fontWeight: '700', letterSpacing: 0 },
  livePanel: { backgroundColor: '#17231F', borderRadius: 8, padding: 22 },
  loader: { marginVertical: 28 },
  location: { color: '#FFFFFF', fontSize: 25, fontWeight: '700', marginTop: 18 },
  mapButton: {
    alignSelf: 'center',
    backgroundColor: '#17231F',
    marginTop: 26,
    minWidth: 210,
  },
  orbitMark: {
    borderColor: '#D34836',
    borderRadius: 22,
    borderWidth: 5,
    height: 44,
    width: 44,
  },
  positionContent: { flex: 1 },
  positionLocation: { color: '#17231F', fontSize: 16, fontWeight: '600', marginTop: 4 },
  positionRow: {
    alignItems: 'flex-start',
    borderBottomColor: '#DDE2DC',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    minHeight: 92,
    paddingVertical: 16,
  },
  positionTime: { color: '#68746C', fontSize: 12, fontWeight: '600' },
  primaryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#D34836',
    marginTop: 18,
    minWidth: 210,
  },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '700' },
  resultCount: { color: '#68746C', fontSize: 13 },
  resultsHeading: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 38,
    paddingBottom: 8,
  },
  safeArea: { backgroundColor: '#F5F7F4', flex: 1 },
  sectionTitle: { color: '#17231F', fontSize: 20, fontWeight: '700' },
  selectedDot: { backgroundColor: '#D34836', height: 12, width: 12 },
  selectedLabel: { color: '#D34836', fontSize: 10, fontWeight: '800' },
  selectedRow: { backgroundColor: '#EEF2EC' },
  supportingText: {
    color: '#68746C',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    maxWidth: 520,
  },
  timelineDot: {
    backgroundColor: '#AAB3A9',
    borderRadius: 6,
    height: 8,
    marginTop: 5,
    width: 8,
  },
  title: { color: '#17231F', fontSize: 28, fontWeight: '800', marginTop: 2 },
  weather: {
    color: '#68746C',
    fontSize: 13,
    marginTop: 5,
    textTransform: 'capitalize',
  },
});