import React from "react";

import "./GameStart.css";

export default function GameStart(props) {
    return (
        <div className="game-start__wrapper">
            <div className="game-start">
                <h2>Georgetown Flappy Bird</h2>
                <p>{`Last Score: ${props.lastScore || 0}  High Score: ${props.highScore || 0}`}</p>
                <button
                    onClick={props.startGame}
                >
                    Start
                </button>
            </div>
        </div>
    )
}