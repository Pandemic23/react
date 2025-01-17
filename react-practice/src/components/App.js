import {Link,useNavigate } from 'react-router-dom';
import '../css/App.css';
import { useState } from 'react';

const App=()=> {

  let [글제목] =useState(['첫번째','두번째','세번째'])


  const good = <Good/>
  const bad =<Bad/>
  const navigate = useNavigate();

  return (
    <div className="App">
      <div className='black-nav'>
        <div>Blog</div>
        </div>

        <button>
        <Link to="/MovingC">Go to MovingC</Link>
      </button>

        {글제목.map((title, index) => (
        <div className='list' key={index}>
          <Link to='/'>{title}</Link>      <div className='goodbad'> {good}{bad} </div>
          <p>작성자: @</p>
      
          <hr/>
        </div>
      ))}
    </div>
  );
}


function Good() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <p>{score}      <span onClick={() => setScore(score + 1)}>
        👍🏽
      </span></p>

    </div>
  );
}
function Bad() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <p>{score} <span onClick={() => setScore(score + 1)}>
      👎🏾
      </span></p>
     
    </div>
  );
}

export default App;



