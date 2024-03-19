/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";

function Carousel({
  rootPost,
  currentPost,
  //   currentLevel,
  onNextButtonClick,
  onPrevButtonClick,
}) {
  const [atRoot, setAtRoot] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    if (currentPost._id === rootPost._id) {
      setAtRoot(true);
    } else {
      setAtRoot(false);
    }

    if (
      currentPost &&
      currentPost.children &&
      currentPost.children.length === 0
    ) {
      setAtEnd(true);
    } else {
      setAtEnd(false);
    }
  }, [currentPost, rootPost]);

  if (!currentPost) {
    currentPost = rootPost;
  }

  const handleNextButtonClick = () => {
    onNextButtonClick(currentPost._id);
  };
  const handlePreviousButtonClick = () => {
    onPrevButtonClick(currentPost);
  };
  //check for children and turn off next button
  //check for parent and turn off back button

  return (
    <div className="carousel">
      <h2>{currentPost.article}</h2>
      <p>{currentPost.content}</p>
      <div className="carousel-navigation">
        {!atRoot && (
          <button onClick={handlePreviousButtonClick}>Previous</button>
        )}

        {!atEnd && <button onClick={handleNextButtonClick}>Next</button>}
      </div>
    </div>
  );
}

export default Carousel;
