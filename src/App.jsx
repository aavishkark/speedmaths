import { useState } from "react";
export const Home = () => {
  const [content, setContent] = useState("Welcome to the Home page!");

  const navbarStyle = {
    display: "flex",
    justifyContent: "space-around",
    backgroundColor: "#f0f0f0",
    padding: "10px",
    cursor: "pointer",
    fontSize: "20px",
  }

  const multiplescontent = () => {
    return (
      <div>
        <h2>Multiples</h2>
        <p>Content for Multiples goes here.</p>
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
    switch(e.target.innerText) {
      case "Multiples":
        setContent(multiplescontent());
        break;
      case "Cubes":
        setContent(cubescontent());
        break;
      case "Squares":
        setContent(squarescontent());
        break;
      case "Fractions":
        setContent(fractionscontent());
        break;
      case "Percentages":
        setContent(percentagescontent());
        break;
      default:
        setContent("oops something went wrong ,please refresh the page");
    }
    console.log(content);
  }
  return (
    <div>
      <div className="navbar" style={ navbarStyle }>
          <div onClick={onClick}>Multiples</div>
          <div onClick={onClick}>Cubes</div>
          <div onClick={onClick}>Squares</div>
          <div onClick={onClick}>Fractions</div>
          <div onClick={onClick}>Percentages</div>
      </div>
      <div className="content">
        <h2>{content}</h2>
      </div>
    </div>
  );
}