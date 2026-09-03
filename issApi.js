import axios from 'axios';

const ISS_POSITIONS_URL =
  'https://api.wheretheiss.at/v1/satellites/25544/positions';
const GEOAPIFY_URL = 'https://api.geoapify.com/v1/geocode/reverse';
const OPENWEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

const geoapifyApiKey = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;
const openWeatherApiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

const fallbackLocation = {
  features: [
    {
      properties: {
        city: '',
        country: '',
        name: 'Over the sea',
        state: '',
      },
    },
  ],
};

const fallbackWeather = {
  current: {
    weather: [{ description: 'weather unavailable' }],
  },
};

const getLocation = async ({ latitude, longitude }) => {
  if (!geoapifyApiKey) {
    return fallbackLocation;
  }

  try {
    const response = await axios.get(GEOAPIFY_URL, {
      params: { apiKey: geoapifyApiKey, lat: latitude, lon: longitude },
    });
    return response.data.features?.length ? response.data : fallbackLocation;
  } catch {
    return fallbackLocation;
  }
};

const getWeather = async ({ latitude, longitude }) => {
  if (!openWeatherApiKey) {
    return fallbackWeather;
  }

  try {
    const response = await axios.get(OPENWEATHER_URL, {
      params: {
        appid: openWeatherApiKey,
        lat: latitude,
        lon: longitude,
      },
    });
    return {
      current: {
        weather: response.data.weather ?? fallbackWeather.current.weather,
      },
    };
  } catch {
    return fallbackWeather;
  }
};

export const getIssData = async (timestamps) => {
  const response = await axios.get(ISS_POSITIONS_URL, {
    params: { timestamps },
  });

  return Promise.all(
    response.data.map(async (position) => {
      const [location, weather] = await Promise.all([
        getLocation(position),
        getWeather(position),
      ]);

      return { ...location, ...weather, ...position };
    })
  );
};