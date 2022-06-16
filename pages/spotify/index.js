import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image'

import styles from './../../styles/spotify.module.css';

function progressBar(percent) {
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

    const [duration, setDuration] = useState(6000000);
    const [progress, setProgress] = useState(0);

    const [progressPercent, setProgressPercent] = useState(0);

    const [songName, setSongName] = useState('Nothing playing');
    const [artist, setArtist] = useState('Artist');
    const [albumCover, setAlbumCover] = useState('/placeholder_record.svg');

    function togglePlayingState() {
        setPlayingState(!playingState);
    };

    const intervalId = useRef();
    useEffect(() => {
        console.log('register Spotify');

        const fetchData = async () => {
            console.log('Spotify API!');

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

            if ('error' in json) return console.log(json.error);

            setSongName(json.data?.body?.item?.name || 'Nothing playing');
            setArtist((json.data?.body?.item?.artists || [{ name: 'Artist' }]).map(a => a.name).join(', '));

            setAlbumCover(json.data?.body?.item?.album?.images[0]?.url || '/placeholder_record.svg');
            setPlayingState(json.data.body?.is_playing || false);

            const _progress = json.data?.body?.progress_ms || 0;
            const _duration = json.data?.body?.item?.duration_ms || 6000000;
            const percent = _progress / _duration * 100;
            setProgressPercent(percent);
            setProgress(_progress);
            setDuration(_duration);
        };

        fetchData().catch(err => { console.log(err); });
        intervalId.current = setInterval(() => fetchData().catch(err => {
            console.log(err);
        }), 1500);

        return () => {
            clearInterval(intervalId.current);
        };
    }, []);

    return (
        <div className="bg-base w-screen h-screen text-text font-Roboto select-none">
            <div className="flex">
                <div className="flex w-3/5">
                    <div className="w-full">
                        <div className="ml-11 mr-3 mt-10 mb-7 overflow-clip">
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
                <div className="w-[150px] h-[150px] relative pointer-events-none m-auto mt-8 mr-8">
                    <Image
                        className="rounded-md"
                        src={albumCover}
                        alt="Album cover Image"
                        layout="fill"
                        objectFit="cover"
                        priority
                    />
                </div>
            </div>
            {progressBar(progressPercent)}
            {/* <div className="relative">
                <div className="w-10/12 bg-overlay0 h-[3px] rounded-full m-auto mt-9" />
                <div className="w-[10px] h-[10px] rounded-full bg-white absolute left-[34px] top-[-4px] transition-all duration-[3000ms]" />
            </div> */}
            <div className="flex text-subtext1 text-xs mx-10 mt-1">
                <p>{formatMillis(progress)}</p>
                <p className="m-auto mr-0">{formatMillis(duration)}</p>
            </div>
            <div className="flex mt-5">
                <div className="w-7 h-7 relative ml-10 ">
                    <Image
                        alt="Shuffle"
                        src="/music_shuffle_icon.svg"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
                <div className="w-7 h-7 relative ml-5">
                    <Image
                        alt="Loop"
                        src="/music_loop_icon.svg"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            </div>
        </div >
    )
}