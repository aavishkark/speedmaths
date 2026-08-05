import { useState } from "react";
import { useEffect } from "react";
export const Home = () => {
  const [content, setContent] = useState("Multiples");
  const [mode, setMode] = useState(1);
  const [answer, setAnswer] = useState("");
  const [number1, setNumber1] = useState(0);
  const [number2, setNumber2] = useState(0);
  const [result, setResult] = useState(0);
  // const [multiples, setMultiples] = useState({min:2, max:20, number1: 1, number2:1, result:1, answer: 1});

  const navbarStyle = {
    display: "flex",
    justifyContent: "space-around",
    backgroundColor: "#f0f0f0",
    padding: "10px",
    cursor: "pointer",
    fontSize: "20px",
  }

  const changeMode = () => {
    setMode(mode === 1 ? 0 : 1);
  }

  const generateRandomNumbers = () => {
    let max = 20;
    let min = 2;
    const randomNumber1 = Math.floor(Math.random() * (max - min + 1)) + min;
    const randomNumber2 = Math.floor(Math.random() * (max - min + 1)) + min;
    setNumber1(randomNumber1);
    setNumber2(randomNumber2);
    setResult(randomNumber1 * randomNumber2);
    setAnswer("");
  }

  useEffect(() => {
  if (content === "Multiples") {
    const timer = setTimeout(() => {
      generateRandomNumbers();
    }, 0);
    return () => clearTimeout(timer);
  }
}, [content]);
  const handleSubmit = () => {
    if (answer.trim() === result.toString()) {
      alert("Correct Answer!");
      generateRandomNumbers();
    } else {
      alert(`Wrong Answer! The correct answer is ${result}`);
    }
  }

  const multiplescontent = () => {    

    return (
      <div> 
        {mode === 1 ? (
          <div>
            <h2>Question to Answer</h2>
            <p>The multiples of {number1} and {number2}</p>
            <p>is <input type="number" onChange={(e) => setAnswer(e.target.value)} value={answer}/></p>
            <button onClick={handleSubmit}>Submit</button>

          </div>
        ) : (
          <div>
            <h2>Answer to Question</h2>
            <p>The multiples of {number1} and {number2} is {result}</p>
          </div>
        )}
      </div>
    );
  }

  const cubescontent = () => {
    return (
      <div>
        <h2>Cubes</h2>
        <p>Content for Cubes goes here.</p>
      </div>
    );
  }

  const squarescontent = () => {
    return (
      <div>
        <h2>Squares</h2>
        <p>Content for Squares goes here.</p>
      </div>
    );
  }

  const fractionscontent = () => {
    return (
      <div>
        <h2>Fractions</h2>
        <p>Content for Fractions goes here.</p>
      </div>
    );
  }

  const percentagescontent = () => {
    return (
      <div>
        <h2>Percentages</h2>
        <p>Content for Percentages goes here.</p>
      </div>
    );
  }

  const onClick = (e) => {
    setContent(e.target.innerText);
  }
  return (
    <div>
      <div className="navbar" style={ navbarStyle }>
          <div onClick={onClick}>Multiples</div>
          <div onClick={onClick}>Cubes</div>
          <div onClick={onClick}>Squares</div>
          <div onClick={onClick}>Fractions</div>
          <div onClick={onClick}>Percentages</div>
          <div onClick={()=>{changeMode()}}>{mode === 1 ? "Answer to Question" : "Question to Answer"}
          </div>
      </div>
      <div className="content">
        {content === "Multiples" && multiplescontent()}
        {content === "Cubes" && cubescontent()}
        {content === "Squares" && squarescontent()}
        {content === "Fractions" && fractionscontent()}
        {content === "Percentages" && percentagescontent()}
      </div>
    </div>
  );
}