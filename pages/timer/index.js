import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

import TimerIcon from '../../components/TimerIcon';
import StopWatchIcon from '../../components/StopWatchIcon';
import TimerButton from '../../components/TimerButton';

function zeroPad(num, size) {
    return num.toString().padStart(size, '0');
}

function formattedTime(sec) {
    sec = Number(sec ? sec : 0);
    let hour = Math.floor(sec / 3600);
    let minute = Math.floor(sec % 3600 / 60);
    let second = Math.floor(sec % 3600 % 60);

    return `${zeroPad(hour, 2)}:${zeroPad(minute, 2)}:${zeroPad(second, 2)}`;
}

function TimerMode(props) {
    const timerSec = props.second;
    const timerStatus = props.status ? true : false;

    return (
        <div className="mt-12">
            <p className="w-full text-center font-Roboto text-7xl text-text">{formattedTime(timerSec)}</p>
            <div className="w-full flex justify-center mt-5 hover:cursor-pointer" onClick={() => props.toggleTimer()}>
                <TimerButton status={timerStatus} className="mx-auto" />
            </div>
        </div>
    );
}

function StopWatchMode() {
    return (
        <div>
            a
        </div>
    );
}

export default function Timer() {
    const [mode, setMode] = useState('timer'); // timer, stopwatch

    const [timerStart, setTimerStart] = useState(Date.now() / 1000);
    const [timerSecond, setTimerSecond] = useState(0);
    const [timerStatus, setTimerStatus] = useState(false);

    function switchToTimer() {
        return setMode('timer');
    }

    function switchtoStopWatch() {
        setTimerStatus(false);

        return setMode('stopwatch');
    }

    function toggleTimer() {
        // From pause to continue
        if (!timerStatus) {
            setTimerStart(Date.now() / 1000);
        } else {
        }

        return setTimerStatus(!timerStatus);
    }

    const intervalId = useRef();
    useEffect(() => {
        console.log('Register Timer!');

        intervalId.current = setInterval(() => {
            if (timerStatus) setTimerSecond((Date.now() / 1000) - timerStart);
        }, 1000);

        return () => {
            console.log('Unregister Timer!');
            clearInterval(intervalId.current);
        };
    }, [timerStatus]);

    return (
        <div className="w-screen h-screen bg-base text-white select-none">
            <div className="w-full flex items-center pt-5">
                <div className="m-auto mr-9 hover:cursor-pointer" onClick={() => switchToTimer()} >
                    <TimerIcon select={mode == 'timer' ? true : false} />
                </div>

                <div className="m-auto ml-0 hover:cursor-pointer" onClick={() => switchtoStopWatch()} >
                    <StopWatchIcon select={mode == 'stopwatch' ? true : false} />
                </div>
            </div>

            {
                mode == 'timer' ?
                    <TimerMode second={timerSecond} status={timerStatus} toggleTimer={() => toggleTimer()} /> :
                    <StopWatchMode />
            }
        </div >
    );
}