
import './App.css';
import {  Route , Routes } from 'react-router-dom';
import Homepage from './userinterface/Homepage';
import Room from './userinterface/Room';

function App() {
  return (
   
    <div className="App">
       <Routes>
      <Route path='/' element={<Homepage/>} /> 
      <Route path='/room/:id' element={<Room/>} /> 
      </Routes>
   
    </div>
    
  );
}

export default App;
