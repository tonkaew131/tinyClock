// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import config from '../../../config';

const fs = require('fs');

const LINKS_PATH = config.shortlink.links_path;

export default async function handler(req, res) {
    const id = req.query.id;
    if (!id) {
        return res.status(400).json({
            error: {
                code: 400, message: 'Bad Request'
            }
        });
    }

    try {
        var shortLinks = await fs.promises.readFile(LINKS_PATH, 'utf-8');
    } catch (err) {
        return res.status(500).json({
            error: {
                code: 500,
                message: `Cannot open ${LINKS_PATH}`
            }
        });
    }

    shortLinks = JSON.parse(shortLinks);
    if (!(id in shortLinks)) {
        return res.status(404).json({
            error: {
                code: 404, message: `Invalid shorten link id ,${id}`
            }
        });
    }

    return res.status(200).json({
        data: {
            url: shortLinks[id]
        }
    })
}