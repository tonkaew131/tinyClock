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
    const hour = Math.floor(sec / 3600);
    const minute = Math.floor(sec % 3600 / 60);
    const second = Math.floor(sec % 3600 % 60);

    return `${zeroPad(hour, 2)}:${zeroPad(minute, 2)}:${zeroPad(second, 2)}`;
}

// Component, This is actually Stop Watch ahahaha
function StopwatchMode(props) {
    const timerSec = props.second;
    const timerStatus = props.status ? true : false;

    return (
        <div className="mt-12 font-Roboto">
            <p className="w-full text-center text-7xl text-text">{formattedTime(timerSec)}</p>
            <div className="w-full flex justify-center mt-5 hover:cursor-pointer" onClick={() => props.toggleTimer()}>
                <TimerButton status={timerStatus} className="mx-auto" />
            </div>
        </div>
    );
}

// Component, Now this is timer
function TimerMode(props) {
    const status = props.status ? true : false;

    const sec = props.second;
    const hour = Math.floor(sec / 3600);
    const minute = Math.floor(sec % 3600 / 60);
    const second = Math.floor(sec % 3600 % 60);

    return (
        <div className="mt-9 font-Roboto">
            <div className="flex text-5xl text-overlay1 justify-center" style={{ opacity: status ? 0 : 1 }}>
                <p className="">{zeroPad(props.goalHour == 0 ? 23 : props.goalHour - 1, 2)}</p>
                <p className="ml-[45px]">{zeroPad(props.goalMinute == 0 ? 59 : props.goalMinute - 1, 2)}</p>
                <p className="ml-[45px]">{zeroPad(props.goalSecond == 0 ? 59 : props.goalSecond - 1, 2)}</p>
            </div>
            <p className={`w-full text-center text-7xl ${props.ending ? 'text-surface0' : 'text-text'}`} onClick={() => props.toggleStopwatch()}>{
                status ? `${zeroPad(hour, 2)}:${zeroPad(minute, 2)}:${zeroPad(second, 2)}`
                    : `${zeroPad(props.goalHour, 2)}:${zeroPad(props.goalMinute, 2)}:${zeroPad(props.goalSecond, 2)}`
            }</p>
            <div className="flex text-5xl text-overlay1 justify-center" style={{ opacity: status ? 0 : 1 }}>
                <p className="">{zeroPad(props.goalHour + 1, 2)}</p>
                <p className="ml-[45px]">{zeroPad(props.goalMinute == 59 ? 0 : props.goalMinute + 1, 2)}</p>
                <p className="ml-[45px]">{zeroPad(props.goalSecond == 59 ? 0 : props.goalSecond + 1, 2)}</p>
            </div>
        </div>
    );
}

export default function Timer() {
    const [mode, setMode] = useState('stopwatch'); // timer, stopwatch

    const [stopwatchStart, setStopwatchStart] = useState(Date.now() / 1000);
    const [stopwatchSecond, setStopwatchSecond] = useState(0);
    const [stopwatchStatus, setStopwatchStatus] = useState(false);

    const [timerStart, setTimerStart] = useState(Date.now() / 1000);
    const [timerSecond, setTimerSecond] = useState(0);
    const [timerStatus, setTimerStatus] = useState(false);
    const [timerEnding, setTimerEnding] = useState(false);

    const [timerGoalHour, setTimerGoalHour] = useState(0);
    const [timerGoalMinute, setTimerGoalMinute] = useState(0);
    const [timerGoalSecond, setTimerGoalSecond] = useState(10);

    function switchToTimer() {
        setTimerEnding(false);
        setTimerStatus(false);

        const goalSecond = (timerGoalHour * 60 * 60) + (timerGoalMinute * 60) + timerGoalSecond;
        setTimerSecond(goalSecond);

        return setMode('timer');
    }

    function switchtoStopWatch() {
        setTimerEnding(false);
        setStopwatchStatus(false);

        return setMode('stopwatch');
    }

    function toggleStopwatch() {
        // From pause to continue
        if (!stopwatchStatus) {
            setStopwatchStart(Date.now() / 1000);
        }

        return setStopwatchStatus(!stopwatchStatus);
    }

    function toggleTimer() {
        // From pause to continue
        if (!timerStatus) {
            const goalSecond = (timerGoalHour * 60 * 60) + (timerGoalMinute * 60) + timerGoalSecond;

            setTimerSecond(goalSecond - 1); // bacause its alraedy started!
            setTimerStart(Date.now() / 1000);
            setTimerEnding(false);
        }

        return setTimerStatus(!timerStatus);
    }

    const intervalId = useRef();
    useEffect(() => {
        console.log('Register Timer!');

        intervalId.current = setInterval(() => {
            if (stopwatchStatus) {
                setStopwatchSecond((Date.now() / 1000) - stopwatchStart);
            }

            if (timerStatus) {
                const goalSecond = (timerGoalHour * 60 * 60) + (timerGoalMinute * 60) + timerGoalSecond;
                const timeLeft = goalSecond + timerStart - (Date.now() / 1000);

                if (timeLeft > 0) {
                    setTimerSecond(timeLeft);
                } else {
                    setTimerEnding(true);
                }
            }
        }, 1000);

        return () => {
            console.log('Unregister Timer!');
            clearInterval(intervalId.current);
        };
    }, [stopwatchStatus, timerStatus]);

    return (
        <div className={`w-screen h-screen text-white select-none ${timerEnding ? 'bg-gradient-to-b from-red to-pink' : 'bg-base'}`}>
            <div className="w-full flex items-center pt-5">
                <div className="m-auto mr-9 hover:cursor-pointer" onClick={() => switchToTimer()} >
                    <TimerIcon select={mode == 'timer' ? true : false} />
                </div>

                <div className="m-auto ml-0 hover:cursor-pointer" onClick={() => switchtoStopWatch()} >
                    <StopWatchIcon select={mode == 'stopwatch' ? true : false} />
                </div>
            </div>

            {
                mode == 'stopwatch' ?
                    <TimerMode
                        goalHour={timerGoalHour}
                        goalMinute={timerGoalMinute}
                        goalSecond={timerGoalSecond}
                        second={timerSecond}
                        status={timerStatus}
                        toggleStopwatch={() => toggleTimer()}
                        ending={timerEnding}
                    /> :
                    <StopwatchMode second={stopwatchSecond} status={stopwatchStatus} toggleTimer={() => toggleStopwatch()} />
            }
        </div >
    );
}