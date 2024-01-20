import React from "react";

import "./GameScore.css";

export default function GameScore(props) {
    return (
        <div className="game-score__wrapper">
            <div className="game-score">
                {`Score: ${props.gameScore}`}
            </div>
        </div>
    )
}