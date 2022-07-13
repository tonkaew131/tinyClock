import config from '../../../../config';
import Spotify from '../../../../shared/spotify';

const SpotifyWebApi = require('spotify-web-api-node');

export default async function handler(req, res) {
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

    const devices = await Spotify.getDevices(spotifyApi);

    return res.status(200).json({ data: devices });
}