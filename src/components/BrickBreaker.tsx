import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Trophy, Heart } from 'lucide-react';

const BrickBreaker = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
    const [lives, setLives] = useState(4);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    // Game constants
    const CANVAS_WIDTH = 400;
    const CANVAS_HEIGHT = 400;
    const PADDLE_HEIGHT = 10;
    const PADDLE_WIDTH = 75;
    const BALL_RADIUS = 5;
    const BRICK_ROW_COUNT = 5;
    const BRICK_COLUMN_COUNT = 7;
    const BRICK_PADDING = 10;
    const BRICK_OFFSET_TOP = 80;
    const BRICK_OFFSET_LEFT = 35;
    const BRICK_WIDTH = (CANVAS_WIDTH - (BRICK_OFFSET_LEFT * 2) - (BRICK_PADDING * (BRICK_COLUMN_COUNT - 1))) / BRICK_COLUMN_COUNT;
    const BRICK_HEIGHT = 15;

    const [level, setLevel] = useState(1);
    const [showLevelUp, setShowLevelUp] = useState(false);

    // Game state refs (mutable for animation loop)
    const ballPos = useRef({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 30 });
    const ballDir = useRef({ dx: 2, dy: -2 });
    const paddleX = useRef((CANVAS_WIDTH - PADDLE_WIDTH) / 2);
    const bricks = useRef<{ x: number; y: number; status: number }[][]>([]);
    const livesRef = useRef(4);
    const levelRef = useRef(1); // Ref for level to be accessible in draw loop
    const reqRef = useRef<number>();

    useEffect(() => {
        const saved = localStorage.getItem('brickBreakerHighScore');
        if (saved) setHighScore(parseInt(saved));
        resetBricks(1);
    }, []);

    const getBrickPattern = (lvl: number, col: number, row: number) => {
        // Level 1: Classic (All bricks)
        if (lvl === 1) return 1;

        // Level 2: Checkerboard
        if (lvl === 2) return (col + row) % 2 === 0 ? 1 : 0;

        // Level 3: Pillars (Vertical bars)
        if (lvl === 3) return col % 2 === 0 ? 1 : 0;

        // Level 4: The Diamond / Pyramid-ish
        if (lvl === 4) {
            const center = Math.floor(BRICK_COLUMN_COUNT / 2);
            return Math.abs(col - center) + row <= center + 1 ? 1 : 0;
        }

        // Level 5: The Fortress (Hard)
        if (lvl === 5) {
            // Edges and middle row
            return (row === 0 || row === BRICK_ROW_COUNT - 1 || col === 0 || col === BRICK_COLUMN_COUNT - 1 || row === 2) ? 1 : 0;
        }

        return 1;
    };

    const resetBricks = (lvl: number) => {
        const newBricks: { x: number; y: number; status: number }[][] = [];
        for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
            newBricks[c] = [];
            for (let r = 0; r < BRICK_ROW_COUNT; r++) {
                newBricks[c][r] = { x: 0, y: 0, status: getBrickPattern(lvl, c, r) };
            }
        }
        bricks.current = newBricks;
    };

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setLives(4);
        setLevel(1);
        livesRef.current = 4;
        levelRef.current = 1;

        resetBallAndPaddle();
        resetBricks(1);

        if (reqRef.current) cancelAnimationFrame(reqRef.current);
        draw();
    };

    const resetBallAndPaddle = () => {
        ballPos.current = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 30 };
        // Constant  base speed for all devices
        const BALL_SPEED = 3.5 + (levelRef.current - 1) * 0.3;
        // Random angle between -45deg and -135deg (upward)
        const angle = (-Math.PI / 4) - (Math.random() * Math.PI / 2);
        ballDir.current = {
            dx: Math.cos(angle) * BALL_SPEED,
            dy: Math.sin(angle) * BALL_SPEED
        };
        paddleX.current = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
    };

    const nextLevel = () => {
        if (levelRef.current >= 5) {
            // Victory or Endless Loop (Loop back to 1 for now but keep score)
            // Or just stay at level 5 with faster speed? Let's cap at 5 for structure
            // Let's loop but keep difficulty high?
            // User asked for "5 different levels". Let's wrap to 5 and keep resetting.
            levelRef.current = 5; // Stay at 5
            resetBallAndPaddle();
            resetBricks(5); // Reset level 5
            return;
        }

        levelRef.current += 1;
        setLevel(levelRef.current);
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 2000); // Hide message after 2s

        resetBallAndPaddle();
        resetBricks(levelRef.current);
    };

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Check if level clear
        let activeBricks = 0;

        // Draw Bricks
        for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
            for (let r = 0; r < BRICK_ROW_COUNT; r++) {
                if (bricks.current[c][r].status === 1) {
                    activeBricks++;
                    const brickX = (c * (BRICK_WIDTH + BRICK_PADDING)) + BRICK_OFFSET_LEFT;
                    const brickY = (r * (BRICK_HEIGHT + BRICK_PADDING)) + BRICK_OFFSET_TOP;
                    bricks.current[c][r].x = brickX;
                    bricks.current[c][r].y = brickY;

                    ctx.beginPath();
                    ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
                    // Color based on Level
                    const hue = (190 + (levelRef.current * 30) + (r * 10)) % 360;
                    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
                    ctx.fill();
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
                    ctx.closePath();
                    ctx.shadowBlur = 0;
                }
            }
        }

        if (activeBricks === 0 && gameState === 'playing') {
            nextLevel();
            reqRef.current = requestAnimationFrame(draw);
            return; // Skip rest of draw frame to avoid glitches
        }

        // Draw Paddle
        ctx.beginPath();
        ctx.rect(paddleX.current, CANVAS_HEIGHT - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT);
        ctx.fillStyle = "#06b6d4"; // Cyan
        ctx.fill();
        ctx.closePath();

        // Draw Ball
        ctx.beginPath();
        ctx.arc(ballPos.current.x, ballPos.current.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.closePath();

        // Collision Logic
        // Constant ball speed for consistency across devices
        const BALL_SPEED = 3.5 + (levelRef.current - 1) * 0.3;
        const MIN_VERTICAL_SPEED = 1.5; // Prevent horizontal traps

        // Walls
        if (ballPos.current.x + ballDir.current.dx > CANVAS_WIDTH - BALL_RADIUS || ballPos.current.x + ballDir.current.dx < BALL_RADIUS) {
            ballDir.current.dx = -ballDir.current.dx;
            // Normalize to maintain constant speed
            const speed = Math.sqrt(ballDir.current.dx ** 2 + ballDir.current.dy ** 2);
            ballDir.current.dx = (ballDir.current.dx / speed) * BALL_SPEED;
            ballDir.current.dy = (ballDir.current.dy / speed) * BALL_SPEED;
        }
        if (ballPos.current.y + ballDir.current.dy < BALL_RADIUS) {
            ballDir.current.dy = -ballDir.current.dy;
            // Normalize to maintain constant speed
            const speed = Math.sqrt(ballDir.current.dx ** 2 + ballDir.current.dy ** 2);
            ballDir.current.dx = (ballDir.current.dx / speed) * BALL_SPEED;
            ballDir.current.dy = (ballDir.current.dy / speed) * BALL_SPEED;
        } else if (ballPos.current.y + ballDir.current.dy > CANVAS_HEIGHT - BALL_RADIUS - 10) { // Bottom area check
            // Paddle Collision
            if (ballPos.current.x > paddleX.current && ballPos.current.x < paddleX.current + PADDLE_WIDTH) {
                // Hit paddle - calculate angle based on hit position
                const hitPos = (ballPos.current.x - paddleX.current) / PADDLE_WIDTH; // 0 to 1
                const bounceAngle = (hitPos - 0.5) * (Math.PI / 3); // -60deg to +60deg variation

                ballDir.current.dy = -Math.abs(ballDir.current.dy); // Always bounce upward
                ballDir.current.dx = Math.sin(bounceAngle) * BALL_SPEED;
                ballDir.current.dy = -Math.cos(bounceAngle) * BALL_SPEED;

                // Ensure minimum vertical speed to prevent horizontal traps
                if (Math.abs(ballDir.current.dy) < MIN_VERTICAL_SPEED) {
                    const sign = ballDir.current.dy < 0 ? -1 : 1;
                    ballDir.current.dy = sign * MIN_VERTICAL_SPEED;
                    // Recalculate dx to maintain constant speed
                    const remainingSpeed = Math.sqrt(BALL_SPEED ** 2 - ballDir.current.dy ** 2);
                    ballDir.current.dx = (ballDir.current.dx > 0 ? 1 : -1) * remainingSpeed;
                }
            } else if (ballPos.current.y + ballDir.current.dy > CANVAS_HEIGHT - BALL_RADIUS) {
                // Ball lost logic
                livesRef.current -= 1;
                setLives(livesRef.current);

                if (livesRef.current <= 0) {
                    setGameState('gameover');
                    return;
                } else {
                    // Reset ball but keep progress
                    resetBallAndPaddle();
                }
            }
        }

        // Brick Collision
        for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
            for (let r = 0; r < BRICK_ROW_COUNT; r++) {
                const b = bricks.current[c][r];
                if (b.status === 1) {
                    if (ballPos.current.x > b.x && ballPos.current.x < b.x + BRICK_WIDTH && ballPos.current.y > b.y && ballPos.current.y < b.y + BRICK_HEIGHT) {
                        ballDir.current.dy = -ballDir.current.dy;
                        b.status = 0;

                        // Normalize speed after brick collision
                        const speed = Math.sqrt(ballDir.current.dx ** 2 + ballDir.current.dy ** 2);
                        ballDir.current.dx = (ballDir.current.dx / speed) * BALL_SPEED;
                        ballDir.current.dy = (ballDir.current.dy / speed) * BALL_SPEED;

                        setScore((s) => {
                            const newScore = s + 10 * levelRef.current; // More points for higher levels
                            setHighScore(prev => {
                                const max = Math.max(prev, newScore);
                                localStorage.setItem('brickBreakerHighScore', max.toString());
                                return max;
                            });
                            return newScore;
                        });
                    }
                }
            }
        }

        ballPos.current.x += ballDir.current.dx;
        ballPos.current.y += ballDir.current.dy;

        reqRef.current = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (gameState !== 'playing') return;
        const relativeX = e.clientX - e.currentTarget.getBoundingClientRect().left;
        if (relativeX > 0 && relativeX < CANVAS_WIDTH) {
            paddleX.current = relativeX - PADDLE_WIDTH / 2;
        }
    };

    // Touch support
    const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (gameState !== 'playing') return;
        const rect = e.currentTarget.getBoundingClientRect();
        const touch = e.touches[0];
        const relativeX = touch.clientX - rect.left;

        if (relativeX > 0 && relativeX < CANVAS_WIDTH) {
            paddleX.current = relativeX - PADDLE_WIDTH / 2;
        }
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-black/40 rounded-3xl overflow-hidden border border-primary/20 shadow-2xl">
            {/* Header / Score */}
            <div className="absolute top-0 left-0 right-0 py-4 px-6 flex justify-between items-center text-primary font-mono z-10 pointer-events-none bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex flex-col">
                    <span className="text-xs uppercase opacity-70">Score</span>
                    <span className="text-xl font-bold">{score}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xs uppercase opacity-70">Level</span>
                    <span className="text-xl font-bold text-yellow-400">{level}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xs uppercase opacity-70 flex items-center gap-1"><Heart size={10} className="fill-current" /> Lives</span>
                    <span className="text-xl font-bold">{lives}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs uppercase opacity-70 flex items-center gap-1"><Trophy size={10} /> Best</span>
                    <span className="text-xl font-bold">{highScore}</span>
                </div>
            </div>

            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                className="w-full h-full cursor-none touch-none"
            />

            {/* Level Up Overlay */}
            {showLevelUp && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    <div className="bg-black/80 px-8 py-4 rounded-xl border border-yellow-400 animate-bounce">
                        <span className="text-3xl font-display font-bold text-yellow-400">LEVEL {level}</span>
                    </div>
                </div>
            )}

            {/* Overlays */}
            {gameState === 'idle' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                    <h3 className="font-display text-3xl font-bold text-white mb-2">Neon Breaker</h3>
                    <p className="text-cyan-300/80 mb-6 text-sm">Move mouse/touch to control paddle</p>
                    <button
                        onClick={startGame}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-full hover:scale-105 transition-transform"
                    >
                        <Play fill="currentColor" size={18} /> Start Game
                    </button>
                </div>
            )}

            {gameState === 'gameover' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-20">
                    <h3 className="font-display text-4xl font-bold text-red-500 mb-2">Game Over</h3>
                    <p className="text-white/80 mb-2 font-mono">Score: {score}</p>
                    <p className="text-primary mb-4 font-mono text-sm">Reached Level {level}</p>
                    {score >= highScore && score > 0 && <p className="text-yellow-400 mb-6 font-bold text-sm">New High Score!</p>}
                    <button
                        onClick={startGame}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform mt-4"
                    >
                        <RotateCcw size={18} /> Try Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default BrickBreaker;
