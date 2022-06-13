import config from '../../../config';

const SpotifyWebApi = require('spotify-web-api-node');
const fs = require('fs');

const CREDENTIALS_PATH = config.spotify.credential_path;
const TOKEN_PATH = config.spotify.token_path;

export default async function handler(req, res) {
    const code = req.query.code;
    const state = req.query.state;

    if (!code || !state) {
        return res.status(400).json({
            error: {
                code: 400,
                message: 'Bad Request'
            }
        });
    }

    try {
        var token = await fs.promises.readFile(TOKEN_PATH, 'utf-8');
        token = JSON.parse(token);
        var verifyState = token.state;
    } catch (error) {
        verifyState = '';
    }

    if (state != verifyState) {
        return res.status(412).json({
            error: {
                code: 412,
                message: 'Precondition Failed'
            }
        });
    }

    try {
        var credentials = await fs.promises.readFile(CREDENTIALS_PATH, 'utf-8');
        credentials = JSON.parse(credentials);
    } catch (error) {
        return res.status(500).json({
            error: {
                code: 500,
                message: `Cannot open ${CREDENTIALS_PATH}`
            }
        })
    }

    var credentials = {
        clientId: credentials.client_id,
        clientSecret: credentials.client_secret,
        redirectUri: `${config.api.url}/api/callback/spotify`,
    };

    const spotifyApi = new SpotifyWebApi(credentials);
    var authorizationCode = await new Promise(function (resolve, reject) {
        spotifyApi.authorizationCodeGrant(code).then(
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

    token.access_token = authorizationCode.access_token;
    token.refresh_token = authorizationCode.refresh_token;
    try {
        await fs.promises.writeFile(TOKEN_PATH, JSON.stringify(token));
    } catch (error) {
        return res.status(500).json({
            error: {
                code: 500, message: `Error writing ${TOKEN_PATH}`
            }
        });
    }

    return res.status(200).json({
        data: {
            message: `Token stored to ${TOKEN_PATH}, please try to call API again`
        }
    });
}