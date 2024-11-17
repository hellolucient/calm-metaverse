import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color } from 'three';
import { Text } from '@react-three/drei';

// Create audio context outside component to avoid recreation
let audioContext;
let audioBuffer;
let audioSource;

// Load audio file
async function loadAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const response = await fetch('/sounds/meditation.mp3');
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  }
}

// Move audio functions outside and export them
export function playAudioWithFadeIn() {
  if (audioContext && audioBuffer) {
    if (audioSource) {
      audioSource.stop();
    }
    audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;
    
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 2);
    
    audioSource.connect(gainNode);
    gainNode.connect(audioContext.destination);
    audioSource.loop = true;  // Enable looping
    audioSource.start();
  }
}

export function stopAudioWithFadeOut() {
  if (audioSource) {
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
    
    audioSource.disconnect();
    audioSource.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    setTimeout(() => {
      audioSource.stop();
      audioSource = null;
    }, 1000);
  }
}

// Load audio when the component is first mounted
loadAudio();

function LightBeam({ position, color, warmupStage }) {
  const particlesRef = useRef();
  const pulseRef = useRef(0);
  const currentColorRef = useRef(new Color(color));
  const particleCount = 20;
  const particlePositions = useRef(
    [...Array(particleCount)].map(() => ({
      y: Math.random() * 20,
      x: (Math.random() - 0.5) * 1.5,
      z: (Math.random() - 0.5) * 1.5,
      speed: 2 + Math.random() * 2
    }))
  );

  // Colors for different warmup stages
  const warmupColors = {
    0: color,               // Initial spot color
    1: '#FFD700',          // Bright gold at 0.5s
    2: '#FF6B6B',          // Warm red at 1.0s
    3: '#4A90E2',          // Calm's signature blue at 1.5s
  };

  useFrame((state, delta) => {
    // Smooth color transition
    const targetColor = new Color(warmupColors[warmupStage]);
    currentColorRef.current.lerp(targetColor, delta * 3);

    // Add pulsing effect when in final stage (blue)
    let pulseValue = 1;
    if (warmupStage === 3) {
      pulseRef.current += delta;
      pulseValue = Math.sin(pulseRef.current) * 0.3 + 1; // Oscillates between 0.7 and 1.3
    }

    // Update beam and ground materials
    const beamMaterial = particlesRef.current?.parent.children[0].material;
    const groundMaterial = particlesRef.current?.parent.children[1].material;
    if (beamMaterial && groundMaterial) {
      beamMaterial.color = currentColorRef.current;
      groundMaterial.color = currentColorRef.current;
      beamMaterial.opacity = 0.3 * pulseValue;
      groundMaterial.opacity = 0.4 * pulseValue;
    }

    // Update particle materials
    if (particlesRef.current) {
      particlesRef.current.children.forEach(mesh => {
        mesh.material.color = currentColorRef.current;
        mesh.material.opacity = 0.8 * pulseValue;
      });
    }

    // Particle animation
    particlePositions.current.forEach(particle => {
      particle.y += particle.speed * delta;
      if (particle.y > 20) {
        particle.y = 0;
        particle.x = (Math.random() - 0.5) * 1.5;
        particle.z = (Math.random() - 0.5) * 1.5;
      }
    });
    if (particlesRef.current) {
      particlesRef.current.children.forEach((mesh, i) => {
        mesh.position.y = particlePositions.current[i].y;
        mesh.position.x = particlePositions.current[i].x;
        mesh.position.z = particlePositions.current[i].z;
        mesh.rotation.x += delta;
        mesh.rotation.z += delta;
      });
    }
  });

  return (
    <group position={[position[0], 0, position[2]]}>
      {/* Vertical light beam */}
      <mesh position={[0, 10, 0]}>
        <cylinderGeometry args={[0.5, 2, 20, 16, 1, true]} />
        <meshBasicMaterial 
          color={currentColorRef.current} 
          transparent={true} 
          opacity={0.3} 
          side={2}
        />
      </mesh>
      
      {/* Ground glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshBasicMaterial 
          color={currentColorRef.current} 
          transparent={true} 
          opacity={0.4}
        />
      </mesh>
      
      {/* Flowing particles */}
      <group ref={particlesRef}>
        {[...Array(particleCount)].map((_, i) => (
          <mesh key={i}>
            <octahedronGeometry args={[0.1]} />
            <meshBasicMaterial 
              color={currentColorRef.current} 
              transparent 
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* Static sparkles */}
      {[...Array(8)].map((_, i) => (
        <mesh 
          key={`sparkle-${i}`}
          position={[
            Math.sin(i * Math.PI / 4) * 1,
            3 + Math.random() * 5,
            Math.cos(i * Math.PI / 4) * 1
          ]}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial 
            color={currentColorRef.current} 
            transparent 
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Begin Meditation Text - only shows in final stage */}
      {warmupStage === 3 && (
        <Text
          position={[0, 4.5, 0]}
          fontSize={0.8}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/dancingscript/v24/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7BMSo3ROp6.woff"
          maxWidth={1.8}
          textAlign="center"
          billboard
          renderOrder={2}
          material-transparent={true}
          material-depthTest={false}
          material-opacity={0.9}
        >
          Begin{'\n'}Meditation
        </Text>
      )}
    </group>
  );
}

function Beacon({ position, color }) {
  const beaconRef = useRef();
  const particlesRef = useRef();
  const particleCount = 15;
  const particlePositions = useRef(
    [...Array(particleCount)].map(() => ({
      y: Math.random() * 10,
      radius: 0.2 + Math.random() * 0.3,
      angle: Math.random() * Math.PI * 2,
      speed: 1 + Math.random()
    }))
  );
  
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    // Create a pulsing effect using sine wave
    const pulse = Math.sin(t * 1.5) * 0.5 + 0.5; // Oscillates between 0 and 1

    // Update particles
    particlePositions.current.forEach((particle, i) => {
      particle.y += particle.speed * delta;
      if (particle.y > 10) particle.y = 0;
      
      const mesh = particlesRef.current.children[i];
      mesh.position.y = particle.y;
      mesh.position.x = Math.cos(particle.angle + t * 0.5) * particle.radius;
      mesh.position.z = Math.sin(particle.angle + t * 0.5) * particle.radius;
      mesh.material.opacity = (1 - particle.y / 10) * pulse * 0.5;
    });
  });

  return (
    <group position={[position[0], 0.1, position[2]]}>
      {/* Spiral particles */}
      <group ref={particlesRef}>
        {[...Array(particleCount)].map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial 
              color={color} 
              transparent={true} 
              opacity={0.5}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function MeditationSpots({ avatarRef }) {
  const [activeSpot, setActiveSpot] = useState(null);
  const [warmupStage, setWarmupStage] = useState(0);
  const warmupTimerRef = useRef(null);
  const audioPlayingRef = useRef(false);
  
  const spots = [
    { position: [5, 0, 5], color: '#4A90E2', activeColor: '#4FC3F7' },    // Light blue
    { position: [-5, 0, -5], color: '#81C784', activeColor: '#66BB6A' },  // Green
    { position: [10, 0, -10], color: '#BA68C8', activeColor: '#AB47BC' }, // Purple
  ];

  useEffect(() => {
    if (activeSpot !== null) {
      setWarmupStage(0);
      
      if (warmupTimerRef.current) {
        warmupTimerRef.current.forEach(timer => clearTimeout(timer));
      }

      warmupTimerRef.current = [
        setTimeout(() => {
          console.log('Stage 1 - Gold');
          setWarmupStage(1);
        }, 500),
        
        setTimeout(() => {
          console.log('Stage 2 - Red');
          setWarmupStage(2);
        }, 1000),
        
        setTimeout(() => {
          console.log('Stage 3 - Blue');
          setWarmupStage(3);
          console.log('Meditation ready to start!');
          // Start playing meditation music
          if (!audioPlayingRef.current) {
            playAudioWithFadeIn();
            audioPlayingRef.current = true;
          }
        }, 1500)
      ];
    } else {
      setWarmupStage(0);
      if (warmupTimerRef.current) {
        warmupTimerRef.current.forEach(timer => clearTimeout(timer));
      }
      // Stop music when leaving meditation spot
      if (audioPlayingRef.current) {
        stopAudioWithFadeOut();
        audioPlayingRef.current = false;
      }
    }

    return () => {
      if (warmupTimerRef.current) {
        warmupTimerRef.current.forEach(timer => clearTimeout(timer));
      }
    };
  }, [activeSpot]);

  useFrame(() => {
    if (avatarRef.current) {
      const avatarPos = avatarRef.current.position;
      let nearestSpot = null;
      spots.forEach((spot, index) => {
        const distance = Math.sqrt(
          Math.pow(avatarPos.x - spot.position[0], 2) +
          Math.pow(avatarPos.z - spot.position[2], 2)
        );
        if (distance < 1.5) {
          nearestSpot = index;
        }
      });
      
      if (nearestSpot !== activeSpot) {
        setActiveSpot(nearestSpot);
      }
    }
  });

  return (
    <group>
      {spots.map((spot, index) => (
        <group key={index}>
          <mesh position={spot.position}>
            <cylinderGeometry args={[1, 1, 0.1, 32]} />
            <meshStandardMaterial 
              color={index === activeSpot ? spot.activeColor : spot.color}
              emissive={index === activeSpot ? spot.activeColor : spot.color}
              emissiveIntensity={index === activeSpot ? 1 : 0.5}
            />
          </mesh>
          
          {/* Add beacon for inactive spots */}
          {index !== activeSpot && (
            <Beacon 
              position={spot.position} 
              color={spot.color}
            />
          )}
          
          {/* Existing LightBeam for active spot */}
          {index === activeSpot && (
            <LightBeam 
              position={spot.position} 
              color={spot.activeColor}
              warmupStage={warmupStage}
            />
          )}
        </group>
      ))}
    </group>
  );
}

export default MeditationSpots;