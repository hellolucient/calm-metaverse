import React, { useState, useRef, useEffect } from 'react';
import nipplejs from 'nipplejs';

// Import the audio functions
import { playAudioWithFadeIn, stopAudioWithFadeOut } from './MeditationSpots';

function UI() {
  const joystickRef = useRef(null);
  const joystickContainerRef = useRef(null);
  const [showHomeButton, setShowHomeButton] = useState(false);
  const lastPositionRef = useRef({ x: 0, z: 0 });
  const checkIntervalRef = useRef(null);

  // Function to return avatar to starting position
  const returnHome = () => {
    if (window.avatarRef && window.avatarRef.current) {
      window.avatarRef.current.position.x = 0;
      window.avatarRef.current.position.z = 0;
      setShowHomeButton(false);
    }
  };

  // Check if avatar is far from meditation spots
  useEffect(() => {
    const checkPosition = () => {
      if (window.avatarRef && window.avatarRef.current) {
        const pos = window.avatarRef.current.position;
        const meditationSpots = [
          { x: 5, z: 5 },
          { x: -5, z: -5 },
          { x: 10, z: -10 }
        ];

        // Check distance to all meditation spots
        const nearSpot = meditationSpots.some(spot => {
          const distance = Math.sqrt(
            Math.pow(pos.x - spot.x, 2) + 
            Math.pow(pos.z - spot.z, 2)
          );
          return distance < 15; // Show button if not near any spot
        });

        setShowHomeButton(!nearSpot);
      }
    };

    checkIntervalRef.current = setInterval(checkPosition, 2000);
    return () => clearInterval(checkIntervalRef.current);
  }, []);

  useEffect(() => {
    if ('ontouchstart' in window && joystickContainerRef.current) {
      joystickRef.current = nipplejs.create({
        zone: joystickContainerRef.current,
        mode: 'static',
        position: { left: '100px', bottom: '100px' },
        color: 'white',
        size: 120,
        fadeTime: 0,
        multitouch: false,
        maxNumberOfNipples: 1,
        threshold: 0.3,
        restOpacity: 0.5
      });

      // Add directional indicators
      const container = joystickContainerRef.current;
      const arrows = [
        { transform: 'rotate(0deg)', text: '→' },
        { transform: 'rotate(90deg)', text: '→' },
        { transform: 'rotate(180deg)', text: '→' },
        { transform: 'rotate(270deg)', text: '→' }
      ];

      arrows.forEach(({ transform, text }) => {
        const arrow = document.createElement('div');
        arrow.textContent = text;
        arrow.style.position = 'absolute';
        arrow.style.top = '50%';
        arrow.style.left = '50%';
        arrow.style.transform = `translate(-50%, -50%) ${transform}`;
        arrow.style.color = 'rgba(255,255,255,0.3)';
        arrow.style.fontSize = '24px';
        arrow.style.pointerEvents = 'none';
        container.appendChild(arrow);
      });

      // Prevent text selection
      container.style.userSelect = 'none';
      container.style.webkitUserSelect = 'none';
      container.style.msUserSelect = 'none';

      // Emit keyboard events based on joystick movement with reduced frequency
      let lastEmitTime = 0;
      joystickRef.current.on('move', (evt, data) => {
        const now = Date.now();
        if (now - lastEmitTime > 50) { // Throttle to every 50ms
          const angle = data.angle.degree;
          window.dispatchEvent(new KeyboardEvent('keydown', { key: getKeyFromAngle(angle) }));
          lastEmitTime = now;
        }
      });

      joystickRef.current.on('end', () => {
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].forEach(key => {
          window.dispatchEvent(new KeyboardEvent('keyup', { key }));
        });
      });
    }

    return () => {
      if (joystickRef.current) {
        joystickRef.current.destroy();
      }
    };
  }, []);

  const getKeyFromAngle = (angle) => {
    if (angle >= 315 || angle < 45) return 'ArrowRight';
    if (angle >= 45 && angle < 135) return 'ArrowUp';
    if (angle >= 135 && angle < 225) return 'ArrowLeft';
    return 'ArrowDown';
  };

  return (
    <>
      {/* Only show joystick container on touch devices */}
      {'ontouchstart' in window && (
        <div 
          ref={joystickContainerRef} 
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            width: '200px',
            height: '200px',
            zIndex: 1000,
            opacity: 0.7,
            touchAction: 'none'
          }}
        />
      )}

      {/* Home button */}
      {showHomeButton && (
        <button
          onClick={returnHome}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '10px 20px',
            backgroundColor: 'rgba(74, 144, 226, 0.7)',
            border: 'none',
            borderRadius: '5px',
            color: 'white',
            cursor: 'pointer',
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            zIndex: 1000,
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(74, 144, 226, 0.9)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(74, 144, 226, 0.7)'}
        >
          Return Home
        </button>
      )}
    </>
  );
}

export default UI;