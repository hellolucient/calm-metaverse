import React from 'react';

function Forest() {
  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1B2A4A" />
      </mesh>
      
      {/* Trees */}
      {[...Array(20)].map((_, i) => {
        const x = Math.random() * 50 - 25;
        const z = Math.random() * 50 - 25;
        return (
          <group key={i} position={[x, 0, z]}>
            {/* Tree trunk */}
            <mesh position={[0, 2, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 4]} />
              <meshStandardMaterial color="#2C3E50" />
            </mesh>
            {/* Tree top */}
            <mesh position={[0, 5, 0]}>
              <coneGeometry args={[2, 4]} />
              <meshStandardMaterial color="#34495E" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default Forest;