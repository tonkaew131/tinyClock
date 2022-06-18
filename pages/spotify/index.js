import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image'

import styles from './../../styles/spotify.module.css';
import MusicLoopIcon from '../../components/MusicLoopIcon';
import MusicShuffleIcon from '../../components/MusicShuffleIcon';

function ProgressBar(props) {
    const percent = props.percent;

    return (
        <div className="relative">
            <div className="w-10/12 bg-overlay0 h-[3px] rounded-full m-auto mt-8" />
            <div
                style={{
                    marginLeft: `${(10 / 12) * percent}%`,
                }}
                className="w-[10px] h-[10px] rounded-full bg-white absolute left-[34px] top-[-4px] ease-linear transition-all"
            />
            <div
                style={{
                    width: `${10 / 12 * percent}%`
                }}
                className="bg-white h-[3px] rounded-full m-auto ml-10 top-0 absolute ease-linear transition-all"
            />
        </div>
    );
}

function VolumeBar(props) {
    const percent = props.percent;

    return (
        <div className="flex">
            <div className="relative w-6 h-6 ml-5">
                <Image
                    alt="Volume"
                    src="/music_speaker_icon.svg"
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <div className="relative m-auto ml-3 mr-0">
                <div className="bg-overlay0 h-[6px] w-[148px] rounded-full" />
                <div
                    className="bg-blue absolute h-[6px] w-[148px] rounded-full top-1/2 -translate-y-1/2"
                    style={{
                        width: `${percent / 100 * 148}px`
                    }}
                />
            </div>
        </div>
    );
}

function zeroPad(num, size) {
    return num.toString().padStart(size, '0');
}

function formatMillis(ms) {
    let second = zeroPad(Math.round((ms / 1000) % 60, 2), 2);
    let minute = Math.floor((ms / 1000) / 60);
    return `${minute}:${second}`;
}

