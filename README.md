# WhereTheISS

Local Environment Prerequisite

-Node.js LTS release

-Git

-Watchman for macOS users

-Expo cli

-Expo go app install on physical device (https://apps.apple.com/us/app/expo-go/id982107779 / https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US)

Pull repo and then install with **yarn** or **npm install**

Copy `.env.example` to `.env` and set the Geoapify and OpenWeather API keys:

```text
EXPO_PUBLIC_GEOAPIFY_API_KEY=your_geoapify_api_key
EXPO_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
```

These are public client variables. Restrict the keys to the app's domains and platforms in each provider dashboard.

In the project path run the command **expo start** and then proceed to scan the qr code with expo go app

Alternatively, if you want to skip setting up the local environment, you can head to over to a snack https://snack.expo.dev/@kratoskp/wheretheiss and then proceed to scan the qr code once **My Device** is selected
