import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head'

import Clock from './clock'
import Calendar from './calendar';
import Spotify from './spotify';

export default function Home() {
    // const devMode = process.env.APP_ENV == 'development' ? true : false;
    const devMode = false;

    const [page, setPage] = useState(0);
    const pages = [
        <Clock key="Clock" />,
        <Calendar key="Calendar" />,
        <Spotify key="Spotify" />,
    ];

    function nextPage() {
        if (devMode) console.log('nextPage', page);

        if (page >= (pages.length - 1)) return setPage(0);
        return setPage(page + 1);
    }

    function previousPage() {
        if (devMode) console.log('previousPage', page);

        if (page == 0) return setPage(pages.length - 1);
        return setPage(page - 1);
    }

    // Handle Swipe
    const touchStart = useRef({ x: 0, y: 0 });
    const touchEnd = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (devMode) console.log('register');

        const handleTouchStart = (event) => {
            if (devMode) console.log('handleTouchStart');
            touchStart = { x: event.targetTouches[0].clientX, y: event.targetTouches[0].clienY };
        };

        const handleTouchMove = (event) => {
            if (devMode) console.log('handleTouchMove');
            touchEnd = { x: event.targetTouches[0].clientX, y: event.targetTouches[0].clienY };
        };

        const handleTouchEnd = (event) => {
            if (devMode) console.log(`handleTouchEnd ${touchStart.x - touchEnd.x}`);
            const swipeSensitivity = 200;

            if (touchStart.x - touchEnd.x > swipeSensitivity) {
                nextPage();
            }

            if (touchStart.x - touchEnd.x < (swipeSensitivity * -1)) {
                previousPage();
            }
        };

        const handleMouseStart = (event) => {
            if (devMode) console.log('handleMouseStart');
            touchStart = { x: event.clientX, y: event.clienY };
        };

        const handleMouseMove = (event) => {
            if (devMode) console.log('handleMouseMove');
            touchEnd = { x: event.clientX, y: event.clienY };
        };

        // For Mobile
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);

        // For Desktop
        window.addEventListener('mousedown', handleMouseStart);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleTouchEnd);

        return () => {
            if (devMode) console.log('unregister');

            // For Mobile
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);

            // For Desktop
            window.removeEventListener('mousedown', handleMouseStart);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleTouchEnd);
        };
    }, [page]);

    return (
        <div className="pointer-events-none">
            <Head>
                <title>tinyClock</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            {/* <div className="z-50 h-screen w-screen absolute flex">
                <div className="w-1/3 h-full ml-0 mx-auto" onClick={() => previousPage()} />
                <div className="w-1/3 h-full mr-0" onClick={() => nextPage()} />
            </div> */}

            {pages[page]}
        </div>
    )
};
