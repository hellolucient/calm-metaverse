import React from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import Scene from './components/Scene';
import UI from './components/UI';
import './App.css';

function App() {
  return (
    <div className="app">
      <KeyboardControls
        map={[
          { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
          { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
          { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
          { name: 'right', keys: ['ArrowRight', 'KeyD'] },
        ]}
      >
        <Canvas>
          <Scene />
        </Canvas>
      </KeyboardControls>
      <UI />
    </div>
  );
}

export default App;