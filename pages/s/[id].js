import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'

import config from '../../config';
const SERVER = config.api.url;

export default function ShortLink() {
    const [error, setError] = useState();
    const router = useRouter();
    const { id } = router.query;


    useEffect(() => {
        if (id == undefined) {
            return setError('Invalid Short Link URL!');
        }

        const data = fetch(`${SERVER}/api/shortlink/get?id=${id}`).then(async data => {
            const json = await data.json();
            if (data.status == 200) {
                console.log(json.data.url);
                router.push(json.data.url);
            }
        });
    }, []);

    return (
        <div>
            {error ?
                <p>{error}
                </p> :
                <p>You are being redirected.. {id}</p>}
        </div>
    )
}