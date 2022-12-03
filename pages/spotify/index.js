import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image'

import styles from './../../styles/spotify.module.css';
import MusicLoopIcon from '../../components/MusicLoopIcon';
import MusicShuffleIcon from '../../components/MusicShuffleIcon';
import DeviceIcon from '../../components/DeviceIcon';

import SpotifyQueue from '../../components/SpotifyQueue';

// Component
function ProgressBar(props) {
    const percent = props.percent;
    const progress = props.progress;
    const duration = props.duration;

    return (
        <div className="relative">
            <div className="w-10/12 bg-overlay0 h-[3px] rounded-full m-auto mt-8" />
            <div className="w-10/12 z-10 h-8 rounded-full absolute m-auto ml-10 -top-4 " onClick={(e) => props.handleProgessBar(e)} />
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

            <div className="flex text-subtext1 text-xs mx-10 mt-1">
                <p>{formatMillis(progress)}</p>
                <p className="m-auto mr-0">{formatMillis(duration)}</p>
            </div>
        </div>
    );
}

// Component
function VolumeBar(props) {
    const percent = props.percent;
    const isMute = Math.round(percent) == 0;

    return (
        <div className="flex">
            <div className="relative w-6 h-6 ml-5 hover:cursor-pointer active:scale-95" onClick={() => props.toggleMute()}>
                <Image
                    alt="Volume"
                    src="/music_speaker_icon.svg"
                    layout="fill"
                    objectFit="cover"
                />
            </div>

            {isMute ? <div className="relative hover:cursor-pointer" onClick={() => props.toggleMute()}>
                <div className="w-7 h-[2px] bg-red rounded-full absolute rotate-45 -translate-x-full top-3" />
                <div className="w-7 h-[2px] bg-red rounded-full absolute -rotate-45 -translate-x-full top-3" />
            </div> : undefined}

            <div className="relative m-auto ml-3 mr-0" onClick={(e) => props.changeVolume(e)}>
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

// Component
function AlbumCover(props) {
    return (
        <div className="w-[150px] h-[150px] relative pointer-events-none m-auto mt-6 ml-10">
            <Image
                className="rounded-md"
                src={props.src}
                alt="Album cover Image"
                layout="fill"
                objectFit="cover"
                priority
            />
        </div>
    );
}

// Component
function ErrorHandler(props) {
    return (
        <div className="z-10 backdrop-blur-md w-screen h-screen absolute flex justify-center items-center text-6xl text-center">
            {props.error}
        </div>
    );
}

// Component
function DevicesMenu(props) {
    const devices = props.devices;

    return (
        <div className="absolute bg-mantle w-4/5 h-48 rounded-md z-10 left-[50%] -translate-x-1/2 top-8 font-Roboto border-blue border-2">
            <div className="absolute -bottom-3 right-[48px]">
                <div className="relative w-3 h-3 rotate-180">
                    <Image
                        alt="Up Arrow"
                        src="/triangle_arrow_up.svg"
                        layout="fill"
                        objectFit="cover"
                        className=""
                    />
                </div>
            </div>
            <p className="text-2xl text-center mt-3">Devices</p>
            <div className="bg-blue h-[2px] w-20 rounded-full m-auto mb-1" />

            {devices.map(d => {
                return (
                    <div className={`ml-5 flex ${d.is_active ? 'text-blue' : ''} active:scale-[99%]`} key={d.id} onClick={() => props.changeDevice(d.id)}>
                        <DeviceIcon type={d.type} isActive={d.is_active} />
                        <p className={`ml-3 my-auto ${d.is_active ? 'font-extrabold' : ''} hover:cursor-pointer`}>{d.name}</p>
                    </div>
                );
            })}
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
    const [error, setError] = useState(); // Error displaying

    const [deviceMenu, setDeviceMenu] = useState(false); // Device menu display state
    const [devicesList, setDevicesList] = useState([]); // Devices list

    const [queueMenu, setQueueMenu] = useState(false); // Queue menu display state

    const [playingState, setPlayingState] = useState(false); // Playing state
    const [volume, setVolume] = useState(50); // Volume percentage
    const [muteVolume, setMuteVolume] = useState(50); // Volume percentage while muted

    const [duration, setDuration] = useState(6000000); // Song duration
    const [progress, setProgress] = useState(0); // Playing progress

    const [progressPercent, setProgressPercent] = useState(0); // Playing percentage

    const [shuffle, setShuffle] = useState(false); // Shuffle state
    const [loop, setLoop] = useState('off'); // Loop state

    const [songName, setSongName] = useState('Nothing playing'); // Song name
    const [artist, setArtist] = useState('Artist'); // Artist name
    const [albumCover, setAlbumCover] = useState('/placeholder_record.svg'); // Album cover Image

    function togglePlayingState() {
        const state = playingState ? 'pause' : 'play';

        fetch('/api/spotify/player/update', {
            body: JSON.stringify({ methods: [{ type: state }] }),
            method: 'POST',
        });
    }

    function skipToNext() {
        fetch('/api/spotify/player/update', {
            body: JSON.stringify({ methods: [{ type: 'skip_to_next' }] }),
            method: 'POST',
        });
    }

    function skipToPrevious() {
        fetch('/api/spotify/player/update', {
            body: JSON.stringify({ methods: [{ type: 'skip_to_previous' }] }),
            method: 'POST',
        });
    }

    function toggleLoop() {
        // off, context, track
        var state = '';

        if (loop == 'off') state = 'context';
        else if (loop == 'context') state = 'track';
        else state = 'off';

        fetch('/api/spotify/player/update', {
            body: JSON.stringify({ methods: [{ type: 'set_repeat', value: state }] }),
            method: 'POST',
        });
    }

    function toggleShuffle() {
        fetch('/api/spotify/player/update', {
            body: JSON.stringify({ methods: [{ type: 'set_shuffle', value: !shuffle }] }),
            method: 'POST',
        });
    }

    function handleVolumeBar(e) {
        const percent = (e.clientX - e.currentTarget.offsetLeft) / e.currentTarget.offsetWidth * 100;
        setVolume(percent);

        fetch('/api/spotify/player/update', {
            body: JSON.stringify({ methods: [{ type: 'set_volume', value: percent }] }),
            method: 'POST',
        });
    }

    function toggleMute() {
        const _volume = Math.round(volume);
        if (_volume == 0) {
            // unmute
            setVolume(muteVolume);

            fetch('/api/spotify/player/update', {
                body: JSON.stringify({ methods: [{ type: 'set_volume', value: muteVolume }] }),
                method: 'POST',
            });
        } else {
            // mute
            setMuteVolume(volume);
            setVolume(0);

            fetch('/api/spotify/player/update', {
                body: JSON.stringify({ methods: [{ type: 'set_volume', value: 0 }] }),
                method: 'POST',
            });
        }
    }

    function handleProgessBar(e) {
        const ms = (e.clientX - e.currentTarget.offsetLeft) / e.currentTarget.offsetWidth * duration;

        fetch('/api/spotify/player/update', {
            body: JSON.stringify({ methods: [{ type: 'seek_position', value: ms }] }),
            method: 'POST',
        });
    }

    function toggleDeviceMenu() {
        if (!deviceMenu) {
            fetch('/api/spotify/player/getdevices')
                .then((res) => res.json())
                .then((data) => {
                    setDeviceMenu(!deviceMenu);
                    setDevicesList(data.data);
                });
            return;
        }

        setDeviceMenu(!deviceMenu);
    }

    function changeDevice(id) {
        fetch('/api/spotify/player/update', {
            body: JSON.stringify({ methods: [{ type: 'change_device', value: id }] }),
            method: 'POST',
        });

        setDeviceMenu(false);
    }

    function toggleQueueMenu() {
        setQueueMenu(!queueMenu);
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

            if ('error' in json) {
                // setError(json.error.message);
                return console.error(json.error);
            }

            if (data.status == 302) {
                clearInterval(intervalId.current);
                setError('Please Setup Token');
                return console.log(json.data?.url);
            }

            setError();
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
        <div className="w-screen h-screen text-text font-Roboto select-none bg-gradient-to-br from-surface0 to-base">
            {error ? <ErrorHandler error={error} /> : undefined}
            {deviceMenu ? <DevicesMenu devices={devicesList} changeDevice={(id) => changeDevice(id)} /> : undefined}

            <div className="flex">
                <AlbumCover src={albumCover} />

                <div className="flex w-3/5">
                    <div className="w-full">
                        <div className="ml-5 mr-3 mt-7 mb-6 overflow-clip w-[200px]">
                            <p className={`${false ? styles.scroll : ''} text-2xl truncate`}>{songName}</p>
                            <p className={`${false ? styles.scroll : ''} text-overlay0 text-md truncate`}>{artist}</p>
                        </div>

                        <div className="flex">
                            <div onClick={() => skipToPrevious()} className="w-[25px] h-[25px] relative m-auto mr-9 transition-all hover:cursor-pointer active:scale-90">
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
                            <div onClick={() => skipToNext()} className="w-[25px] h-[25px] relative m-auto ml-9 rotate-180 transition-all hover:cursor-pointer active:scale-90">
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

            <ProgressBar
                percent={progressPercent}
                progress={progress}
                duration={duration}
                handleProgessBar={(e) => handleProgessBar(e)}
            />

            <div className="flex mt-5 ml-[72px]">
                <div className="relative hover:cursor-pointer active:scale-95" onClick={() => toggleShuffle()}>
                    <div className="w-6 h-6 relative">
                        <MusicShuffleIcon className={shuffle ? "fill-blue" : ""} />
                    </div>
                    {shuffle ?
                        <div className="w-[5px] h-[5px] rounded-full bg-blue absolute -bottom-1 left-1/2 -translate-x-1/2" />
                        : undefined
                    }
                </div>

                <VolumeBar
                    percent={volume}
                    changeVolume={(e) => handleVolumeBar(e)}
                    toggleMute={() => toggleMute()}
                />

                <div className="relative ml-5 hover:cursor-pointer active:scale-95" onClick={() => toggleLoop()}>
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

                <div className="relative w-7 h-7 ml-5 hover:cursor-pointer active:scale-95" onClick={() => toggleDeviceMenu()}>
                    <Image
                        className=""
                        alt="Queue"
                        src="/music_device_icon.svg"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            </div>

            <div className="absolute right-5 top-5 hover:cursor-pointer active:scale-95" onClick={() => toggleQueueMenu()}>
                <div className="relative w-7 h-7">
                    <Image
                        alt="Queue"
                        src="/music_queue_icon.svg"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            </div>
            {queueMenu ? <SpotifyQueue toggleQueueMenu={toggleQueueMenu}/> : undefined}
        </div>
    )
}