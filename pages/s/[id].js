import React, { useEffect } from 'react';
import { useRouter } from 'next/router'

import config from '../../config';
const SERVER = config.api.url;

export default function ShortLink() {
    const router = useRouter();
    const { id } = router.query;

    const data = fetch(`${SERVER}/api/shortlink/get?id=${id}`).then(async data => {
        const json = await data.json();
        if (data.status == 200) {
            console.log(json.data.url);
            router.push(json.data.url);
        }
    });

    return (
        <div>
            <p>You are being redirected.. {id}</p>
        </div>
    )
}