// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import config from '../../../config';

const fs = require('fs');

const LINKS_PATH = config.shortlink.links_path;
const URL = config.shortlink.url;

function randomURL() {
    const chars = 'abcdefghijklmn0123456789';

    var result = chars[Math.floor(Math.random() * chars.length)];
    result += chars[Math.floor(Math.random() * chars.length)];
    result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

export default async function handler(req, res) {
    try {
        var url = JSON.parse(req.body).url;
    } catch (error) {
        return res.status(400).json({
            error: {
                code: 400,
                message: 'Bad Request'
            }
        });
    }

    if (!url) {
        return res.status(400).json({
            error: {
                code: 400,
                message: 'Bad Request'
            }
        });
    }

    try {
        var shortLinks = await fs.promises.readFile(LINKS_PATH, 'utf-8');
    } catch (err) {
        try {
            await fs.promises.writeFile(LINKS_PATH, JSON.stringify({}));
        } catch (error) {
            return res.status(500).json({
                error: {
                    code: 500,
                    message: `Cannot create ${LINKS_PATH}`
                }
            });
        }

        try {
            shortLinks = await fs.promises.readFile(LINKS_PATH, 'utf-8');
        } catch (error) {
            return res.status(500).json({
                error: {
                    code: 500,
                    message: `Cannot open ${LINKS_PATH}`
                }
            });
        }
    }

    shortLinks = JSON.parse(shortLinks);
    if (url in Object.values(shortLinks)) {
        let key = Object.keys(shortLinks).find(key => shortLinks[key] === url);

        return res.status(200).json({
            data: {
                url: `${URL}/s/${shortLinks[key]}`
            }
        })
    }

    var genURL = randomURL();
    while (genURL in shortLinks) genURL = randomURL();

    shortLinks[genURL] = url;

    try {
        await fs.promises.writeFile(LINKS_PATH, JSON.stringify(shortLinks));
    } catch (error) {
        return res.status(500).json({
            error: {
                code: 500, message: `Error writing ${LINKS_PATH}`
            }
        });
    }

    return res.status(200).json({
        data: {
            url: `${URL}/s/${genURL}/`
        }
    })
}