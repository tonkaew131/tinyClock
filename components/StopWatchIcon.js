export default function StopwatchIcon(props) {
    const isSelected = props.select ? true : false;

    return (
        <div>
            <svg fill={isSelected ? "#89b4fa": "#cdd6f4"} width="50px" height="50px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 101.5 122.88">
                <g>
                    <path d="M56.83,21.74c11.58,1.38,21.96,6.67,29.8,14.5c9.18,9.18,14.86,21.87,14.86,35.88c0,14.01-5.68,26.7-14.86,35.89 s-21.87,14.87-35.89,14.87c-14.01,0-26.7-5.68-35.88-14.87C5.68,98.83,0,86.14,0,72.13c0-14.01,5.68-26.7,14.86-35.88 c8.41-8.41,19.77-13.89,32.38-14.75v-8.51c0-0.13,0.01-0.26,0.02-0.38l-9.51,0c-1.56,0-2.83-1.28-2.83-2.83V2.83 C34.92,1.28,36.2,0,37.76,0h28.57c1.56,0,2.84,1.28,2.84,2.83v6.94c0,1.56-1.28,2.83-2.84,2.83h-9.51 c0.01,0.13,0.02,0.25,0.02,0.38V21.74L56.83,21.74L56.83,21.74z M54.82,64.55c2.7,1.45,4.53,4.3,4.53,7.58 c0,4.75-3.85,8.61-8.61,8.61c-4.75,0-8.61-3.85-8.61-8.61c0-3.28,1.84-6.13,4.53-7.58l0-19.72c0-2.25,1.82-4.08,4.07-4.08 c2.25,0,4.08,1.82,4.08,4.08L54.82,64.55L54.82,64.55L54.82,64.55z M96.33,37.07c1.97-4.7,1.74-9.63-1.08-12.92 c-3.38-3.96-9.5-4.41-15.17-1.63C86.08,26.65,91.54,31.45,96.33,37.07L96.33,37.07L96.33,37.07z M5.17,37.07 c-1.97-4.7-1.74-9.63,1.08-12.92c3.38-3.96,9.5-4.41,15.18-1.63C15.41,26.65,9.95,31.45,5.17,37.07L5.17,37.07L5.17,37.07z M80.87,42.01c-7.71-7.71-18.36-12.48-30.12-12.48c-11.76,0-22.41,4.77-30.12,12.48C12.92,49.72,8.15,60.37,8.15,72.13 c0,11.76,4.77,22.42,12.48,30.12s18.36,12.48,30.12,12.48c11.77,0,22.42-4.77,30.12-12.48s12.48-18.36,12.48-30.13 C93.35,60.37,88.58,49.72,80.87,42.01L80.87,42.01L80.87,42.01z" />
                </g>
            </svg>
        </div>
    );
}