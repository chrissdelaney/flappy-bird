import React from "react";

import "./GameScore.css";

export default function GameScore(props) {
    return (
        <div className="game-score__wrapper">
            {`Score: ${props.gameScore}`}
        </div>
    )
}