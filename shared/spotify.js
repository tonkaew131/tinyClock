import config from '../config';

const fs = require('fs');

const SPOTIFY_CREDENTIAL_PATH = config.spotify.credential_path;
const SPOTIFY_TOKEN_PATH = config.spotify.token_path;
module.exports = {
    randomString: function (size) {
        const CHAR_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        let result = '';
        var charactersLength = CHAR_SET.length;
        for (var i = 0; i < size; i++) {
            result += CHAR_SET.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    readCredential: async function () {
        try {
            var credential = await fs.promises.readFile(SPOTIFY_CREDENTIAL_PATH, 'utf-8');
            credential = JSON.parse(credential);
        } catch (error) {
            throw {
                error: {
                    code: 500,
                    message: `Cannot open ${SPOTIFY_CREDENTIAL_PATH}`
                }
            };
        };

        return credential;
    },
    readToken: async function () {
        try {
            var token = await fs.promises.readFile(SPOTIFY_TOKEN_PATH, 'utf-8');
            token = JSON.parse(token);
        } catch (error) {
            token = {};
        }

        return token;
    },
    writeToken: async function (content) {
        try {
            await fs.promises.writeFile(SPOTIFY_TOKEN_PATH, JSON.stringify(content));
        } catch (error) {
            throw {
                error: {
                    code: 500, message: `Error writing ${SPOTIFY_TOKEN_PATH}`
                }
            };
        }
    },
    getMyCurrentPlaybackState: function (spotifyClient) {
        return new Promise(function (resolve, reject) {
            spotifyClient.getMyCurrentPlaybackState()
                .then(function (data) {
                    return resolve(data);
                }, function (err) {
                    reject(err);
                });
        });
    },
    refreshAccessToken: function (spotifyClient) {
        return new Promise(function (resolve, reject) {
            spotifyClient.refreshAccessToken().then(
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
    }
}
