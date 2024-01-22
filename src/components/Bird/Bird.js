import React from "react";
import "./Bird.css";
import JackImg from "../../assets/img/jack_dog.png"

export default function Bird(props) {
    return (
        <img 
            className="bird"
            src={JackImg}
            style={{
                bottom: `${props.birdY}px`, 
                left: `${props.birdX}px`, 
                height: `${props.birdSize}px`, 
                width: `${props.birdSize}px`, 
                display: 'block', 
                objectFit: 'cover',
                transform: `rotate(${Math.floor(Math.min(-props.rotation, 20))}deg)`
            }}
        />
    )
}