import React from 'react';
import './App.css';

import Header from './components/Header';
import Home from './components/Home';
import Matchmaking from './components/Matchmaking';

function App() {
  return (
    <div className="App">
      <Header/>
      <Home name='SASKIA'/>
      <Matchmaking/>
    </div>
  );
}

export default App;
