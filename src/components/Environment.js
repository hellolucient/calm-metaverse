import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function Environment() {
  const groupRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1B2A4A" />
      </mesh>
      
      {/* Floating abstract shapes */}
      <group ref={groupRef}>
        {[...Array(30)].map((_, i) => {
          const radius = 15 + Math.random() * 15; // Distance from center
          const theta = (i / 30) * Math.PI * 2; // Evenly spaced around circle
          const y = Math.random() * 10; // Random height
          const x = Math.cos(theta) * radius;
          const z = Math.sin(theta) * radius;
          const scale = 0.5 + Math.random() * 1.5;
          
          return (
            <group key={i} position={[x, y, z]}>
              {/* Randomly choose between different geometric shapes */}
              {Math.random() > 0.5 ? (
                // Torus
                <mesh rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
                  <torusGeometry args={[1 * scale, 0.3, 16, 32]} />
                  <meshStandardMaterial 
                    color="#4A90E2"
                    transparent
                    opacity={0.7}
                    emissive="#4A90E2"
                    emissiveIntensity={0.2}
                  />
                </mesh>
              ) : (
                // Icosahedron
                <mesh rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
                  <icosahedronGeometry args={[0.8 * scale, 0]} />
                  <meshStandardMaterial 
                    color="#5D9CEC"
                    transparent
                    opacity={0.7}
                    emissive="#5D9CEC"
                    emissiveIntensity={0.2}
                  />
                </mesh>
              )}
            </group>
          );
        })}
      </group>
    </group>
  );
}

export default Environment; 