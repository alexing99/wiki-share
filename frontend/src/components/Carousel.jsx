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
  const [currentParent, setCurrentParent] = useState();

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

  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [touchEndY, setTouchEndY] = useState(null);

  const handleTouchStart = (event) => {
    const touches = event.touches;
    console.log("touch");
    if (touches && touches.length === 2) {
      // Store the coordinates of the two touch points
      setTouchStartX(touches[0].clientX);
      setTouchStartY(touches[0].clientY);
      setTouchEndX(touches[1].clientX);
      setTouchEndY(touches[1].clientY);
    }
  };

  const handleTouchMove = (event) => {
    const touches = event.touches;
    if (touches && touches.length === 2) {
      // Update the coordinates of the two touch points as they move
      setTouchEndX(touches[0].clientX);
      setTouchEndY(touches[0].clientY);
      setTouchStartX(touches[1].clientX);
      setTouchStartY(touches[1].clientY);
    }
  };

  const handleTouchEnd = () => {
    // Calculate the horizontal and vertical distances traveled by the fingers
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Determine the direction of the swipe based on the distances
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 0) {
        // Swipe to the right
        onNextButtonClick();
      } else {
        // Swipe to the left
        onPrevButtonClick();
      }
    } else {
      // Vertical swipe
      if (deltaY > 0) {
        // Swipe down
        onDownClick();
      } else {
        // Swipe up
        onUpClick();
      }
    }

    // Reset touch coordinates
    setTouchStartX(null);
    setTouchStartY(null);
    setTouchEndX(null);
    setTouchEndY(null);
  };

  const handleNextButtonClick = () => {
    onNextButtonClick(currentPost._id);
  };
  const handlePreviousButtonClick = () => {
    onPrevButtonClick(currentPost);
  };
  //check for children and turn off next button
  //check for parent and turn off back button

  console.log(currentChildren?.length, currentChildLevel);

  useEffect(() => {
    fetchParentPost(currentPost.parentPost);
  }, [currentPost]);

  const fetchParentPost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:4578/posts/${postId}`, {
        method: "GET",
      });

      if (response.ok) {
        const parentPost = await response.json();
        setCurrentParent(parentPost);
      } else {
        const error = await response.json();
        console.error("Error retrieving parent post:", error);
        return null;
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const formattedTimestamp = new Date(currentPost.timestamp).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  );

  return (
    <div
      className="carousel"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="article-headers">
        {!atRoot && (
          <div>
            {" "}
            <h3>{rootPost.article}</h3>
            <p>...</p>
            <h2>{currentParent?.article}</h2>
          </div>
        )}

        <h1>{currentPost.article}</h1>
      </div>
      <p>{currentPost.content}</p>
      <p>{currentPost.author}</p>
      <p>{formattedTimestamp}</p>
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
