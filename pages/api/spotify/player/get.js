import config from '../../../../config';

const SpotifyWebApi = require('spotify-web-api-node');
const fs = require('fs');

const SPOTIFY_CREDENTIAL_PATH = config.spotify.credential_path;
const SPOTIFY_TOKEN_PATH = config.spotify.token_path;

function randomString(size) {
    const CHAR_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let result = '';
    var charactersLength = CHAR_SET.length;
    for (var i = 0; i < size; i++) {
        result += CHAR_SET.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export default async function handler(req, res) {
    try {
        var credential = await fs.promises.readFile(SPOTIFY_CREDENTIAL_PATH, 'utf-8');
        credential = JSON.parse(credential);
    } catch (error) {
        return res.status(500).json({
            error: {
                code: 500,
                message: `Cannot open ${SPOTIFY_CREDENTIAL_PATH}`
            }
        });
    }

    var spotifyApi = new SpotifyWebApi({
        redirectUri: `${config.api.url}/api/callback/spotify`,
        clientId: credential.client_id,
        clientSecret: credential.client_secret
    });

    try {
        var token = await fs.promises.readFile(SPOTIFY_TOKEN_PATH, 'utf-8');
        token = JSON.parse(token);
    } catch (error) {
        token = {};
    }

    spotifyApi.setAccessToken(token.access_token);

    try {
        var currentPlaybackState = await new Promise(function (resolve, reject) {
            spotifyApi.getMyCurrentPlaybackState()
                .then(function (data) {
                    return resolve(data);
                }, function (err) {
                    reject(err);
                });
        });
    } catch (error) {
        var errorType = error.body.error.message;
        var errorCode = error.body.error.code || 500;

        const state = randomString(16);
        if (errorType == 'No token provided') {
            // For verifying state
            try {
                await fs.promises.writeFile(SPOTIFY_TOKEN_PATH, JSON.stringify({ access_token: token.access_token, state: state }));
            } catch (error) {
                return res.status(500).json({
                    error: {
                        code: 500, message: `Error writing ${SPOTIFY_TOKEN_PATH}`
                    }
                });
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

            var authorizationCode = await new Promise(function (resolve, reject) {
                spotifyApi.refreshAccessToken().then(
                    function (data) {
                        return resolve({
                            access_token: data.body['access_token'],
                            refresh_token: data.body['refresh_token']
                        });
                    },
                    function (err) {
                        return reject(err);
                    }
                );
            });

            spotifyApi.setAccessToken(authorizationCode.access_token);
            token.access_token = authorizationCode.access_token;

            // Save new accessToken;
            try {
                await fs.promises.writeFile(TOKEN_PATH, JSON.stringify(token));
            } catch (error) {
                return res.status(500).json({
                    error: {
                        code: 500, message: `Error writing ${TOKEN_PATH}`
                    }
                });
            }

            try {
                var currentPlaybackState = await new Promise(function (resolve, reject) {
                    spotifyApi.getMyCurrentPlaybackState()
                        .then(function (data) {
                            return resolve(data);
                        }, function (err) {
                            reject(err);
                        });
                });
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