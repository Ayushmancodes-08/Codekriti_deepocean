import { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
}

const Bubbles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const animationIdRef = useRef<number>();

  const GRAVITY = 0.15;
  const BOUNCE_DAMPING = 0.7;
  const FRICTION = 0.98;
  const BUBBLE_COUNT = 25;

  // Generate color gradient based on position
  const getColorGradient = (y: number, height: number): string => {
    const ratio = y / height;
    if (ratio < 0.3) {
      return `rgba(0, 217, 255, ${0.6 - ratio * 0.3})`; // Cyan at top
    } else if (ratio < 0.7) {
      return `rgba(100, 200, 255, ${0.5 - (ratio - 0.3) * 0.2})`; // Light blue in middle
    } else {
      return `rgba(255, 107, 53, ${0.4 - (ratio - 0.7) * 0.3})`; // Orange at bottom
    }
  };

  // Initialize bubbles
  const initializeBubbles = (width: number, height: number) => {
    const bubbles: Bubble[] = [];
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 6 + 2, // 2-8px radius for small discrete bubbles
        color: getColorGradient(Math.random() * height, height),
        opacity: Math.random() * 0.2 + 0.1, // More transparent: 0.1-0.3
      });
    }
    bubblesRef.current = bubbles;
  };

  // Physics simulation
  const updateBubbles = (width: number, height: number) => {
    const bubbles = bubblesRef.current;

    bubbles.forEach((bubble) => {
      // Apply gravity
      bubble.vy += GRAVITY;

      // Apply friction
      bubble.vx *= FRICTION;
      bubble.vy *= FRICTION;

      // Update position
      bubble.x += bubble.vx;
      bubble.y += bubble.vy;

      // Boundary detection and collision
      // Left and right boundaries
      if (bubble.x - bubble.radius < 0) {
        bubble.x = bubble.radius;
        bubble.vx *= -BOUNCE_DAMPING;
      } else if (bubble.x + bubble.radius > width) {
        bubble.x = width - bubble.radius;
        bubble.vx *= -BOUNCE_DAMPING;
      }

      // Top boundary
      if (bubble.y - bubble.radius < 0) {
        bubble.y = bubble.radius;
        bubble.vy *= -BOUNCE_DAMPING;
      }

      // Bottom boundary - fade out and reset
      if (bubble.y - bubble.radius > height) {
        bubble.y = -bubble.radius;
        bubble.x = Math.random() * width;
        bubble.vy = (Math.random() - 0.5) * 2;
        bubble.vx = (Math.random() - 0.5) * 2;
        bubble.opacity = Math.random() * 0.2 + 0.1; // More transparent when reset
      }

      // Update color based on current position
      bubble.color = getColorGradient(bubble.y, height);

      // Fade out near edges
      const fadeDistance = 50;
      if (bubble.y > height - fadeDistance) {
        const fadeRatio = (bubble.y - (height - fadeDistance)) / fadeDistance;
        bubble.opacity = (Math.random() * 0.2 + 0.1) * (1 - fadeRatio);
      }
    });
  };

  // Render bubbles on canvas
  const renderBubbles = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas completely (no trail effect)
    ctx.clearRect(0, 0, width, height);

    const bubbles = bubblesRef.current;
    bubbles.forEach((bubble) => {
      // Draw bubble as simple circle with outline - no gradient bleeding
      ctx.fillStyle = bubble.color.replace('rgba', 'rgba').replace(/[\d.]+\)$/, `${bubble.opacity})`);
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.fill();

      // Add subtle outline for visibility
      ctx.strokeStyle = bubble.color.replace('rgba', 'rgba').replace(/[\d.]+\)$/, `${bubble.opacity * 0.6})`);
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    updateBubbles(width, height);
    renderBubbles(ctx, width, height);

    animationIdRef.current = requestAnimationFrame(animate);
  };

  // Handle resize
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    initializeBubbles(canvas.width, canvas.height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set initial canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Initialize bubbles
    initializeBubbles(canvas.width, canvas.height);

    // Start animation loop
    animationIdRef.current = requestAnimationFrame(animate);

    // Handle window resize
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
      }}
    />
  );
};

export default Bubbles;
