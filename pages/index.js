import React, { useState } from 'react';
import Head from 'next/head'

import Clock from './clock'
import Calendar from './calendar';
import Spotify from './spotify';

export default function Home() {
    const [page, setPage] = useState(0);
    const pages = [
        <Clock key="Clock" />,
        <Calendar key="Calendar" />,
        <Spotify key="Spotify" />,
    ];

    function nextPage() {
        if (page >= (pages.length - 1)) return setPage(0);
        return setPage(page + 1);
    }

    function previousPage() {
        if (page == 0) return setPage(pages.length - 1);
        return setPage(page - 1);
    }

    return (
        <div>
            <Head>
                <title>tinyClock</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <div className="z-50 h-screen w-screen absolute flex">
                <div className="w-1/3 h-full ml-0 mx-auto" onClick={() => previousPage()} />
                <div className="w-1/3 h-full mr-0" onClick={() => nextPage()} />
            </div>

            {pages[page]}
        </div>
    )
};
