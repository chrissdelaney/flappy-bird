import React from "react";

import "./Game.css";

import Bird from "../Bird/Bird";
import Pipe from "../Pipe/Pipe";
import GameStart from "../GameStart/GameStart";
import GameScore from "../GameScore/GameScore";

let pipeIdCounter = 0;

export default function Game() {
    //GAME CONTROLS
    const [gameActive, setGameActive] = React.useState(false);
    const [pipesMoving, setPipesMoving] = React.useState(false);
    const [firstJump, setFirstJump] = React.useState(false);
    const firstJumpRef = React.useRef(firstJump);
    const lastScoredPipeRef = React.useRef(null);

    React.useEffect(() => {
        firstJumpRef.current = firstJump;
    }, [firstJump]);

    //GAME SETTINGS
    const GAME_FPS = 30;
    const GAME_WIDTH = Math.min(window.innerWidth, 400);
    const GAME_HEIGHT = Math.min(window.innerHeight, 900);

    const BIRD_X = 70;
    const BIRD_SIZE = 40;
    const BIRD_GRAVITY = 1;
    const BIRD_JUMP_ACCEL = 15;

    const PIPE_WIDTH = 50;
    const PIPE_OPENING_HEIGHT = 180;
    const PIPE_SPACE_BETWEEN = 200;
    const PIPE_TOP_MAX_Y = GAME_HEIGHT/2 + 300;
    const PIPE_TOP_MIN_Y = GAME_HEIGHT/2 - 300 + PIPE_SPACE_BETWEEN;
    const PIPE_X_SPEED = 4;

    const [gameScore, setGameScore] = React.useState(0);
    const gameScoreRef = React.useRef(gameScore);
    React.useEffect(() => {
        gameScoreRef.current = gameScore;
    }, [gameScore]);

    const [birdY, setBirdY] = React.useState(GAME_HEIGHT/2);
    const [vY, setvY] = React.useState(-2);
    const[pipesArray, setPipesArray] = React.useState([]);



    //GAME CONTROL FUNCTIONS
    const startGame = () => {
        setGameActive(true);
        setPipesMoving(true);
        addPipe();
    }

    const endGame = () => {
        setPipesMoving(false);
        setFirstJump(true);

        runGameOverAnimation();
        setTimeout(() => {
            setGameActive(false);
            setPipesArray([]);
        }, 1500);
    }

    const runGameOverAnimation = () => {
        setInterval(() => {
            setBirdY(oldY => Math.max(oldY - 1, 0));
        }, 1000 / GAME_FPS)
    }



    //re-rendering game state every 30th of a second
    React.useEffect(() => {
        if (!pipesMoving) {
            return;
        }
        const interval = setInterval(() => {
            updateGameState();
        }, 1000 / GAME_FPS);
    
        return () => clearInterval(interval);
    }, [pipesMoving]);


    //MAIN FUNCTION TO UPDATE GAME STATE
    const updateGameState = () => {
        //update bird position
        if (firstJumpRef.current) {
            setvY(prev_vY => {
                const newVY = prev_vY - BIRD_GRAVITY;
                setBirdY(prevBirdY => Math.max(prevBirdY + newVY, 0));
                return newVY;
            });
        }

        //update pipe positions
        movePipes();
    }

    //BIRD MOVEMENT FUNCTIONS
    const jump = (e) => {
        if ((e.key === ' ' || e.code === 'Space') && !e.repeat) {
            setFirstJump(true);
            setvY(BIRD_JUMP_ACCEL);
        }
    }
    

    React.useEffect(() => {
        window.addEventListener('keydown', jump);
        return () => {
            window.removeEventListener('keydown', jump);
        };
    });

    React.useEffect(() => {
        window.addEventListener('touch', jump);
        return () => {
            window.removeEventListener('touch ', jump);
        };
    });

    //PIPE FUNCTIONS
    const addPipe = () => {
        let pipeOpeningTop = PIPE_TOP_MAX_Y - Math.random() * (PIPE_TOP_MAX_Y - PIPE_TOP_MIN_Y );
        pipeOpeningTop = Math.floor(pipeOpeningTop);
        
        const newPipe = {
            id: pipeIdCounter++,
            top: pipeOpeningTop,
            bottom: pipeOpeningTop - PIPE_OPENING_HEIGHT,
            x: GAME_WIDTH,
        };
    
        setPipesArray(oldArr => [...oldArr, newPipe]);
    };
    

    const movePipes = () => {
        setPipesArray(oldArr => {
            let updatedPipes = oldArr.map(pipe => ({
                ...pipe,
                x: pipe.x - PIPE_X_SPEED
            }));
    
            //add pipe when space is reached
            if (oldArr[oldArr.length - 1].x <= GAME_WIDTH - PIPE_SPACE_BETWEEN) {
                addPipe();
            }

            //delete pipe when x is below 0
            if (oldArr[0].x < -PIPE_WIDTH) {
                updatedPipes = oldArr.slice(1);
            }
    
            return updatedPipes;
        });
    };

//check for collisions/score
React.useEffect(() => {
    const pipe = pipesArray[0];
    if (!pipe) {
        return;
    }

    //HORIZONTAL CALCULATIONS
    const pipeFrontX = pipe.x;
    const pipeBackX = pipe.x + PIPE_WIDTH;

    const birdFrontX = BIRD_X;
    const birdBackX = BIRD_X + BIRD_SIZE;

    const isBirdWithinPipeHorizontal = 
        (birdFrontX < pipeBackX && birdBackX > pipeFrontX);

        if (isBirdWithinPipeHorizontal) {
            if (lastScoredPipeRef.current !== pipe.id) {
                setGameScore(oldScore => oldScore + 1);
                lastScoredPipeRef.current = pipe.id;
            }
        }

    //VERTICAL CALCULATIONS
    const birdTopY = birdY + BIRD_SIZE;
    const isBirdHittingPipeVertical = 
        (birdTopY > pipe.top || birdY < pipe.bottom);

    //END GAME IF COLLISION
    if (isBirdWithinPipeHorizontal && isBirdHittingPipeVertical) {
        endGame();
    }
}, [pipesArray, birdY]);


    return (
        <div className="game__wrapper">
            {
                gameActive
                ?
                <>
                    <GameScore 
                        gameScore={gameScore}
                    />
                    <Bird 
                        birdY={birdY}
                        birdX={BIRD_X}
                        birdSize={BIRD_SIZE}
                    />
                    {
                        pipesArray.map((pipe, index) => (
                            <Pipe 
                                key={index}
                                id={index + 1}
                                gameHeight={GAME_HEIGHT}
                                pipeWidth={PIPE_WIDTH}
                                {...pipe}
                            />
                        ))
                    }             
                </>
                :
                <GameStart 
                    startGame={startGame}
                />
            }
        </div>
    )
}