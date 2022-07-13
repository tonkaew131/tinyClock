import React from 'react';

export default function DeviceIcon(props) {
    return (
        <div className="w-10 h-10 hover:cursor-pointer">
            {props.type == 'Computer' ? <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" fill={props.isActive ? '#89b4fa' : '#cdd6f4'}
                viewBox="0 0 490 490" >
                <path d="M451.719,366.941V101.285c0-14.807-12.02-26.858-26.797-26.858H65.078c-14.777,0-26.797,12.051-26.797,26.858v265.657H0
	v16.216l24.5,32.417h441l24.5-32.417v-16.216H451.719z M68.906,105.036h352.187v261.905H68.906V105.036z"/>
            </svg> : undefined}
            {props.type == 'Smartphone' ? <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 485 485" fill={props.isActive ? '#89b4fa' : '#cdd6f4'}>
                <g>
                    <g>
                        <g>
                            <path d="M367.5,0h-250C102.336,0,90,12.336,90,27.5v430c0,15.164,12.336,27.5,27.5,27.5h250c15.164,0,27.5-12.336,27.5-27.5v-430
				C395,12.336,382.664,0,367.5,0z M380,457.5c0,6.893-5.607,12.5-12.5,12.5h-250c-6.893,0-12.5-5.607-12.5-12.5V405h275V457.5z
				 M380,390H105V95h275V390z M380,80H105V27.5c0-6.893,5.607-12.5,12.5-12.5h250c6.893,0,12.5,5.607,12.5,12.5V80z"/>
                            <rect x="197" y="40.75" width="90" height="15" />
                            <rect x="222.5" y="430" width="40" height="15" />
                        </g>
                    </g>
                </g>
            </svg>
                : undefined}
        </div>
    );
}