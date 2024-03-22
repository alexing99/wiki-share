/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";

function Carousel({
  rootPost,
  currentPost,
  currentChildren,
  currentChildLevel,
  onNextButtonClick,
  onPrevButtonClick,
  onUpClick,
  onDownClick,
}) {
  const [atRoot, setAtRoot] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [atEldest, setAtEldest] = useState(false);
  const [atNewest, setAtNewest] = useState(false);

  useEffect(() => {
    if (currentPost._id === rootPost._id) {
      setAtRoot(true);
      setAtEldest(true);
      setAtNewest(true);
    } else {
      setAtRoot(false);
      setAtEldest(false);
      setAtNewest(false);
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

    if (currentChildren?.length === currentChildLevel + 1) {
      setAtNewest(true);
      console.log("at eldest boy");
    }

    if (currentChildLevel === 0) {
      setAtEldest(true);
      console.log("at youngest boy");
    }
  }, [currentPost, rootPost, currentChildLevel, currentChildren]);

  if (!currentPost) {
    currentPost = rootPost;
  }
  console.log("currenpost", currentPost);

  // const [touchStartX, setTouchStartX] = useState(0);
  // const [touchEndX, setTouchEndX] = useState(0);

  // useEffect(() => {
  //   const handleSwipe = () => {
  //     const deltaX = touchEndX - touchStartX;
  //     const deltaY = Math.abs(touchEndX - touchStartX);

  //     if (deltaY < 50) {
  //       // Adjust this threshold according to your preference
  //       if (deltaX > 50) {
  //         onPrevButtonClick(currentPost);
  //       } else if (deltaX < -50) {
  //         onNextButtonClick(currentPost._id);
  //       }
  //     }
  //   };

  //   if (touchStartX && touchEndX) {
  //     handleSwipe();
  //   }
  // }, [
  //   touchStartX,
  //   touchEndX,
  //   currentPost,
  //   onNextButtonClick,
  //   onPrevButtonClick,
  // ]);

  // const handleTouchStart = (event) => {
  //   setTouchStartX(event.touches[0].clientX);
  // };

  // const handleTouchMove = (event) => {
  //   setTouchEndX(event.touches[0].clientX);
  // };

  const handleNextButtonClick = () => {
    onNextButtonClick(currentPost._id);
  };
  const handlePreviousButtonClick = () => {
    onPrevButtonClick(currentPost);
  };
  //check for children and turn off next button
  //check for parent and turn off back button

  console.log(currentChildren?.length, currentChildLevel);

  return (
    <div
      className="carousel"
      // onTouchStart={handleTouchStart}
      // onTouchMove={handleTouchMove}
    >
      <h2>{currentPost.article}</h2>
      <p>{currentPost.content}</p>
      <div className="carousel-navigation">
        {!atRoot && (
          <button onClick={handlePreviousButtonClick}>Previous</button>
        )}
        {!atNewest && <button onClick={onUpClick}>/\</button>}
        {!atEldest && <button onClick={onDownClick}>\/</button>}

        {!atEnd && <button onClick={handleNextButtonClick}>Next</button>}
      </div>
    </div>
  );
}

export default Carousel;
