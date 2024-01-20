import React from "react";

import "./Bird.css";

export default function Bird(props) {
    const birdPosition = `
        .bird {
            bottom: ${props.birdY}px;
            left: ${props.birdX}px;
            height: ${props.birdSize}px;
            width: ${props.birdSize}px;
        }
    `
    return (
        <div className="bird">
            <style>{birdPosition}</style>
        </div>
    )
}