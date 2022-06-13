import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image'

export default function Spotify() {
    const [playingState, setPlayingState] = useState(false);

    function togglePlayingState() {
        setPlayingState(!playingState);
    };

    const intervalId = useRef();
    useEffect(() => {
        console.log('register Spotify');

        const fetchData = async () => {
            console.log('Spotify API!');

            // const data = await fetch('/api/spotify/player/get');
            // const json = await data.json();

            // console.log(json.data.body.item.name);
        };

        intervalId.current = setInterval(() => fetchData().catch(err => {
            console.log(err);
        }), 3000);
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
                        <div className="ml-14 mt-12 mb-5">
                            <p className="text-lg">SONG_NAME</p>
                            <p className="text-overlay0 text-md">ARTIST</p>
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
                            <div className="w-[55px] h-[55px] bg-text rounded-full flex transition-all hover:cursor-pointer active:bg-overlay2 active:scale-95" onClick={() => togglePlayingState()}>
                                {playingState ?
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
                                            alt="Play"
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
                        src="/placeholder_record.svg"
                        alt="Album cover Image"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            </div>


        </div >
    )
}