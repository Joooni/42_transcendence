import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom'

import Header from './Header';
import Home from './Home';
import Matchmaking from './Matchmaking';

function Main() {
  return (
    <React.Fragment>
		<Header/>

        <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/join_game'  element={<Matchmaking/>}/>
		<Route path='*' element={<Navigate to="/" replace />}/>
        </Routes>
        
    </React.Fragment>
  );
}

export default Main;