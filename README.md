# tinyClock

Multi utilities desktop gadget devices based on [3.5 inch TFT LCD](https://www.waveshare.com/wiki/3.5inch_RPi_LCD_(B))

## Getting Started

This is an example of how you may give instructions on setting up your project locally. To get a local copy up and running follow these simple example steps.

### Prerequisites

- Clone this project

```bash
git clone https://github.com/tonkaew131/tinyClock.git
```

- Install required package

```bash
npm install
```

### Installation

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

## Contributing

Feel free to fix my error.

## Authors

- **Athicha Leksansern** - *Initial work* - [Tonkaew](https://github.com/tonkaew131)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
