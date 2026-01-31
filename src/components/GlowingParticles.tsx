import { useEffect, useRef, useMemo } from 'react';
import { usePerformanceTier } from '@/hooks/use-mobile';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    hue: number;
    saturation: number;
    lightness: number;
    life: number;
    maxLife: number;
    twinkleSpeed: number;
    type: 'star' | 'dust' | 'orb';
}

interface GlowingParticlesProps {
    className?: string;
    count?: number;
}

/**
 * Galaxy-style particle effect without blur
 * Clean, crisp particles with twinkling effect
 */
const GlowingParticles = ({ className = '', count }: GlowingParticlesProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationIdRef = useRef<number>();
    const performanceTier = usePerformanceTier();

    // Particle count based on performance tier
    const particleCount = useMemo(() => {
        if (count !== undefined) return count;

        switch (performanceTier) {
            case 'high': return 120;
            case 'medium': return 60;
            case 'low': return 0;
            default: return 60;
        }
    }, [performanceTier, count]);

    // Skip rendering entirely on low-end devices
    if (performanceTier === 'low') return null;

    const createParticle = (width: number, height: number): Particle => {
        const type = Math.random() < 0.7 ? 'star' : Math.random() < 0.8 ? 'dust' : 'orb';
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3 - 0.2,
            radius: type === 'star' ? Math.random() * 1.5 + 0.5 :
                type === 'dust' ? Math.random() * 0.8 + 0.3 :
                    Math.random() * 2.5 + 1,
            hue: 180 + Math.random() * 60, // Cyan to blue-purple
            saturation: 70 + Math.random() * 30,
            lightness: type === 'star' ? 80 + Math.random() * 20 : 60 + Math.random() * 20,
            life: 0,
            maxLife: 200 + Math.random() * 150,
            twinkleSpeed: 0.02 + Math.random() * 0.04,
            type,
        };
    };

    const initParticles = (width: number, height: number) => {
        particlesRef.current = Array.from({ length: particleCount }, () =>
            createParticle(width, height)
        );
    };

    const updateAndDraw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        // Clear canvas completely
        ctx.clearRect(0, 0, width, height);

        const particles = particlesRef.current;

        ctx.fillStyle = '#fff'; // Default fallback

        particles.forEach((p, i) => {
            // Update position with gentle wave motion
            p.x += p.vx + Math.sin(p.life * 0.01) * 0.1;
            p.y += p.vy;
            p.life++;

            // Reset if out of bounds or expired
            if (p.life > p.maxLife || p.x < -10 || p.x > width + 10 || p.y < -10 || p.y > height + 10) {
                particles[i] = createParticle(width, height);
                particles[i].y = height + 10;
                return;
            }

            // Calculate opacity with twinkling effect
            const lifeRatio = p.life / p.maxLife;
            const fadeIn = lifeRatio < 0.1 ? lifeRatio * 10 : 1;
            const fadeOut = lifeRatio > 0.85 ? (1 - lifeRatio) * 6.67 : 1;
            const twinkle = 0.7 + 0.3 * Math.sin(p.life * p.twinkleSpeed * Math.PI * 2);
            const opacity = fadeIn * fadeOut * twinkle;

            if (opacity < 0.01) return;

            // Draw based on particle type - Optimized drawing
            if (p.type === 'star') {
                // Simplified 4-point star (Diamond shape) - faster than path
                ctx.beginPath();
                ctx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${opacity})`;

                // Draw diamond instead of complex path
                ctx.moveTo(p.x, p.y - p.radius * 2);
                ctx.lineTo(p.x + p.radius * 2, p.y);
                ctx.lineTo(p.x, p.y + p.radius * 2);
                ctx.lineTo(p.x - p.radius * 2, p.y);
                ctx.fill();
            } else if (p.type === 'dust') {
                // Simple dot
                ctx.beginPath();
                ctx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${opacity * 0.6})`;
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Orb - replace gradient with simple concentric circles (much faster)
                ctx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${opacity * 0.4})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius * 1.5, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, 95%, ${opacity * 0.8})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    };

    const animate = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        updateAndDraw(ctx, canvas.width, canvas.height);
        animationIdRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles(canvas.width, canvas.height);
    };

    useEffect(() => {
        if (particleCount === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles(canvas.width, canvas.height);

        animationIdRef.current = requestAnimationFrame(animate);
        window.addEventListener('resize', handleResize);

        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [particleCount]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 pointer-events-none z-5 ${className}`}
            style={{
                opacity: 1,
            }}
        />
    );
};

export default GlowingParticles;
