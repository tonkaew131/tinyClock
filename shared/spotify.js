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
    pause: function (spotifyClient) {
        return new Promise(function (resolve, reject) {
            spotifyClient.pause()
                .then(function () {
                    resolve();
                }, function (err) {
                    reject(err);
                });
        });
    },
    play: function (spotifyClient) {
        return new Promise(function (resolve, reject) {
            spotifyClient.play()
                .then(function () {
                    resolve();
                }, function (err) {
                    reject(err);
                });
        });
    },
    skipToNext: function (spotifyClient) {
        return new Promise(function (resolve, reject) {
            spotifyClient.skipToNext()
                .then(function () {
                    resolve();
                }, function (err) {
                    reject(err);
                });
        });
    },
    skipToPrevious: function (spotifyClient) {
        return new Promise(function (resolve, reject) {
            spotifyClient.skipToPrevious()
                .then(function () {
                    resolve();
                }, function (err) {
                    reject(err);
                });
        });
    },
    setShuffle: function (spotifyClient, state) {
        return new Promise(function (resolve, reject) {
            spotifyClient.setShuffle(state)
                .then(function () {
                    resolve();
                }, function (err) {
                    reject(err);
                });
        });
    },
    setRepeat: function (spotifyClient, type) {
        if (!(['off', 'track', 'context'].includes(type))) return;

        return new Promise(function (resolve, reject) {
            spotifyClient.setRepeat(type)
                .then(function () {
                    resolve();
                }, function (err) {
                    reject(err);
                });
        });
    },
    setVolume: function (spotifyClient, volume) {
        volume = Math.round(volume);
        volume = volume > 100 ? 100 : volume;
        volume = volume < 0 ? 0 : volume;

        return new Promise(function (resolve, reject) {
            spotifyClient.setVolume(volume)
                .then(function () {
                    resolve();
                }, function (err) {
                    reject(err);
                });
        });
    },
    seekPosition: function (spotifyClient, progressMs) {
        progressMs = Math.round(progressMs);
        return new Promise(function (resolve, reject) {
            spotifyClient.seek(progressMs)
                .then(function () {
                    resolve();
                }, function (err) {
                    reject(err);
                });
        });
    },
    getDevices: function (spotifyClient) {
        return new Promise(function (resolve, reject) {
            spotifyClient.getMyDevices()
                .then(function (data) {
                    const availableDevices = data.body.devices;
                    resolve(availableDevices);
                }, function (err) {
                    reject(err);
                });
        });
    },
    changeDevice: function (spotifyClient, deviceId) {
        return new Promise(function (resolve, reject) {
            spotifyClient.transferMyPlayback([deviceId])
                .then(function () {
                    resolve();
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
    },
}
