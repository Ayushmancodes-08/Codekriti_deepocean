import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Trophy, Heart } from 'lucide-react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
    size: number;
}

const BrickBreaker = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
    const [lives, setLives] = useState(4);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [showLevelUp, setShowLevelUp] = useState(false);

    // Screen Shake state
    const [shake, setShake] = useState(0);

    // Game constants
    const CANVAS_WIDTH = 400;
    const CANVAS_HEIGHT = 400;
    const PADDLE_HEIGHT = 10;
    const PADDLE_WIDTH = 80;
    const BALL_RADIUS = 6;
    const BRICK_ROW_COUNT = 5;
    const BRICK_COLUMN_COUNT = 7;
    const BRICK_PADDING = 8;
    const BRICK_OFFSET_TOP = 85;
    const BRICK_OFFSET_LEFT = 32;
    const BRICK_WIDTH = (CANVAS_WIDTH - (BRICK_OFFSET_LEFT * 2) - (BRICK_PADDING * (BRICK_COLUMN_COUNT - 1))) / BRICK_COLUMN_COUNT;
    const BRICK_HEIGHT = 16;

    // Game state refs
    const ballPos = useRef({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 35 });
    const ballDir = useRef({ dx: 2, dy: -2 });
    const paddleX = useRef((CANVAS_WIDTH - PADDLE_WIDTH) / 2);
    const bricks = useRef<{ x: number; y: number; status: number; color: string }[][]>([]);
    const livesRef = useRef(4);
    const levelRef = useRef(1);
    const particles = useRef<Particle[]>([]);
    const reqRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const saved = localStorage.getItem('brickBreakerHighScore');
        if (saved) setHighScore(parseInt(saved));
        resetBricks(1);
    }, []);

    const resetBricks = (lvl: number) => {
        const newBricks: { x: number; y: number; status: number; color: string }[][] = [];
        for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
            newBricks[c] = [];
            for (let r = 0; r < BRICK_ROW_COUNT; r++) {
                const hue = (190 + (lvl * 30) + (r * 15)) % 360;
                newBricks[c][r] = {
                    x: 0,
                    y: 0,
                    status: getBrickPattern(lvl, c, r),
                    color: `hsla(${hue}, 100%, 60%, 0.8)`
                };
            }
        }
        bricks.current = newBricks;
    };

    const getBrickPattern = (lvl: number, col: number, row: number) => {
        if (lvl === 1) return 1;
        if (lvl === 2) return (col + row) % 2 === 0 ? 1 : 0;
        if (lvl === 3) return col % 2 === 0 ? 1 : 0;
        if (lvl === 4) {
            const center = Math.floor(BRICK_COLUMN_COUNT / 2);
            return Math.abs(col - center) + row <= center + 1 ? 1 : 0;
        }
        if (lvl >= 5) {
            return (row === 0 || row === BRICK_ROW_COUNT - 1 || col === 0 || col === BRICK_COLUMN_COUNT - 1 || row === 2) ? 1 : 0;
        }
        return 1;
    };

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setLives(4);
        setLevel(1);
        livesRef.current = 4;
        levelRef.current = 1;
        particles.current = [];
        setShake(0);
        resetBallAndPaddle();
        resetBricks(1);
        if (reqRef.current) cancelAnimationFrame(reqRef.current);
        draw();
    };

    const resetBallAndPaddle = () => {
        ballPos.current = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 40 };
        const BALL_SPEED = 3.6 + (levelRef.current - 1) * 0.4;
        const angle = (-Math.PI / 4) - (Math.random() * Math.PI / 2);
        ballDir.current = {
            dx: Math.cos(angle) * BALL_SPEED,
            dy: Math.sin(angle) * BALL_SPEED
        };
        paddleX.current = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
    };

    const createParticles = (x: number, y: number, color: string, count = 12) => {
        for (let i = 0; i < count; i++) {
            particles.current.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1.0,
                color,
                size: Math.random() * 3 + 1
            });
        }
    };

    const triggerShake = (amount = 4) => {
        setShake(amount);
    };

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        // Apply screen shake
        ctx.save();
        if (shake > 0) {
            const dx = (Math.random() - 0.5) * shake;
            const dy = (Math.random() - 0.5) * shake;
            ctx.translate(dx, dy);
            setShake(s => Math.max(0, s * 0.9));
        }

        // Deep Ocean Background with trail effect
        ctx.fillStyle = '#050A14';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Update & Draw Particles (Bubbles/Debris)
        particles.current = particles.current.filter(p => p.life > 0);
        particles.current.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color.replace('0.8', p.life.toString());
            ctx.fill();
        });

        // Draw Bricks (Glassmorphism style)
        let activeBricks = 0;
        for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
            for (let r = 0; r < BRICK_ROW_COUNT; r++) {
                const b = bricks.current[c][r];
                if (b.status === 1) {
                    activeBricks++;
                    const bx = (c * (BRICK_WIDTH + BRICK_PADDING)) + BRICK_OFFSET_LEFT;
                    const by = (r * (BRICK_HEIGHT + BRICK_PADDING)) + BRICK_OFFSET_TOP;
                    b.x = bx;
                    b.y = by;

                    // Brick Glow
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = b.color;

                    // Glass body
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
                    ctx.fillRect(bx, by, BRICK_WIDTH, BRICK_HEIGHT);

                    // Neon Border
                    ctx.strokeStyle = b.color;
                    ctx.lineWidth = 2;
                    ctx.strokeRect(bx, by, BRICK_WIDTH, BRICK_HEIGHT);

                    ctx.shadowBlur = 0;
                }
            }
        }

        if (activeBricks === 0 && gameState === 'playing') {
            triggerShake(12);
            setShowLevelUp(true);
            setTimeout(() => setShowLevelUp(false), 2000);
            levelRef.current = Math.min(5, levelRef.current + 1);
            setLevel(levelRef.current);
            resetBallAndPaddle();
            resetBricks(levelRef.current);
            reqRef.current = requestAnimationFrame(draw);
            ctx.restore();
            return;
        }

        // Draw Ball Trail (Simple)
        // Draw Paddle (Neon Beam)
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00D9FF';
        ctx.fillStyle = '#00D9FF';
        ctx.beginPath();
        ctx.roundRect(paddleX.current, CANVAS_HEIGHT - PADDLE_HEIGHT - 15, PADDLE_WIDTH, PADDLE_HEIGHT, 5);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw Ball (Bioluminescent Orb)
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#fff';
        ctx.beginPath();
        ctx.arc(ballPos.current.x, ballPos.current.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.shadowBlur = 0;

        const BALL_SPEED = 3.6 + (levelRef.current - 1) * 0.4;

        // Collision Logic
        if (ballPos.current.x + ballDir.current.dx > CANVAS_WIDTH - BALL_RADIUS || ballPos.current.x + ballDir.current.dx < BALL_RADIUS) {
            ballDir.current.dx = -ballDir.current.dx;
            triggerShake(2);
        }
        if (ballPos.current.y + ballDir.current.dy < BALL_RADIUS) {
            ballDir.current.dy = -ballDir.current.dy;
            triggerShake(2);
        } else if (ballPos.current.y + ballDir.current.dy > CANVAS_HEIGHT - BALL_RADIUS - 15) {
            if (ballPos.current.x > paddleX.current && ballPos.current.x < paddleX.current + PADDLE_WIDTH) {
                const hitPos = (ballPos.current.x - paddleX.current) / PADDLE_WIDTH;
                const bounceAngle = (hitPos - 0.5) * (Math.PI / 2.5);
                ballDir.current.dx = Math.sin(bounceAngle) * BALL_SPEED;
                ballDir.current.dy = -Math.cos(bounceAngle) * BALL_SPEED;
                triggerShake(4);
                createParticles(ballPos.current.x, ballPos.current.y, '#00D9FF', 6);
            } else if (ballPos.current.y + ballDir.current.dy > CANVAS_HEIGHT - BALL_RADIUS) {
                livesRef.current -= 1;
                setLives(livesRef.current);
                triggerShake(15);
                if (livesRef.current <= 0) {
                    setGameState('gameover');
                    ctx.restore();
                    return;
                } else {
                    resetBallAndPaddle();
                }
            }
        }

        // Brick Collision Logic
        for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
            for (let r = 0; r < BRICK_ROW_COUNT; r++) {
                const b = bricks.current[c][r];
                if (b.status === 1) {
                    if (ballPos.current.x > b.x && ballPos.current.x < b.x + BRICK_WIDTH && ballPos.current.y > b.y && ballPos.current.y < b.y + BRICK_HEIGHT) {
                        ballDir.current.dy = -ballDir.current.dy;
                        b.status = 0;
                        triggerShake(6);
                        createParticles(b.x + BRICK_WIDTH / 2, b.y + BRICK_HEIGHT / 2, b.color, 15);

                        setScore(s => {
                            const ns = s + 10 * levelRef.current;
                            if (ns > highScore) {
                                setHighScore(ns);
                                localStorage.setItem('brickBreakerHighScore', ns.toString());
                            }
                            return ns;
                        });
                    }
                }
            }
        }

        ballPos.current.x += ballDir.current.dx;
        ballPos.current.y += ballDir.current.dy;

        ctx.restore();
        reqRef.current = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (gameState !== 'playing') return;
        const rect = e.currentTarget.getBoundingClientRect();
        const scaleX = CANVAS_WIDTH / rect.width;
        const relativeX = (e.clientX - rect.left) * scaleX;
        paddleX.current = Math.min(CANVAS_WIDTH - PADDLE_WIDTH, Math.max(0, relativeX - PADDLE_WIDTH / 2));
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (gameState !== 'playing') return;
        const rect = e.currentTarget.getBoundingClientRect();
        const scaleX = CANVAS_WIDTH / rect.width;
        const touch = e.touches[0];
        const relativeX = (touch.clientX - rect.left) * scaleX;
        paddleX.current = Math.min(CANVAS_WIDTH - PADDLE_WIDTH, Math.max(0, relativeX - PADDLE_WIDTH / 2));
    };

    return (
        <div className="relative w-full h-full flex flex-col bg-[#050A14] rounded-2xl overflow-hidden border border-[#00D9FF]/20 group">
            {/* Header Overlay */}
            <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-start z-10 pointer-events-none bg-gradient-to-b from-black/80 to-transparent">
                <div className="space-y-0.5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#00D9FF]/60 font-black">Integrity</p>
                    <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className={`w-3 h-1.5 rounded-full transition-all duration-500 ${i < lives ? 'bg-[#00D9FF] shadow-[0_0_10px_#00D9FF]' : 'bg-white/10'}`} />
                        ))}
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-black mb-1">Sector {level}</p>
                    <div className="px-4 py-1.5 bg-black/40 rounded-full border border-white/10 backdrop-blur-xl">
                        <span className="text-xl font-black text-white tracking-widest">{score.toLocaleString()}</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-yellow-400/60 font-black">Record</p>
                    <p className="text-sm font-black text-yellow-400 tracking-wider">{highScore.toLocaleString()}</p>
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

            {/* Overlays */}
            {gameState === 'idle' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a192f]/85 backdrop-blur-xl z-20">
                    <div className="w-24 h-24 rounded-full border-2 border-[#00D9FF] flex items-center justify-center mb-8 relative">
                        <div className="absolute inset-0 rounded-full border-2 border-[#00D9FF] animate-ping opacity-20" />
                        <div className="absolute -inset-4 rounded-full border border-[#00D9FF]/10 animate-pulse" />
                        <Play className="w-12 h-12 text-[#00D9FF] fill-current translate-x-1" />
                    </div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-2">Abyss Breaker</h3>
                    <p className="text-[#00D9FF]/60 text-[10px] font-black uppercase tracking-[0.3em] mb-10">Establishing Neural Uplink...</p>
                    <button
                        onClick={startGame}
                        className="group relative px-10 py-4 bg-[#00D9FF] text-[#0a192f] font-black uppercase tracking-widest text-xs rounded-xl overflow-hidden active:scale-95 transition-all shadow-[0_0_30px_rgba(0,217,255,0.3)]"
                    >
                        <span className="relative z-10">Start Mission</span>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                    </button>
                    <p className="mt-8 text-white/20 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Touch / Move to control</p>
                </div>
            )}

            {gameState === 'gameover' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl z-20">
                    <div className="mb-8 relative">
                        <Heart className="w-16 h-16 text-red-500/10" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-red-500 font-black text-4xl animate-pulse">LOST</span>
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-1">Signal Terminated</h3>
                    <p className="text-red-500/80 text-[10px] font-black uppercase tracking-[0.4em] mb-10">Extraction Failed in Sector {level}</p>

                    <div className="grid grid-cols-2 gap-12 mb-12">
                        <div className="text-center">
                            <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">Yield</p>
                            <p className="text-3xl font-black text-[#00D9FF]">{score}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">Depth</p>
                            <p className="text-3xl font-black text-yellow-400">{level}</p>
                        </div>
                    </div>

                    <button
                        onClick={startGame}
                        className="flex items-center gap-4 px-10 py-4 border-2 border-[#00D9FF] text-[#00D9FF] font-black uppercase tracking-widest text-xs rounded-xl hover:bg-[#00D9FF] hover:text-[#0a192f] transition-all active:scale-95 shadow-[0_0_20px_rgba(0,217,255,0.1)]"
                    >
                        <RotateCcw className="w-4 h-4" /> Restart
                    </button>
                </div>
            )}

            {showLevelUp && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    <div className="px-12 py-6 bg-[#00D9FF] rounded-2xl shadow-[0_0_100px_rgba(0,217,255,0.4)] animate-in zoom-in duration-300">
                        <span className="text-4xl font-black text-[#0a192f] uppercase italic tracking-tighter">Sector {level} Clear</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrickBreaker;
