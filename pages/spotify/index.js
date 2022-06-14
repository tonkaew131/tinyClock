import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image'

import styles from './../../styles/spotify.module.css';

export default function Spotify() {
    const [playingState, setPlayingState] = useState(false);

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

            const data = await fetch('/api/spotify/player/get');
            const json = await data.json();

            setSongName(json.data.body.item.name);
            setArtist(json.data.body.item.artists.map(a => a.name).join(', '));

            const albumCoverURL = json.data.body.item.album.images[0]?.url;
            if(!albumCoverURL) albumCoverURL = "/placeholder_record.svg";
            setAlbumCover(albumCoverURL);

            setPlayingState(json.data.body.is_playing);
        };

        fetchData().catch(err => { console.log(err); });
        intervalId.current = setInterval(() => fetchData().catch(err => {
            console.log(err);
        }), 2000);
        // fetchData().catch(console.error());

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


        </div >
    )
}