import React, { useRef, useEffect } from 'react';
import { OrbitControls, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import Environment from './Environment';
import MeditationSpots from './MeditationSpots';
import Avatar from './Avatar';

function Scene() {
  const avatarRef = useRef();
  const controlsRef = useRef();

  // Expose both refs globally
  useEffect(() => {
    window.avatarRef = avatarRef;
    window.controlsRef = controlsRef;

    // Set initial camera position
    if (controlsRef.current) {
      controlsRef.current.object.position.set(8, 8, 8);
      controlsRef.current.target.set(0, 1, 0);
    }
  }, []);

  useFrame(() => {
    if (avatarRef.current && controlsRef.current) {
      const avatar = avatarRef.current;
      controlsRef.current.target.set(
        avatar.position.x,
        avatar.position.y + 1,
        avatar.position.z
      );
    }
  });

  return (
    <>
      <color attach="background" args={['#1B2A4A']} />
      <fog attach="fog" args={['#1B2A4A', 5, 30]} />
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8}
        color="#FFFFFF"
      />
      
      <Text
        position={[0, 4, -10]}
        fontSize={4}
        color="#4A90E2"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/dancingscript/v24/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7BMSo3ROp6.woff"
        maxWidth={100}
        outlineWidth={0.1}
        outlineColor="#1B2A4A"
      >
        Calm
      </Text>

      <OrbitControls 
        ref={controlsRef}
        maxPolarAngle={Math.PI / 2.1} 
        minDistance={5}
        maxDistance={25}
      />
      <Environment />
      <MeditationSpots avatarRef={avatarRef} />
      <Avatar ref={avatarRef} />
    </>
  );
}

export default Scene;