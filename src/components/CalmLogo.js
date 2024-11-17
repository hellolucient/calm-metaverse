import React from 'react';
import { Shape, ExtrudeGeometry } from 'three';

function CalmLogo() {
  const shape = new Shape();
  
  // Starting point for 'C'
  shape.moveTo(0, 2);
  
  // Draw the 'C' with a more open top
  shape.bezierCurveTo(-0.2, 2, -0.4, 1.8, -0.5, 1.6);  // More gentle curve at top
  shape.bezierCurveTo(-0.8, 1.2, -0.8, 0.8, -0.5, 0.4);  // Body of the C
  shape.bezierCurveTo(-0.3, 0.1, 0, 0, 0.3, 0);  // Bottom of C
  
  // Connect to 'a'
  shape.bezierCurveTo(0.5, 0.2, 0.6, 0.5, 0.7, 0.8);
  
  // Draw the 'a'
  shape.bezierCurveTo(0.8, 1.1, 0.9, 1.3, 1.1, 1.3);
  shape.bezierCurveTo(1.3, 1.3, 1.4, 1.2, 1.5, 1.0);
  
  // Connect to 'l'
  shape.bezierCurveTo(1.6, 0.8, 1.7, 0.6, 1.8, 0.5);
  
  // Draw the 'l'
  shape.bezierCurveTo(1.9, 0.4, 2.0, 0.3, 2.1, 0.4);
  shape.bezierCurveTo(2.2, 0.5, 2.3, 0.6, 2.4, 0.7);
  
  // Draw the 'm'
  shape.bezierCurveTo(2.5, 0.8, 2.6, 0.9, 2.8, 0.8);
  shape.bezierCurveTo(3.0, 0.7, 3.1, 0.5, 3.2, 0.3);
  shape.bezierCurveTo(3.3, 0.2, 3.4, 0.1, 3.5, 0.2);
  shape.bezierCurveTo(3.6, 0.3, 3.7, 0.4, 3.8, 0.3);
  shape.bezierCurveTo(3.9, 0.2, 4.0, 0.1, 4.1, 0);

  const extrudeSettings = {
    steps: 2,
    depth: 0.5,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 3
  };

  return (
    <mesh position={[0, 5, -15]} scale={[5, 5, 5]} rotation={[0, 0, 0]}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial 
        color="#FFFFFF"
        metalness={0}
        roughness={0}
        emissive="#FFFFFF"
        emissiveIntensity={2}
      />
    </mesh>
  );
}

export default CalmLogo; 