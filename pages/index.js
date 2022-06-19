import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head'

import Clock from './clock'
import Calendar from './calendar';
import Spotify from './spotify';
import Weather from './weather';

export default function Home() {
    // const devMode = process.env.APP_ENV == 'development' ? true : false;
    const devMode = false;

    const [page, setPage] = useState(0);
    const pages = [
        <Clock key="Clock" />,
        <Calendar key="Calendar" />,
        <Spotify key="Spotify" />,
        <Weather key="Weather"/>,
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
        console.log('register Swipe handler');

        const handleTouchStart = (event) => {
            if (devMode) console.log('handleTouchStart');
            touchEnd.current = { x: 0, y: 0 };
            touchStart.current = { x: event.targetTouches[0].clientX, y: event.targetTouches[0].clienY };
        };

        const handleTouchMove = (event) => {
            if (devMode) console.log('handleTouchMove')
            touchEnd.current = { x: event.targetTouches[0].clientX, y: event.targetTouches[0].clienY };
        };

        const handleTouchEnd = (event) => {
            if (touchEnd.current.x == 0 && touchEnd.current.y == 0) return;

            const deltaX = touchStart.current.x - touchEnd.current.x;
            if (devMode) console.log(`handleTouchEnd ${deltaX}`);
            const swipeSensitivity = 175;

            if (deltaX > swipeSensitivity) {
                nextPage();
            }

            if (deltaX < (swipeSensitivity * -1)) {
                previousPage();
            }

            touchStart.current = { x: 0, y: 0 };
            touchEnd.current = { x: 0, y: 0 };
        };

        const handleMouseStart = (event) => {
            if (devMode) console.log('handleMouseStart');
            touchStart.current = { x: event.clientX, y: event.clienY };
        };

        const handleMouseMove = (event) => {
            if (devMode) console.log('handleMouseMove');
            touchEnd.current = { x: event.clientX, y: event.clienY };
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
            console.log('unregister Swipe handler');

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
        <div className="touch-manipulation">
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
