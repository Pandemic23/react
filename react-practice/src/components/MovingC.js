import {useState} from 'react';
import {Link} from 'react-router-dom';
import '../css/MovingC.css';


const MovingC = () => {
    const [position , setPosition] =useState({
        x:0,
        y:0
    });
    return(
        <div
        onPointerMove={e => {
          setPosition({
            x: e.clientX,
            y: e.clientY
          });
        }}
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
        }}>
        <div style={{
          position: 'absolute',
          backgroundColor: 'greenyellow',
          borderRadius: '30%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 10,
          height: 10,
        }} />
        <button>  <Link to="/">Home</Link></button>
            
      </div>
    )
}

export default MovingC;