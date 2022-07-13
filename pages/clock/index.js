import React, { useState, useEffect, useRef } from 'react';

function zeroPad(num, size) {
    return num.toString().padStart(size, '0');
}

function formattedTime() {
    const date = new Date();
    return `${zeroPad(date.getHours(), 2)}:${zeroPad(date.getMinutes(), 2)}`;
}

function formattedDate() {
    const weekDays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const date = new Date();
    let str = `${weekDays[date.getDay()]}.`;
    str += ` ${months[date.getMonth()]}.`;
    str += ` ${zeroPad(date.getDate(), 2)}/${zeroPad(date.getMonth() + 1, 2)}`;
    str += ` ${date.getFullYear()}`;

    return str;
}

function getCurrentSecond() {
    const date = new Date();
    return zeroPad(date.getSeconds(), 2);
}

export default function Clock() {
    const [time, setTime] = useState(formattedTime());
    const [date, setDate] = useState(formattedDate());
    const [second, setSecond] = useState(getCurrentSecond());

    const intervalId = useRef();
    useEffect(() => {
        console.log('register Clock');

        intervalId.current = setInterval(() => {
            setTime(formattedTime()); // Update Time
            setDate(formattedDate()); // Update Date
            setSecond(getCurrentSecond()); // Update Second
        }, 1000);

        return () => {
            clearInterval(intervalId.current);
            console.log('unregister Clock');
        };
    }, []);

    return (
        <div className="bg-base text-text w-screen h-screen flex justify-center items-center select-none pointer-events-none">
            <div className="text-center leading-none mb-4">
                <p className="text-[170px] font-Oswald">{time}</p>
                <p className="font-Oswald text-3xl absolute right-7 top-[55%]">{second}</p>
                {/* <p className="text-[175px] font-Oswald">{time}</p> */}
                <div className="h-[3px] w-[70vw] bg-sapphire rounded-full mx-auto my-3" />
                <p className="text-[30px] font-Kanit">{date}</p>
            </div>
        </div>
    );
};
