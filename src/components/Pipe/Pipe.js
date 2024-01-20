import React from "react";

import "./Pipe.css";

export default function Pipe(props) {
    const pipeTopHeight = props.gameHeight - props.top;

    

    return(
        <div className="pipe__wrapper" style={{ left: `${props.x}px`, width: `${props.pipeWidth}px`}}>
            <div className="pipe__top" style={{ height: `${pipeTopHeight}px` }}>
            </div>
            <div className="pipe__bottom" style={{ height: `${props.bottom}px` }}>
            </div>
        </div>
    )
}
