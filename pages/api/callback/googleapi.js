import config from '../../../config';

const fs = require('fs');
const { google } = require('googleapis');

const TOKEN_PATH = config.googleapi.token_path;
const CREDENTIALS_PATH = config.googleapi.credential_path;

export default async function handler(req, res) {
    const code = req.query.code;

    if (!code) {
        return res.status(400).json({
            error: {
                code: 400,
                message: 'Bad Request'
            }
        });
    }

    try {
        var credentials = await fs.promises.readFile(CREDENTIALS_PATH, 'utf-8');
    } catch (err) {
        return res.status(500).json({
            error: {
                code: 500,
                message: `Cannot open ${CREDENTIALS_PATH}`
            }
        });
    }

    credentials = JSON.parse(credentials);
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    try {
        var token = await new Promise(function (resolve, reject) {
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return reject(`Error retrieving access token ${err}`);

                resolve(token);
            });
        });
    } catch (error) {
        return res.status(500).json({
            error: {
                code: 500, message: error
            }
        });
    }

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