import locationKeys from '../../../components/LocationKeys.data';
import config from '../../../config';

const fs = require('fs');

const ACCU_WEATHER_TOKEN_PATH = config.accu_weather.token_path;
var CORE_WEATHER_TOKEN = '';
var MINUTE_CAST_TOKEN = '';

async function readFile(filePath) {
    try {
        var json = await fs.promises.readFile(filePath, 'utf-8');
        json = JSON.parse(json);
    } catch (error) {
        errorMessage = `Error reading ${filePath}`;
        errorCode = 500;
        if (error.includes('Error: ENOENT: no such file or directory')) {
            errorMessage = `No such file or directory, ${filePath}`;
            errorCode = 404;
        }

        throw {
            error: {
                code: errorCode, message: errorMessage
            }
        };
    }

    return json;
};

async function writeFile(filePath, content) {
    try {
        await fs.promises.writeFile(filePath, JSON.stringify(content));
    } catch (error) {
        throw {
            error: {
                code: 500, message: `Error writing ${filePath}`
            }
        };
    }
}

async function getCoreWeatherToken() {
    if (CORE_WEATHER_TOKEN != '') return CORE_WEATHER_TOKEN;

    try {
        var tokenFile = await readFile(ACCU_WEATHER_TOKEN_PATH);
    } catch (error) {
        throw error;
    }

    CORE_WEATHER_TOKEN = tokenFile.core_weather.access_token;
    MINUTE_CAST_TOKEN = tokenFile.minute_cast.access_token;
    return CORE_WEATHER_TOKEN;
}

async function getMinuteCastToken() {
    if (MINUTE_CAST_TOKEN != '') return MINUTE_CAST_TOKEN;

    try {
        var tokenFile = await readFile(ACCU_WEATHER_TOKEN_PATH);
    } catch (error) {
        throw error;
    }

    CORE_WEATHER_TOKEN = tokenFile.core_weather.access_token;
    MINUTE_CAST_TOKEN = tokenFile.minute_cast.access_token;
    return MINUTE_CAST_TOKEN;
}

// MinuteCast (every 1 hour)
async function getMinuteCast(locationID) {
    const FILE_PATH = `./db/${locationID}_minute_cast.json`;
    const CACHE_DURATION = 60 * 60 * 1000; // in ms

    try {
        var weatherData = await readFile(FILE_PATH);
    } catch (error) {
        weatherData = {};
    }

    const timestamp = weatherData.timestamp || 0;
    const currentMillis = Date.now();
    if ((currentMillis - timestamp) < CACHE_DURATION) {
        return weatherData.data;
    }

    const lat = locationKeys[locationID].geo_position.lat;
    const long = locationKeys[locationID].geo_position.long;

    try {
        var token = await getMinuteCastToken();
    } catch (error) {
        throw error;
    }

    const uri = `https://dataservice.accuweather.com/forecasts/v1/minute?apikey=${token}&q=${lat},${long}`;
    const res = await fetch(uri);
    const data = await res.json();
    // Assume its just work, forget abt error handler.

    console.log('Data rewrited!, MinuteCast');
    weatherData.timestamp = currentMillis;
    weatherData.data = data;

    try {
        await writeFile(FILE_PATH, weatherData);
    } catch (error) {
        throw error;
    }

    return weatherData.data;
}

// Current Condition (every 1 hour)
async function getCurrentCondition(locationID) {
    const FILE_PATH = `./db/${locationID}_current_condition.json`;
    const CACHE_DURATION = 60 * 60 * 1000; // in ms

    try {
        var weatherData = await readFile(FILE_PATH);
    } catch (error) {
        weatherData = {};
    }

    const timestamp = weatherData.timestamp || 0;
    const currentMillis = Date.now();
    if ((currentMillis - timestamp) < CACHE_DURATION) {
        return weatherData.data;
    }

    try {
        var token = await getCoreWeatherToken();
    } catch (error) {
        throw error;
    }

    const uri = `http://dataservice.accuweather.com/currentconditions/v1/${locationID}?apikey=${token}`;
    const res = await fetch(uri);
    const data = await res.json();

    console.log('Data rewrited! (Current Condition)');
    weatherData.timestamp = currentMillis;
    weatherData.data = data;

    try {
        await writeFile(FILE_PATH, weatherData);
    } catch (error) {
        throw error;
    }

    return weatherData.data;
}

// 5 Days of Daily Forecasts (every 1 day)
async function getDailyForecast(locationID) {
    const FILE_PATH = `./db/${locationID}_daily_forecast.json`;
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // in ms

    try {
        var weatherData = await readFile(FILE_PATH);
    } catch (error) {
        weatherData = {};
    }

    const timestamp = weatherData.timestamp || 0;
    const currentMillis = Date.now();
    if ((currentMillis - timestamp) < CACHE_DURATION) {
        return weatherData.data;
    }

    try {
        var token = await getCoreWeatherToken();
    } catch (error) {
        throw error;
    }

    const uri = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationID}?apikey=${token}`;
    const res = await fetch(uri);
    const data = await res.json();

    console.log('Data rewrited! (Daily Forecasts)');
    weatherData.timestamp = currentMillis;
    weatherData.data = data;

    try {
        await writeFile(FILE_PATH, weatherData);
    } catch (error) {
        throw error;
    }

    return weatherData.data;
}

export default async function handler(req, res) {
    /*
    Location Keys
     - 2032097: Ban Bang Rak Yai, Nonthaburi
        - Lat: 13.883
        - Long: 100.438

    MinuteCast API (120-minute precipitation)
     - http://dataservice.accuweather.com/forecasts/v1/minute
     - 25 calls/day (1 per hour)

    Core Weather
     - 50 calls/day (2 per hour)
        1. Locations API
         - Called once location changed
         - Save for next used
        2. Current Conditions
         - http://dataservice.accuweather.com/currentconditions/v1/{locationKey}
         - Called every hour (24 calls/day) if only if location are same.
        3. 5 Days of Daily Forecasts
         - http://dataservice.accuweather.com/forecasts/v1/daily/5day/{locationKey}
         - Called once a day (1 calls/day) if only if location are same.
    */

    const locationkey = req.query.location_id;
    if (!locationkey) {
        return res.status(400).json({
            error: {
                code: 400,
                message: 'Bad Request'
            }
        });
    }

    if (!(Object.keys(locationKeys).includes(locationkey))) {
        return res.status(404).json({
            error: {
                code: 404,
                message: 'Not Found'
            }
        });
    }

    try {
        var minuteCast = await getMinuteCast(locationkey);
    } catch (error) {
        return res.status(error.error.code).json(error);
    }

    try {
        var currentCondition = await getCurrentCondition(locationkey);
    } catch (error) {
        return res.status(error.error.code).json(error);
    }

    try {
        var dailyForecast = await getDailyForecast(locationkey);
    } catch (error) {
        return res.status(error.error.code).json(error);
    }

    return res.status(200).json({
        data: {
            minute_cast: minuteCast,
            current_condition: currentCondition,
            daily_forecast: dailyForecast,
        }
    });
}