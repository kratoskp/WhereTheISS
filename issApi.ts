import axios from 'axios';

import { COPY, FALLBACK_LOCATION_NAME } from './constants';
import type {
  Coordinates,
  IssPosition,
  IssRecord,
  LocationFeature,
  WeatherCondition,
} from './types';

const ISS_POSITIONS_URL =
  'https://api.wheretheiss.at/v1/satellites/25544/positions';
const GEOAPIFY_URL = 'https://api.geoapify.com/v1/geocode/reverse';
const OPENWEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

const geoapifyApiKey = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;
const openWeatherApiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

const fallbackFeatures: LocationFeature[] = [
  { properties: { name: FALLBACK_LOCATION_NAME } },
];
const fallbackWeather: WeatherCondition[] = [
  { description: COPY.weatherUnavailable },
];

interface GeoapifyResponse {
  features?: LocationFeature[];
}

interface OpenWeatherResponse {
  weather?: WeatherCondition[];
}

const getLocation = async ({
  latitude,
  longitude,
}: Coordinates): Promise<LocationFeature[]> => {
  if (!geoapifyApiKey) return fallbackFeatures;

  try {
    const { data } = await axios.get<GeoapifyResponse>(GEOAPIFY_URL, {
      params: { apiKey: geoapifyApiKey, lat: latitude, lon: longitude },
    });
    return data.features?.length ? data.features : fallbackFeatures;
  } catch {
    return fallbackFeatures;
  }
};

const getWeather = async ({
  latitude,
  longitude,
}: Coordinates): Promise<WeatherCondition[]> => {
  if (!openWeatherApiKey) return fallbackWeather;

  try {
    const { data } = await axios.get<OpenWeatherResponse>(OPENWEATHER_URL, {
      params: { appid: openWeatherApiKey, lat: latitude, lon: longitude },
    });
    return data.weather?.length ? data.weather : fallbackWeather;
  } catch {
    return fallbackWeather;
  }
};

export const getIssData = async (
  timestamps: number | string
): Promise<IssRecord[]> => {
  const { data } = await axios.get<IssPosition[]>(ISS_POSITIONS_URL, {
    params: { timestamps },
  });

  return Promise.all(
    data.map(async (position) => {
      const [features, weather] = await Promise.all([
        getLocation(position),
        getWeather(position),
      ]);
      return { ...position, current: { weather }, features };
    })
  );
};