import { useRef, useState, useEffect, Suspense, Component, ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Error boundary for Canvas
class CanvasErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Canvas error:', error);
  }

  render() {
    if (this.state.hasError) {
      return <div className="w-full h-full bg-transparent flex items-center justify-center" />;
    }
    return this.props.children;
  }
}

// 3D Jellyfish Component
const Jellyfish3D = ({ interactive = false }: { interactive?: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const tentaclesRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { viewport } = useThree();

  // Animation state
  useFrame(({ clock }) => {
    if (!groupRef.current || !tentaclesRef.current) return;

    const time = clock.getElapsedTime();

    // Floating animation
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.3;

    // Gentle rotation
    groupRef.current.rotation.z = Math.sin(time * 0.3) * 0.1;

    // Tentacle wave animation
    tentaclesRef.current.children.forEach((tentacle, index) => {
      const wave = Math.sin(time * 1.5 + index * 0.5) * 0.15;
      tentacle.rotation.z = wave;
      tentacle.position.y = Math.sin(time * 1.2 + index * 0.3) * 0.1;
    });

    // Enhanced animation on hover
    if (hovered && interactive) {
      groupRef.current.rotation.x += 0.01;
      groupRef.current.rotation.y += 0.015;
    }
  });

  // Create jellyfish geometry
  const createJellyfish = () => {
    const group = new THREE.Group();

    // Bell (main body)
    const bellGeometry = new THREE.IcosahedronGeometry(0.8, 4);
    const bellMaterial = new THREE.MeshPhongMaterial({
      color: 0xff6b35,
      emissive: 0xff6b35,
      emissiveIntensity: 0.3,
      wireframe: false,
      shininess: 100,
    });
    const bell = new THREE.Mesh(bellGeometry, bellMaterial);
    bell.scale.set(1, 0.8, 1);
    group.add(bell);

    // Tentacles
    const tentaclesGroup = new THREE.Group();
    const tentacleCount = 8;

    for (let i = 0; i < tentacleCount; i++) {
      const angle = (i / tentacleCount) * Math.PI * 2;
      const tentacleGroup = new THREE.Group();

      // Create tentacle segments
      for (let j = 0; j < 3; j++) {
        const segmentGeometry = new THREE.ConeGeometry(0.15 - j * 0.04, 0.4, 8);
        const segmentMaterial = new THREE.MeshPhongMaterial({
          color: 0xff6b35,
          emissive: 0xff6b35,
          emissiveIntensity: 0.2,
          shininess: 80,
        });
        const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
        segment.position.y = -0.5 - j * 0.4;
        segment.castShadow = true;
        segment.receiveShadow = true;
        tentacleGroup.add(segment);
      }

      tentacleGroup.position.x = Math.cos(angle) * 0.6;
      tentacleGroup.position.z = Math.sin(angle) * 0.6;
      tentacleGroup.position.y = -0.4;
      tentaclesGroup.add(tentacleGroup);
    }

    group.add(tentaclesGroup);
    tentaclesRef.current = tentaclesGroup;

    return group;
  };

  const jellyfish = createJellyfish();

  return (
    <group
      ref={groupRef}
      onPointerEnter={() => interactive && setHovered(true)}
      onPointerLeave={() => interactive && setHovered(false)}
    >
      <primitive object={jellyfish} />
    </group>
  );
};

// Lighting component
const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} color={0xff6b35} />
      <pointLight position={[-10, -10, 10]} intensity={0.5} color={0x00d9ff} />
      <pointLight position={[0, 0, 10]} intensity={0.8} />
    </>
  );
};

// SVG Fallback Component
const JellyfishSVGFallback = ({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) => {
  const sizeMap = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  return (
    <svg
      viewBox="0 0 100 120"
      className={`${sizeMap[size]} text-primary`}
      fill="currentColor"
    >
      {/* Bell */}
      <ellipse cx="50" cy="30" rx="25" ry="28" fill="currentColor" opacity="0.8" />

      {/* Tentacles */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 50 + Math.cos(rad) * 20;
        const y1 = 58;
        const x2 = 50 + Math.cos(rad) * 18;
        const y2 = 100;

        return (
          <path
            key={i}
            d={`M ${x1} ${y1} Q ${x2} ${y2 - 10} ${x2} ${y2}`}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            opacity="0.7"
          />
        );
      })}

      {/* Glow effect */}
      <circle cx="50" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </svg>
  );
};

// Main Component
interface JellyfishLogoProps {
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  interactive?: boolean;
  className?: string;
  fallback?: boolean;
}

const JellyfishLogo = ({
  size = 'medium',
  animated = true,
  interactive = false,
  className = '',
  fallback = false,
}: JellyfishLogoProps) => {
  const [webglSupported, setWebglSupported] = useState(true);
  const [showFallback, setShowFallback] = useState(fallback);

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
      if (!gl) {
        setWebglSupported(false);
        setShowFallback(true);
      }
    } catch (e) {
      setWebglSupported(false);
      setShowFallback(true);
    }
  }, []);

  const sizeMap = {
    small: { canvas: 80, scale: 0.6 },
    medium: { canvas: 120, scale: 1 },
    large: { canvas: 160, scale: 1.4 },
  };

  const config = sizeMap[size];

  // Use fallback if WebGL not supported or explicitly requested
  if (showFallback || !webglSupported) {
    return (
      <motion.div
        className={`flex items-center justify-center ${className}`}
        animate={animated ? { y: [0, -10, 0] } : {}}
        transition={animated ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : {}}
      >
        <JellyfishSVGFallback size={size} />
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      animate={animated ? { y: [0, -10, 0] } : {}}
      transition={animated ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : {}}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
    >
      <div style={{ width: config.canvas, height: config.canvas }}>
        <CanvasErrorBoundary>
          <Canvas
            camera={{ position: [0, 0, 3], fov: 50 }}
            style={{ width: '100%', height: '100%' }}
            onCreated={(state) => {
              state.gl.setClearColor(0x000000, 0);
            }}
          >
            <Suspense fallback={null}>
              <Lights />
              <Jellyfish3D interactive={interactive} />
            </Suspense>
          </Canvas>
        </CanvasErrorBoundary>
      </div>
    </motion.div>
  );
};

export default JellyfishLogo;