export default function Spotify() {
    const [playingState, setPlayingState] = useState(false);
    const [volume, setVolume] = useState(50);

    const [duration, setDuration] = useState(6000000);
    const [progress, setProgress] = useState(0);

    const [progressPercent, setProgressPercent] = useState(0);

    const [shuffle, setShuffle] = useState(false);
    const [loop, setLoop] = useState('off');

    const [songName, setSongName] = useState('Nothing playing');
    const [artist, setArtist] = useState('Artist');
    const [albumCover, setAlbumCover] = useState('/placeholder_record.svg');

    function togglePlayingState() {
        setPlayingState(!playingState);
    };

    function toggleLoop() {
        if (loop == 'off') return setLoop('context');
        if (loop == 'context') return setLoop('track');
        return setLoop('off');
    };

    function toggleShuffle() {
        setShuffle(!shuffle);
    }

    const intervalId = useRef();
    useEffect(() => {
        console.log('register Spotify');

        const fetchData = async () => {
            // console.count('Spotify API!');

            try {
                var data = await fetch('/api/spotify/player/get');
                var json = await data.json();
            } catch (error) {
                setSongName('Nothing playing');
                setArtist('Artist');
                setAlbumCover('/placeholder_record.svg');
                setPlayingState(false);
                setProgressPercent(0);
                return;
            }

            if ('error' in json) return console.error(json.error);

            // context, track, off (json.data.body.repeat_state)
            // true, false (json.data.body.shuffle_state)
            setLoop(json.data?.body?.repeat_state || 'off');
            setShuffle(json.data?.body?.shuffle_state || false);

            setSongName(json.data?.body?.item?.name || 'Nothing playing');
            setArtist((json.data?.body?.item?.artists || [{ name: 'Artist' }]).map(a => a.name).join(', '));

            setAlbumCover(json.data?.body?.item?.album?.images[0]?.url || '/placeholder_record.svg');
            setPlayingState(json.data?.body?.is_playing || false);
            setVolume(json.data?.body?.device?.volume_percent || 0);

            const _progress = json.data?.body?.progress_ms || 0;
            const _duration = json.data?.body?.item?.duration_ms || 6000000;
            const percent = _progress / _duration * 100;
            setProgressPercent(percent);
            setProgress(_progress);
            setDuration(_duration);
        };

        fetchData().catch(err => { console.error(err); });
        intervalId.current = setInterval(() => fetchData().catch(err => {
            console.log(err);
        }), 1500);

        return () => {
            // console.countReset('Spotify API!');
            clearInterval(intervalId.current);
        };
    }, []);

    return (
        <div className=" w-screen h-screen text-text font-Roboto select-none bg-gradient-to-br from-surface0 to-base">
            <div className="flex">
                <div className="w-[150px] h-[150px] relative pointer-events-none m-auto mt-6 ml-10">
                    <Image
                        className="rounded-md"
                        src={albumCover}
                        alt="Album cover Image"
                        layout="fill"
                        objectFit="cover"
                        priority
                    />
                </div>

                <div className="flex w-3/5">
                    <div className="w-full">
                        <div className="ml-5 mr-3 mt-7 mb-6 overflow-clip w-[200px]">
                            <p className={`${false ? styles.scroll : ''} text-2xl truncate`}>{songName}</p>
                            <p className={`${false ? styles.scroll : ''} text-overlay0 text-md truncate`}>{artist}</p>
                        </div>
                        <div className="flex">
                            <div className="w-[25px] h-[25px] relative m-auto mr-9 transition-all hover:cursor-pointer active:scale-90">
                                <Image
                                    className="fill-text"
                                    src="/music_previous_icon.svg"
                                    layout="fill"
                                    objectFit="cover"
                                    alt="Previous"
                                />
                            </div>
                            <div className="w-[55px] h-[55px] bg-text rounded-full flex hover:cursor-pointer active:bg-overlay2 active:scale-95" onClick={() => togglePlayingState()}>
                                {!playingState ?
                                    <div className="w-[22px] h-[22px] relative m-auto translate-x-[1px] pointer-events-none">
                                        <Image
                                            className=""
                                            src="/music_play_icon.svg"
                                            layout="fill"
                                            objectFit="cover"
                                            alt="Play"
                                        />
                                    </div> :
                                    <div className="w-[25px] h-[25px] relative m-auto pointer-events-none">
                                        <Image
                                            className=""
                                            src="/music_pause_icon.svg"
                                            layout="fill"
                                            objectFit="cover"
                                            alt="Pause"
                                        />
                                    </div>
                                }
                            </div>
                            <div className="w-[25px] h-[25px] relative m-auto ml-9 rotate-180 transition-all hover:cursor-pointer active:scale-90">
                                <Image
                                    className="fill-text"
                                    src="/music_previous_icon.svg"
                                    layout="fill"
                                    objectFit="cover"
                                    alt="Next"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ProgressBar percent={progressPercent} />

            {/* <div className="relative">
                <div className="w-10/12 bg-overlay0 h-[3px] rounded-full m-auto mt-9" />
                <div className="w-[10px] h-[10px] rounded-full bg-white absolute left-[34px] top-[-4px] transition-all duration-[3000ms]" />
            </div> */}
            <div className="flex text-subtext1 text-xs mx-10 mt-1">
                <p>{formatMillis(progress)}</p>
                <p className="m-auto mr-0">{formatMillis(duration)}</p>
            </div>
            <div className="flex mt-5 ml-[72px]">
                <div className="relative" onClick={() => toggleShuffle()}>
                    <div className="w-6 h-6 relative">
                        <MusicShuffleIcon className={shuffle ? "fill-blue" : ""} />
                    </div>
                    {shuffle ?
                        <div className="w-[5px] h-[5px] rounded-full bg-blue absolute -bottom-1 left-1/2 -translate-x-1/2" />
                        : undefined
                    }
                </div>

                <VolumeBar percent={volume} />

                <div className="relative ml-5" onClick={() => toggleLoop()}>
                    <div className="w-[22px] h-[22px] relative">
                        <MusicLoopIcon className={loop != 'off' ? "fill-blue" : ""} />
                    </div>
                    {loop != 'off' ?
                        <div className="w-[5px] h-[5px] rounded-full bg-blue absolute -bottom-1 left-1/2 -translate-x-1/2" />
                        : undefined
                    }
                    {loop == 'track' ?
                        <p className="absolute -top-[4px] left-1/2 -translate-x-1/2 text-blue bg-base leading-none">1</p>
                        : undefined
                    }
                </div>

                <div className="relative w-7 h-7 ml-5">
                    <Image
                        className=""
                        alt="Queue"
                        src="/music_device_icon.svg"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            </div>

            <div className="absolute right-5 top-5">
                <div className="relative w-7 h-7">
                    <Image
                        alt="Queue"
                        src="/music_queue_icon.svg"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>

            </div>
        </div>
    )
}