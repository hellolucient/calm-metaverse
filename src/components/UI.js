import React, { useState, useRef, useEffect } from 'react';
import nipplejs from 'nipplejs';

// Import the audio functions
import { playAudioWithFadeIn, stopAudioWithFadeOut } from './MeditationSpots';

function UI() {
  const [isMeditating, setIsMeditating] = useState(false);
  const [duration, setDuration] = useState(5);
  const timerRef = useRef(null);
  const joystickRef = useRef(null);
  const joystickContainerRef = useRef(null);

  useEffect(() => {
    // Only create joystick on touch devices
    if ('ontouchstart' in window && joystickContainerRef.current) {
      joystickRef.current = nipplejs.create({
        zone: joystickContainerRef.current,
        mode: 'static',
        position: { left: '100px', bottom: '100px' },
        color: 'white',
        size: 120,
        fadeTime: 0
      });

      // Emit keyboard events based on joystick movement
      joystickRef.current.on('move', (evt, data) => {
        const angle = data.angle.degree;
        window.dispatchEvent(new KeyboardEvent('keydown', { key: getKeyFromAngle(angle) }));
      });

      joystickRef.current.on('end', () => {
        // Clear all movement when joystick is released
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

  const startMeditation = () => {
    setIsMeditating(true);
    // Start playing meditation music
    playAudioWithFadeIn();
    
    timerRef.current = setTimeout(() => {
      endMeditation();
    }, duration * 60 * 1000);
  };

  const endMeditation = () => {
    setIsMeditating(false);
    // Stop music when meditation ends
    stopAudioWithFadeOut();
    // Clear the timeout
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <>
      <div className="ui-overlay">
        <h2>Wellness Metaverse</h2>
        {'ontouchstart' in window ? (
          <div className="controls-info">
            <p>Use the joystick to move</p>
          </div>
        ) : (
          <div className="controls-info">
            <p>Move: WASD or Arrow Keys</p>
            <p>Look: Click and Drag</p>
            <p>Zoom: Mouse Wheel</p>
          </div>
        )}
        <div className="meditation-controls">
          <select 
            value={duration} 
            onChange={(e) => setDuration(parseInt(e.target.value))}
            disabled={isMeditating}
          >
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
          </select>
          {!isMeditating ? (
            <button onClick={startMeditation}>
              Start Meditation
            </button>
          ) : (
            <button onClick={endMeditation}>
              Stop Meditation
            </button>
          )}
        </div>
      </div>
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
            opacity: 0.7
          }}
        />
      )}
    </>
  );
}

export default UI;