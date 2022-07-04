import config from '../../../../config';
import Spotify from '../../../../shared/spotify';

const SpotifyWebApi = require('spotify-web-api-node');

export default async function handler(req, res) {
    try {
        var credential = await Spotify.readCredential();
    } catch (error) {
        return res.status(error.error.code).json(error);
    }

    var spotifyApi = new SpotifyWebApi({
        redirectUri: `${config.api.url}/api/callback/spotify`,
        clientId: credential.client_id,
        clientSecret: credential.client_secret
    });

    var token = await Spotify.readToken();
    spotifyApi.setAccessToken(token.access_token);

    try {
        var currentPlaybackState = await Spotify.getMyCurrentPlaybackState(spotifyApi);
    } catch (error) {
        var errorType = error.body?.error?.message || 'Server Error (Unknown reason)';
        var errorCode = error.body?.error?.code || 500;

        if (errorType == 'Server Error (Unknown reason)') console.error(error);

        const state = Spotify.randomString(16);
        if (errorType == 'No token provided') {

            // For verifying state
            try {
                await Spotify.writeToken({ access_token: token.access_token, state: state });
            } catch (error) {
                return res.status(error.code).json(error);
            }

            const scopes = [
                'user-modify-playback-state', // Write access to a user’s playback state.
                'user-read-playback-state', // Read access to a user’s player state.
                'user-library-read', // Read access to a user's library.
            ];
            // const showDialog = true;
            // const responseType = 'token';

            // Create the authorization URL
            const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

            // Redirect...
            return res.status(302).json({
                data: {
                    url: authorizeURL
                }
            });
        }

        if (errorType == 'The access token expired' || errorType == 'Invalid access token') {
            spotifyApi.setAccessToken(token.access_token);
            spotifyApi.setRefreshToken(token.refresh_token);

            try {
                var authorizationCode = await Spotify.refreshAccessToken(spotifyApi);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: { code: 500, message: 'Error refreshing token' } });
            }

            spotifyApi.setAccessToken(authorizationCode.access_token);
            token.access_token = authorizationCode.access_token;

            // Save new accessToken;
            try {
                await Spotify.writeToken(token);
            } catch (error) {
                return res.status(error.code).json(error);
            }

            try {
                var currentPlaybackState = await Spotify.getMyCurrentPlaybackState(spotifyApi);
            } catch (error) {
                errorType = error.body.error.message;
                errorCode = error.body.error.code || 500;

                return res.status(errorCode).json({
                    error: {
                        code: errorCode,
                        message: errorType
                    }
                });
            }
        }

        return res.status(errorCode).json({
            error: {
                code: errorCode,
                message: errorType
            }
        });
    }

    return res.status(200).json({
        data: currentPlaybackState
    });
}