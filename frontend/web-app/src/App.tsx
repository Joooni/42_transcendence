import React from 'react';
import Home from './components/Home'
import Header from './components/Header'
import './App.css';

function App() {
  return (
    <div className="App">
      <Header/>
      <Home name='SASKIA'/>
    </div>
  );
}

export default App;
