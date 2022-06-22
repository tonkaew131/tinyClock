import WeatherIcon from '../../components/WeatherIcon';

function DailyCard(props) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let index = props.today + props.offset;
    index = index % 7;

    return (
        <div className="w-[14.28571429%] text-center">
            <p className="font-Kanit text-2xl">{days[index]}</p>
            <WeatherIcon className="w-12 h-12 m-auto mt-2" type="sunny" />
            <p className="mt-2">00 °C</p>
            <p className="text-overlay1">00 °C</p>
        </div>
    );
}

export default function Weather() {
    return (
        <div className="h-screen w-screen bg-base text-text font-Oswald select-none">
            <div className="flex ml-4 pt-4 items-center">
                <WeatherIcon className="w-16 h-16" type="sunny" />
                <p className="text-5xl ml-3">00 °C</p>
                <p className="text-2xl m-auto mr-4 mt-0">บางรักใหญ่, TH</p>
            </div>

            <div className="flex w-full h-[75px] items-center">
                <WeatherIcon className="w-8 h-8 mr-2 ml-8" type="humid"/>
                <div className="bg-blue w-[4px] h-[50%] rounded-full"/>
                <p className="text-3xl ml-2 leading-none text-overlay2">00</p>
                <p className="text-overlay2 ml-1 mt-2">mm</p>
                {/* <p className="text-3xl text-right mr-5 w-full">ฝนตกหนัก</p> */}
            </div>

            <div className="flex w-full justify-center absolute bottom-4">
                {[...Array(7)].map((e, i) => {
                    let today = new Date().getDay();

                    return (
                        <DailyCard key={i} offset={i} today={today}/>
                    )
                })}
            </div>
        </div>
    );
}