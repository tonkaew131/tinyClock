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
function TimerMode(props) {
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
function StopWatchMode(props) {
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

    const [timerStart, setTimerStart] = useState(Date.now() / 1000);
    const [timerSecond, setTimerSecond] = useState(0);
    const [timerStatus, setTimerStatus] = useState(false);

    const [stopwatchStart, setStopwatchStart] = useState(Date.now() / 1000);
    const [stopwatchSecond, setStopwatchSecond] = useState(0);
    const [stopwatchStatus, setstopwatchStatus] = useState(false);
    const [stopwatchEnding, setStopwatchEnding] = useState(false);

    const [stopWatchGoalHour, setStopWatchGoalHour] = useState(0);
    const [stopWatchGoalMinute, setStopWatchGoalMinute] = useState(0);
    const [stopWatchGoalSecond, setStopWatchGoalSecond] = useState(10);

    function switchToTimer() {
        setStopwatchEnding(false);
        setstopwatchStatus(false);

        const goalSecond = (stopWatchGoalHour * 60 * 60) + (stopWatchGoalMinute * 60) + stopWatchGoalSecond;
        setStopwatchSecond(goalSecond);

        return setMode('timer');
    }

    function switchtoStopWatch() {
        setStopwatchEnding(false);
        setTimerStatus(false);

        return setMode('stopwatch');
    }

    function toggleTimer() {
        // From pause to continue
        if (!timerStatus) {
            setTimerStart(Date.now() / 1000);
        }

        return setTimerStatus(!timerStatus);
    }

    function toggleStopwatch() {
        // From pause to continue
        if (!timerStatus) {
            const goalSecond = (stopWatchGoalHour * 60 * 60) + (stopWatchGoalMinute * 60) + stopWatchGoalSecond;

            setStopwatchSecond(goalSecond - 1); // bacause its alraedy started!
            setStopwatchStart(Date.now() / 1000);
            setStopwatchEnding(false);
        }

        return setstopwatchStatus(!stopwatchStatus);
    }

    const intervalId = useRef();
    useEffect(() => {
        console.log('Register Timer!');

        intervalId.current = setInterval(() => {
            if (timerStatus) {
                setTimerSecond((Date.now() / 1000) - timerStart);
            }

            if (stopwatchStatus) {
                const goalSecond = (stopWatchGoalHour * 60 * 60) + (stopWatchGoalMinute * 60) + stopWatchGoalSecond;
                const timeLeft = goalSecond + stopwatchStart - (Date.now() / 1000);

                if (timeLeft > 0) {
                    setStopwatchSecond(timeLeft);
                } else {
                    setStopwatchEnding(true);
                }
            }
        }, 1000);

        return () => {
            console.log('Unregister Timer!');
            clearInterval(intervalId.current);
        };
    }, [timerStatus, stopwatchStatus]);

    return (
        <div className={`w-screen h-screen text-white select-none ${stopwatchEnding ? 'bg-gradient-to-b from-red to-pink' : 'bg-base'}`}>
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
                    <StopWatchMode
                        goalHour={stopWatchGoalHour}
                        goalMinute={stopWatchGoalMinute}
                        goalSecond={stopWatchGoalSecond}
                        second={stopwatchSecond}
                        status={stopwatchStatus}
                        toggleStopwatch={() => toggleStopwatch()}
                        ending={stopwatchEnding}
                    />
            }
        </div >
    );
}