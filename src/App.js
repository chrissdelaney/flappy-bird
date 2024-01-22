import React from 'react';

import './App.css';
import Game from "./components/Game/Game";

function App() {
  React.useEffect(() => {
      const preventDefault = (e) => e.preventDefault();

      document.addEventListener('touchmove', preventDefault, { passive: false });

      return () => {
          document.removeEventListener('touchmove', preventDefault);
      };
  }, []);

  const appHeight = () => {
    const doc = document.documentElement
    doc.style.setProperty('--app-height', `${window.innerHeight}px`)
  }

  React.useEffect(() => {
    window.addEventListener('resize', appHeight);
    return window.removeEventListener('resize', appHeight);
  })


  return (
    <div className="page__wrapper">
      <Game />
    </div>
  );
}

export default App;
