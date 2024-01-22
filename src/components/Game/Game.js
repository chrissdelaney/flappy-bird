import React, {useState, useLayoutEffect, useEffect} from "react";

import "./Game.css";

import Bird from "../Bird/Bird";
import Pipe from "../Pipe/Pipe";
import GameStart from "../GameStart/GameStart";
import GameScore from "../GameScore/GameScore";

import flap from "../../assets/audio/flap.wav";
import crash from "../../assets/audio/crash.wav";

let pipeIdCounter = 0;

export default function Game() {
    //GAME CONTROLS
    const [gameActive, setGameActive] = React.useState(false);
    const [lastScore, setLastScore] = React.useState(0);
    const [pipesMoving, setPipesMoving] = React.useState(false);
    const [takenFirstJump, setTakenFirstJump] = React.useState(false);
    const takenFirstJumpRef = React.useRef(takenFirstJump);
    const lastScoredPipeRef = React.useRef(null);

    React.useEffect(() => {
        takenFirstJumpRef.current = takenFirstJump;
    }, [takenFirstJump]);

    //GAME SETTINGS
    const GAME_FPS = 30;
    const GAME_WIDTH = Math.min(window.innerWidth, 400);
    const [GAME_HEIGHT, setGameHeight] = useState(0);

    // Use useLayoutEffect to measure the game wrapper after it's been rendered
    useLayoutEffect(() => {
        const updateGameHeight = () => {
            const gameWrapper = document.querySelector('.game__wrapper');
            if (gameWrapper) {
                setGameHeight(gameWrapper.clientHeight);
            }
        };

        updateGameHeight(); // Measure immediately
        window.addEventListener('resize', updateGameHeight); // Measure on resize
        return () => window.removeEventListener('resize', updateGameHeight);
    }, []);
    

    const BIRD_X = 70;
    const [birdSize, setBirdSize] = React.useState(40);
    const BIRD_GRAVITY = 1;
    const BIRD_JUMP_ACCEL = 15;

    const PIPE_WIDTH = 50;
    const PIPE_OPENING_HEIGHT = 180;
    const PIPE_SPACE_BETWEEN = 200;
    const PIPE_TOP_MAX_Y = GAME_HEIGHT/2 + Math.floor(GAME_HEIGHT/3);
    const PIPE_TOP_MIN_Y = GAME_HEIGHT/2 - Math.floor(GAME_HEIGHT/3) + PIPE_SPACE_BETWEEN;
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
        playCrashAudio();
        setPipesMoving(false);
        setTakenFirstJump(false);
        setLastScore(gameScore);
        runGameOverAnimation();
        updateHighScore(gameScore);
        setTimeout(() => {
            setBirdSize(40);
            setGameScore(0);
            setPipesArray([]);
            setvY(0);
            setBirdY(GAME_HEIGHT/2);
            setGameActive(false);
        }, 1500);
    }

    const runGameOverAnimation = () => {
        let interval;
        setTimeout(() => {
            interval = setInterval(() => {
                setBirdSize(oldSize => Math.max(oldSize * 0.95, 0));
            }, 1000 / GAME_FPS);
    
            setTimeout(() => {
                clearInterval(interval);
            }, 1200);
    
        }, 300);
    }

    const updateHighScore = (gameScore) => {
        let highScore = localStorage.getItem("highScore");
        if (!highScore) {
            localStorage.setItem("highScore", gameScore);
        }
        else if (highScore < gameScore) {
            localStorage.setItem("highScore", gameScore);
        }
    }


    //SOUND EFFECTS
    const playFlapAudio = () => {
        new Audio(flap).play();
    }

    const playCrashAudio = () => {
        new Audio(crash).play();
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
        // Apply gravity only after the first jump
        if (takenFirstJumpRef.current) {
            setvY(prev_vY => {
                const newVY = prev_vY - BIRD_GRAVITY;
                setBirdY(prevBirdY => Math.max(prevBirdY + newVY, 0));
                return newVY;
            });
        }



        //update pipe positions
        movePipes();
    }

    const jump = (e) => {
        // Handle only spacebar for keyboard events
        if (e.type === 'keydown' && (e.key !== ' ' && e.code !== 'Space')) {
            return;
        }
    
        if (!gameActive) {
            startGame();
        } else {
            // Game is active, make the bird jump
            if (!takenFirstJumpRef.current) {
                setTakenFirstJump(true);
            }
            if (!pipesMoving) {
                return;
            }
            setvY(BIRD_JUMP_ACCEL);
            playFlapAudio();
        }
    }
    


    

    React.useEffect(() => {
        window.addEventListener('keydown', jump);
        return () => {
            window.removeEventListener('keydown', jump);
        };
    });

    React.useEffect(() => {
        window.addEventListener('touchstart', jump, { passive: false });
        return () => {
            window.removeEventListener('touchstart', jump);
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
    const birdBackX = BIRD_X + birdSize;

    const isBirdWithinPipeHorizontal = 
        (birdFrontX < pipeBackX && birdBackX > pipeFrontX);

        if (isBirdWithinPipeHorizontal) {
            if (lastScoredPipeRef.current !== pipe.id) {
                setGameScore(oldScore => oldScore + 1);
                lastScoredPipeRef.current = pipe.id;
            }
        }

    //VERTICAL CALCULATIONS
    const birdTopY = birdY + birdSize;
    const isBirdHittingPipeVertical = 
        (birdTopY > pipe.top || birdY < pipe.bottom);

    //END GAME IF COLLISION
    if (isBirdWithinPipeHorizontal && isBirdHittingPipeVertical) {
        endGame();
    }

    //END GAME IF BIRD IS ABOVE OR BELOW BOUNDS
    if (birdY === 0 || birdTopY >= GAME_HEIGHT) {
        endGame();
    }

}, [pipesArray, birdY]);


return (
        <div className="game__wrapper">
            {GAME_HEIGHT > 0 && (
                <>
                    {gameActive ? (
                        <>
                            <GameScore gameScore={gameScore} />
                            <Bird birdY={birdY} birdX={BIRD_X} birdSize={birdSize} rotation={vY} />
                            {pipesArray.map((pipe, index) => (
                                <Pipe key={index} id={index + 1} gameHeight={GAME_HEIGHT} pipeWidth={PIPE_WIDTH} {...pipe} />
                            ))}
                        </>
                    ) : (
                        <GameStart startGame={startGame} lastScore={lastScore} />
                    )}
                </>
            )}
        </div>
    );
}