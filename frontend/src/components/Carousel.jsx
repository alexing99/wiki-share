/* eslint-disable react/prop-types */
// import { useState, useEffect } from "react";

function Carousel({
  rootPost,
  currentPost,
  //   currentLevel,
  onNextButtonClick,
  //   onPrevButtonClick,
}) {
  //   const [children, setChildren] = useState([]);

  if (!currentPost) {
    currentPost = rootPost;
  }
  const handleNextButtonClick = () => {
    onNextButtonClick(currentPost._id);
  };

  return (
    <div className="carousel">
      <h2>{currentPost.article}</h2>
      <p>{currentPost.content}</p>
      <div className="carousel-navigation">
        {/* {currentLevel !== 0 && (
          <button onClick={onPrevButtonClick}>Previous</button>
        )} */}
        {/* {children.length > 0 && currentLevel < children.length && ( */}
        <button onClick={handleNextButtonClick}>Next</button>
        {/* )} */}
      </div>
    </div>
  );
}

export default Carousel;
