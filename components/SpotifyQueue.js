import Image from 'next/image';

// Card component
function songCard(props) {
    return (
        <div>

        </div>
    );
}

export default function SpotifyQueue(props) {
    return (
        <div className="absolute top-0 left-0 w-screen h-screen bg-gradient-to-br from-surface0 to-base">
            <div className="absolute right-5 top-5 hover:cursor-pointer active:scale-95" onClick={() => props.toggleQueueMenu()}>
                <div className="relative w-7 h-7">
                    <Image
                        alt="Queue"
                        src="/music_queue_icon.svg"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            </div>

            <p className="text-4xl text-center mt-3 font-Kanit">Queue</p>
        </div>
    );
}