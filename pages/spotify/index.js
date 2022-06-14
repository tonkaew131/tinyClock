import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image'

import styles from './../../styles/spotify.module.css';

function progressBar(percent) {
    return (
        <div className="relative">
            <div className="w-10/12 bg-overlay0 h-[3px] rounded-full m-auto mt-9" />
            <div
                style={{
                    marginLeft: `${(10 / 12) * percent}%`,
                }}
                className="w-[10px] h-[10px] rounded-full bg-white absolute left-[34px] top-[-4px] ease-linear transition-all"
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

    const [songName, setSongName] = useState('SONG_NAME');
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
                setSongName('SONG_NAME');
                setArtist('Artist');
                setAlbumCover('/placeholder_record.svg');
                setPlayingState(false);
                setProgressPercent(0);
                return;
            }

            setSongName(json.data.body.item.name);
            setArtist(json.data.body.item.artists.map(a => a.name).join(', '));

            const albumCoverURL = json.data.body.item.album.images[0]?.url;
            if (!albumCoverURL) albumCoverURL = '/placeholder_record.svg';
            setAlbumCover(albumCoverURL);

            setPlayingState(json.data.body.is_playing);

            const _progress = json.data.body.progress_ms;
            const _duration = json.data.body.item.duration_ms;
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
                        <div className="ml-10 mr-3 mt-11 mb-7 overflow-clip">
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
                <div className="w-[150px] h-[150px] relative pointer-events-none m-auto mt-10 mr-10">
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
        </div >
    )
}