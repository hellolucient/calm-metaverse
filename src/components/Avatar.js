import React, { forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';

const Avatar = forwardRef((props, ref) => {
  const speed = 0.15;
  const [, getKeys] = useKeyboardControls();

  useFrame(() => {
    if (!ref.current) return;

    const { forward, backward, left, right } = getKeys();
    if (forward) ref.current.position.z -= speed;
    if (backward) ref.current.position.z += speed;
    if (left) ref.current.position.x -= speed;
    if (right) ref.current.position.x += speed;
  });

  return (
    <group ref={ref}>
      {/* Avatar body */}
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.5, 1, 4, 8]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      {/* Avatar head */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#5D9CEC" />
      </mesh>
    </group>
  );
});

export default Avatar;