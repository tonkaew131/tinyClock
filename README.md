## Installing
First we need to clone this project,

``` 
$ git clone https://github.com/tonkaew131/tinyClock.git
```

Add required creditential

- /secret/accuweather_token.json
```json
{
    "core_weather": {
        "access_token": "COREWEATHER_ACCES_TOKEN_HERE"
    },
    "minute_cast": {
        "access_token": "COREWEATHER_ACCES_TOKEN_HERE"
    }
}
```

- /secret/spotify_credentials.json
```json
{
    "client_id": "SPOTIFY_CLIEND_ID_HERE",
    "client_secret": "SPOTIFY_TOKEN_ID_HERE"
}
```

- /secret/google_credentials.json: Here you can download directly from Google Console

Then we the development server

```
$ npm run dev
```

If you need to build production

```
$ npm run build
```

Then start!

```
$ npm start
```

## Note for me

Screen resolution: `480×320`

Get Google API Credentials at https://console.cloud.google.com/apis/credentials
-> Create OAuth client ID

https://github.com/catppuccin/catppuccin

Stocks price notify # For Wansai

API:

    - Calendar: [Google Calendar API](https://console.cloud.google.com/apis/credentials)

    - Spotify: [Spotify Web API](https://developer.spotify.com/dashboard/applications)

    - Weather: [AccuWeather API](https://developer.accuweather.com/apis)

Features

- Working On:

    - Stop Watch / Timer

- On Hold!:

    - Weather (maybe integrate with external thermal/humid sensor)

- Done:

    - Clock (might add weather later)

    - Calendar

    - Spotify (basic function)

- Plan:

    - Radio

    - PC Performance

    - Notification via Bluetooth
