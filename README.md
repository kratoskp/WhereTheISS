# WhereTheISS

A cross-platform Expo application for viewing the International Space Station's
current location and historical orbital path. The application uses strict
TypeScript and platform-specific adapters for maps and date-time selection.

## Requirements

- Node.js 20.16 or newer
- Yarn 1.x
- Expo Go for running on a physical device

## Setup

Install dependencies:

```bash
yarn install
```

Copy `.env.example` to `.env` and provide Geoapify and OpenWeather API keys:

```text
EXPO_PUBLIC_GEOAPIFY_API_KEY=your_geoapify_api_key
EXPO_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
```

These values are bundled into the client. Restrict each key to the expected
domains and platforms in its provider dashboard.

Start the development server:

```bash
yarn start
```

Use `yarn android`, `yarn ios`, or `yarn web` to open a specific platform.

Native maps use `react-native-maps`: Apple Maps on iOS and Google Maps on
Android. Android production builds require a restricted Google Maps API key in
`expo.android.config.googleMaps.apiKey`; iOS needs no additional map setup.

## Quality Checks

```bash
yarn typecheck
npx expo-doctor@latest
```

The project uses strict TypeScript with unchecked indexed access enabled. All
user-facing copy is centralized in `constants.ts`, and external API payloads are
normalized behind `issApi.ts` before they reach the interface.

The `snack` branch tracks the Expo SDK version supported by the published
[Expo Snack](https://snack.expo.dev/@kratoskp/wheretheiss).
