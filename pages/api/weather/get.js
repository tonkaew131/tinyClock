import locationKeys from '../../../components/LocationKeys.data';

export default async function handler(req, res) {
    const locationkey = req.param.location_id;
    if (!(locationkey in Object.keys(locationKeys))) {
        return res.status(404).json({
            error: {
                code: 404,
                message: 'Not Found'
            }
        });
    }

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
         - Called every hour (24 calls/day) if only if localation are same.
        3. 5 Days of Daily Forecasts
         - http://dataservice.accuweather.com/forecasts/v1/daily/5day/{locationKey}
         - Called once a day (1 calls/day) if only if localation are same.
    */

    return res.status(200).json({
        joe: 'mama'
    });
}