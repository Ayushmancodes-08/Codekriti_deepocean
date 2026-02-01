import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { usePerformanceTier } from "@/hooks/use-mobile";

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const TiltCard = ({ children, className = "", style = {} }: TiltCardProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const performanceTier = usePerformanceTier(); // Optimization

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Spring physics for smooth return to center
    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    // Glare effect position
    const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
    const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

    const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        // Optimization: Disable tilt calculations on low-end devices
        if (performanceTier === 'low') return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            style={{
                rotateX: performanceTier === 'low' ? undefined : rotateX,
                rotateY: performanceTier === 'low' ? undefined : rotateY,
                transformStyle: "preserve-3d",
                ...style
            }}
            className={`relative transform-gpu will-change-transform ${className}`}
        >
            {/* Content */}
            <div
                style={{ transform: performanceTier === 'low' ? undefined : "translateZ(20px)" }}
                className="relative z-10 w-full h-full"
            >
                {children}
            </div>

            {/* Glare/Shine Effect - Hide on low tier to save paint */}
            {performanceTier !== 'low' && (
                <motion.div
                    className="absolute inset-0 z-20 pointer-events-none rounded-[inherit] mix-blend-overlay"
                    style={{
                        opacity: isHovered ? 0.4 : 0,
                        background: glareBackground,
                    }}
                />
            )}
        </motion.div>
    );
};

export default TiltCard;
