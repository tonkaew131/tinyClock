import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

function formattedMonth() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const date = new Date();
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

function dayItems(events) {
    const date = new Date();
    const firstDay = new Date(date.getTime());
    firstDay.setDate(1);

    const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const daysOffset = firstDay.getDay();

    return (
        <div className="grid grid-cols-7 w-full mt-3">
            {[...Array(daysOffset)].map((e, i) => <div key={i} />)}
            {[...Array(days)].map((e, i) => {
                let day = i + 1;
                let isToday = day == date.getDate();
                return (
                    <div className={`h-[45px] text-[24px] ${isToday ? 'text-crust' : ''} font-Kanit text-center`} key={i}>
                        {day}
                        {isToday ? <div className="rounded-full bg-blue w-full pt-[100%] -mt-[37px]" /> : undefined}
                    </div>
                );
            }
            )}
        </div>
    );
}

function zeroPad(num, size) {
    return num.toString().padStart(size, '0');
}

function formattedDate(date) {
    date = new Date(date);

    let result = zeroPad(date.getDate(), 2);
    result += `/${zeroPad(date.getMonth() + 1, 2)}`;
    result += ` ${zeroPad(date.getHours(), 2)}`;
    result += `:${zeroPad(date.getMinutes(), 2)}`;
    return result;
}

function listEvents(events) {
    if (!events) return (<div className="h-full flex justify-center items-center font-Kanit text-2xl text-subtext0">Loading...</div >);
    if (events.length == 0) return (<div className="h-full flex justify-center items-center font-Kanit text-2xl text-subtext0">No Events</div >);
    const date = new Date();

    let todayEvents = [];
    let tomorrowEvents = [];
    let upcomingEvents = [];
    for (let i = 0; i < events.length; i++) {
        if ('dateTime' in events[i].start) events[i].start.date = new Date(events[i].start.dateTime);
        let eventDate = new Date(events[i].start.date);

        if ((eventDate.getFullYear() == date.getFullYear()) && (eventDate.getMonth() == date.getMonth())) {
            if (eventDate.getDate() == date.getDate()) {
                todayEvents.push(events[i]);
            }

            else if (eventDate.getDate() == (date.getDate() + 1)) {
                tomorrowEvents.push(events[i]);
            }
        } else {
            upcomingEvents.push(events[i]);
        }
    }

    return (
        <div>
            <div className="m-2 font-bold leading-tight font-Kanit">
                {
                    todayEvents.length ? <div>
                        <p>{todayEvents.length} | Today</p>
                        {todayEvents.map((e, i) => (
                            <div key={e.name} className="mb-3">
                                <p className="truncate">- {e.name}</p>
                                <p>{formattedDate(e.start.date)}</p>
                            </div>
                        ))}
                    </div> : undefined
                }
                {
                    tomorrowEvents.length ? <div>
                        <p>{tomorrowEvents.length} | Tomorrow</p>
                        {tomorrowEvents.map((e, i) => (
                            <div key={e.name} className="mb-3">
                                <p className="truncate">- {e.name}</p>
                                <p>{formattedDate(e.start.date)}</p>
                            </div>
                        ))}
                    </div> : undefined
                }
                {
                    upcomingEvents.length ? <div>
                        <p>{upcomingEvents.length} | Upcoming</p>
                        {upcomingEvents.map((e, i) => (
                            <div key={e.name} className="mb-3">
                                <p className="truncate">- {e.name}</p>
                                <p>{formattedDate(e.start.date)}</p>
                            </div>
                        ))}
                    </div> : undefined
                }
            </div>
        </div>
    )
}

export default function Calendar() {
    const [events, setEvents] = useState(null);
    const [redirect, setRedirect] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch('/api/calendar/list');
            const json = await data.json();
            if (data.status == 302) {
                data = await fetch('/api/shortlink/create', {
                    body: JSON.stringify({
                        url: json.data.url
                    }),
                    method: 'POST'
                });
                if (data.status != 200) return setError(true);
                json = await data.json();

                console.log(json.data.url);
                return setRedirect(json.data.url);
            }

            if (data.status == 200) {
                return setEvents(json.data.events);
            }

            console.log(json);
            return setError(true);
        };

        fetchData().catch(console.error());
    }, []);

    return (
        <div className="select-none">
            <div className={`${redirect ? 'blur bg-slate-400' : ''} transition-all bg-base text-text w-screen h-screen flex`}>
                <div className="w-3/5">
                    <div className="m-3 border-2 border-overlay2 rounded-sm w-[calc(100%-12px)] h-[calc(100%-24px)] mr-0">
                        <div className="font-Kanit text-center text-[25px]">{formattedMonth()}</div>
                        <div className="mx-auto h-[2px] bg-overlay2 w-[95%]" />
                        {dayItems(events)}
                    </div>
                </div>
                <div className="w-2/5">
                    <div className="m-3 border-2 border-overlay2 rounded-sm w-[calc(100%-24px)] h-[calc(100%-24px)]">
                        {listEvents(events)}
                    </div>
                </div>
            </div>

            <div className={`absolute top-0 left-0 z-10 h-screen w-screen ${redirect ? 'opacity-100' : 'opacity-0'}`}>
                <a href={redirect}>
                    <QRCode className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" value={redirect} />
                </a>
            </div>
        </div >
    )
}