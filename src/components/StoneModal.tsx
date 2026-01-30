import { useRef, useState, useEffect, Suspense, Component, ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { useRegistration } from '../contexts/RegistrationContext';
import { EventType, SingleParticipant, TeamRegistration } from '../lib/schemas';
import EventSelection from './EventSelection';
import { lazyLoadComponent } from '../lib/lazyLoad';

// Lazy load heavy components with performance monitoring
const LazyRegistrationFlow = lazyLoadComponent(
  () => import('./RegistrationFlow').then(m => ({ default: m.RegistrationFlow })),
  'RegistrationFlow',
  { monitorPerformance: true }
);

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
      return <div className="w-full h-full bg-black/20 flex items-center justify-center text-white/50">3D rendering unavailable</div>;
    }
    return this.props.children;
  }
}

// Physics world setup
let physicsWorld: CANNON.World | null = null;

const createPhysicsWorld = () => {
  const world = new CANNON.World();
  world.gravity.set(0, -9.82, 0);
  world.defaultContactMaterial.friction = 0.3;
  world.defaultContactMaterial.restitution = 0.6;
  return world;
};

// 3D Stone Component
interface Stone3DProps {
  onAnimationComplete: () => void;
  isExiting: boolean;
}

const Stone3D = ({ onAnimationComplete, isExiting }: Stone3DProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<CANNON.Body | null>(null);
  const { viewport } = useThree();
  const animationStateRef = useRef<'entering' | 'settled' | 'exiting'>('entering');
  const timeRef = useRef(0);

  // Initialize physics
  useEffect(() => {
    if (!physicsWorld) {
      physicsWorld = createPhysicsWorld();
    }

    // Create stone body
    const stoneShape = new CANNON.Sphere(1);
    const stoneBody = new CANNON.Body({
      mass: 1,
      shape: stoneShape,
      linearDamping: 0.3,
      angularDamping: 0.3,
    });

    // Position stone at top of screen
    stoneBody.position.set(0, 5, 0);
    stoneBody.velocity.set(0, -8, 0);

    physicsWorld.addBody(stoneBody);
    bodyRef.current = stoneBody;

    // Create ground for collision
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0, shape: groundShape });
    groundBody.position.set(0, -2, 0);
    physicsWorld.addBody(groundBody);

    return () => {
      if (physicsWorld && bodyRef.current) {
        physicsWorld.removeBody(bodyRef.current);
      }
    };
  }, []);

  // Animation loop
  useFrame(({ clock }) => {
    if (!meshRef.current || !bodyRef.current || !physicsWorld) return;

    timeRef.current = clock.getElapsedTime();

    // Step physics simulation
    physicsWorld.step(1 / 60);

    // Update mesh position from physics body
    meshRef.current.position.copy(bodyRef.current.position as any);
    meshRef.current.quaternion.copy(bodyRef.current.quaternion as any);

    // Detect when stone has settled
    if (animationStateRef.current === 'entering') {
      const velocity = bodyRef.current.velocity.length();
      const isNearCenter = Math.abs(bodyRef.current.position.y) < 0.5;

      if (velocity < 0.1 && isNearCenter) {
        animationStateRef.current = 'settled';
        bodyRef.current.velocity.set(0, 0, 0);
        bodyRef.current.angularVelocity.set(0, 0, 0);
        bodyRef.current.position.set(0, 0, 0);
        onAnimationComplete();
      }
    }

    // Handle exit animation
    if (isExiting && animationStateRef.current === 'settled') {
      animationStateRef.current = 'exiting';
      bodyRef.current.velocity.set(0, 10, 0);
      bodyRef.current.angularVelocity.set(5, 5, 5);
    }

    // Gentle rotation when settled
    if (animationStateRef.current === 'settled' && !isExiting) {
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <icosahedronGeometry args={[1, 4]} />
        <meshPhongMaterial
          color={0x8b7355}
          emissive={0x4a3728}
          shininess={30}
          wireframe={false}
        />
      </mesh>
    </group>
  );
};

// Lighting component
const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1} color={0xffffff} />
      <pointLight position={[-10, -10, 10]} intensity={0.5} color={0xff6b35} />
      <directionalLight position={[0, 10, 5]} intensity={0.8} castShadow />
    </>
  );
};



// Main Stone Modal Component
interface StoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StoneModal = ({ isOpen, onClose }: StoneModalProps) => {
  const { selectEvent, formState } = useRegistration();
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showRegistrationFlow, setShowRegistrationFlow] = useState(false);

  const handleEventSelect = (event: EventType) => {
    selectEvent(event);
    setIsExiting(true);
    setTimeout(() => {
      setShowRegistrationFlow(true);
      setAnimationComplete(false);
      setIsExiting(false);
    }, 1000);
  };

  const handleRegistrationComplete = (data: SingleParticipant | TeamRegistration) => {
    // Handle successful registration
    console.log('Registration completed:', data);
    handleClose();
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
      setAnimationComplete(false);
      setIsExiting(false);
      setShowRegistrationFlow(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={handleClose}
          role="presentation"
          aria-hidden={!isOpen}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-full max-w-4xl max-h-[600px] bg-black/20 rounded-2xl overflow-hidden border border-primary/20"
            role="dialog"
            aria-modal="true"
            aria-labelledby="stone-modal-title"
            aria-describedby="stone-modal-description"
          >
            {/* 3D Canvas - Show during event selection */}
            {!showRegistrationFlow && (
              <div className="absolute inset-0">
                <CanvasErrorBoundary>
                  <Canvas
                    camera={{ position: [0, 2, 4], fov: 50 }}
                    style={{ width: '100%', height: '100%' }}
                    onCreated={(state) => {
                      state.gl.setClearColor(0x000000, 0.1);
                      state.gl.shadowMap.enabled = true;
                    }}
                    aria-label="3D stone animation"
                  >
                    <Suspense fallback={null}>
                      <Lights />
                      <Stone3D
                        onAnimationComplete={() => setAnimationComplete(true)}
                        isExiting={isExiting}
                      />
                    </Suspense>
                  </Canvas>
                </CanvasErrorBoundary>
              </div>
            )}

            {/* Event Selection Overlay */}
            {animationComplete && !isExiting && !showRegistrationFlow && (
              <EventSelection
                onEventSelect={handleEventSelect}
                onClose={handleClose}
                showCloseButton={true}
                className="absolute inset-0 flex flex-col items-center justify-center z-50"
              />
            )}

            {/* Registration Flow - Show after event selection */}
            {showRegistrationFlow && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex flex-col items-center justify-center z-50 p-6 overflow-y-auto"
              >
                <div className="w-full max-w-2xl">
                  <Suspense fallback={<div className="text-white/50">Loading registration form...</div>}>
                    <LazyRegistrationFlow
                      onComplete={handleRegistrationComplete}
                      onClose={handleClose}
                    />
                  </Suspense>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StoneModal;
