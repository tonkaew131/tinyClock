import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';


export default function Spotify() {
    const { asPath } = useRouter();
    const [response, setResponse] = useState({});

    useEffect(() => {
        const hash = asPath.split('#')[1].split('&');
        let params = {};

        for (let i = 0; i < hash.length; i++) {
            let index = hash[i].indexOf('=');
            let key = hash[i].slice(0, index);
            let value = hash[i].slice(index + 1);

            params[key] = value;
        }

        const fetchData = async () => {
            const data = await fetch('/api/callback/spotify', {
                body: JSON.stringify(params),
                method: 'POST',
            });
            const json = await data.json();

            setResponse(json);
        };

        fetchData().catch(console.error());
    }, [asPath]);

    return (<p>{JSON.stringify(response)}</p>);
}