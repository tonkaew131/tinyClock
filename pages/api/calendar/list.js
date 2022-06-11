// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import config from '../../../config';

const fs = require('fs');
const { google } = require('googleapis');

const TOKEN_PATH = config.googleapi.token_path;
const CREDENTIALS_PATH = config.googleapi.credential_path;

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

async function listEvents(auth) {
    return new Promise(function (resolve, reject) {
        const calendar = google.calendar({ version: 'v3', auth });
        calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        }, (err, res) => {
            if (err) return reject(`Error talking to Google API, ${err}`);

            const events = res.data.items;
            if (events.length) {
                resolve(events.map(e => {
                    return { name: e.summary, start: e.start };
                }));
                return;
            }

            resolve([]);
        });
    });
}

export default async function handler(req, res) {
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
        var token = await fs.promises.readFile(TOKEN_PATH);
    } catch (error) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });

        return res.status(302).json({
            data: {
                url: authUrl
            }
        });
    }

    oAuth2Client.setCredentials(JSON.parse(token));

    try {
        var events = await listEvents(oAuth2Client);
    } catch (error) {
        return res.status(500).json({
            error: {
                code: 500,
                message: error
            }
        });
    }

    return res.status(200).json({
        data: {
            events: events
        }
    });
}
