import React from "react";

import "./GameStart.css";

export default function GameStart(props) {
    const highScore = localStorage.getItem("highScore")
    return (
        <div className="game-start__wrapper">
            <div className="game-start">
                <h1>Flappy Jack</h1>
                <p>{`Last Score: ${props.lastScore || 0}`}</p>  
                <p>{`High Score: ${highScore || 0}`}</p>
                <button
                    onClick={props.startGame}
                >
                    Start
                </button>
            </div>
        </div>
    )
}