import config from '../../../../config';
import Spotify from '../../../../shared/spotify';

const SpotifyWebApi = require('spotify-web-api-node');

export default async function handler(req, res) {
    var body = req.body;
    if (!body) {
        return res.status(400).json({
            error: {
                code: 400,
                message: 'Bad Request'
            }
        });
    }

    try {
        body = JSON.parse(body);
    } catch (error) {
        return res.status(400).json({
            error: {
                code: 400,
                message: 'Bad Request'
            }
        });
    }

    if (!('methods' in body) || body.methods.length == 0) {
        return res.status(400).json({
            error: {
                code: 400,
                message: 'Bad Request'
            }
        });
    }

    try {
        var credential = await Spotify.readCredential();
    } catch (error) {
        return res.status(error.code).json(error);
    }

    var spotifyApi = new SpotifyWebApi({
        redirectUri: `${config.api.url}/api/callback/spotify`,
        clientId: credential.client_id,
        clientSecret: credential.client_secret
    });

    var token = await Spotify.readToken();
    spotifyApi.setAccessToken(token.access_token);

    const methods = body.methods;
    for (let i = 0; i < methods.length; i++) {
        try {
            const methodType = methods[i].type;

            if (methodType == 'pause') {
                await Spotify.pause(spotifyApi);
            } else if (methodType == 'play') {
                await Spotify.play(spotifyApi);
            } else if (methodType == 'skip_to_next') {
                await Spotify.skipToNext(spotifyApi);
            } else if (methodType == 'skip_to_previous') {
                await Spotify.skipToPrevious(spotifyApi);
            } else if (methodType == 'set_shuffle') {
                await Spotify.setShuffle(spotifyApi, methods[i].value);
            } else if (methodType == 'set_repeat') {
                await Spotify.setRepeat(spotifyApi, methods[i].value);
            } else if (methodType == 'set_volume') {
                await Spotify.setVolume(spotifyApi, methods[i].value);
            }
        } catch (error) {
            // Fix later
            console.error(error);
        }
    }

    return res.status(200).json({ data: {} });
}