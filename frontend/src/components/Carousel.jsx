/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";

import Cookies from "universal-cookie";

function Carousel({
  rootPost,
  currentPost,
  setCurrentPost,
  currentChildren,
  currentChildLevel,
  onNextButtonClick,
  onPrevButtonClick,
  onUpClick,
  onDownClick,
  goToPost,
}) {
  const [atRoot, setAtRoot] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [atEldest, setAtEldest] = useState(false);
  const [atNewest, setAtNewest] = useState(false);
  const [currentParent, setCurrentParent] = useState();

  const [hasVotedInterest, setHasVotedInterest] = useState(false);
  const [hasVotedRelevance, setHasVotedRelevance] = useState(false);
  // const [currentUserRef, setCurrentUserRef] = useState(null);
  const [currentUser, setCurrentUser] = useState();

  // useEffect(() => {
  //   setCurrentUserRef(currentUser); // Store reference on component mount
  // }, [currentUser]);

  // useEffect(() => {
  //   setCurrentUser(useUser);
  // }, [currentPost]);

  //Couldn't get it to work with userContext but this works fine considering it'd have to re-fetch anyway
  const getUserData = async () => {
    const cookies = new Cookies();
    const token = cookies.get("token");

    const tokenArray = token.split(".");
    const payload = tokenArray[1];

    const decodedPayload = JSON.parse(atob(payload));

    const userId = decodedPayload.id;
    try {
      const response = await fetch(`http://localhost:4578/users/${userId}`, {
        method: "GET",
      });

      if (response.ok) {
        console.log("user information retreived!");
        const data = await response.json();
        setCurrentUser(data);
      } else {
        const error = await response.json();
        console.error("Error retreiving user information:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Check if the current user has voted for interest on the current post
  useEffect(() => {
    getUserData();
    console.log("why", currentUser?.interestedIn);
    if (currentUser?.interestedIn?.includes(currentPost._id)) {
      setHasVotedInterest(true);
      console.log("interested already");
    } else {
      setHasVotedInterest(false);
      console.log("not interested");
    }

    // Check if the current user has voted for relevance on the current post
    if (currentUser?.foundRelevant?.includes(currentPost._id)) {
      setHasVotedRelevance(true);
      console.log("relevanted already");
    } else {
      setHasVotedRelevance(false);
      console.log("not relevant");
    }
  }, []);

  useEffect(() => {
    console.log("oooh");
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
    }

    if (currentChildLevel === 0) {
      setAtEldest(true);
    }
  }, [currentPost, rootPost, currentChildLevel, currentChildren]);

  if (!currentPost) {
    currentPost = rootPost;
  }

  const handleNextButtonClick = () => {
    onNextButtonClick(currentPost._id);
  };
  const handlePreviousButtonClick = () => {
    onPrevButtonClick(currentPost);
  };

  const handleRootPostClick = () => {
    goToPost(rootPost._id);
  };

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
  const handleInterest = async () => {
    try {
      if (!hasVotedInterest) {
        const response = await fetch(
          `http://localhost:4578/posts/${currentPost._id}/score/?vote=interest&action=up`,
          {
            method: "PATCH",
          }
        );
        if (response.ok) {
          console.log("post updated succesfully");
          try {
            const response = await fetch(
              `http://localhost:4578/users/${currentUser._id}/score/?post=${currentPost._id}&action=add&field=interest`,
              {
                method: "PATCH",
              }
            );

            if (response.ok) {
              console.log("User updated");
              setHasVotedInterest(true);
              setCurrentPost({
                ...currentPost,
                interestScore: currentPost.interestScore + 1,
              });

              // Refresh user information after successful update
            } else {
              const error = await response.json();
              console.error("Error updating user:", error);
            }
          } catch (error) {
            console.error("Error:", error);
          }
        } else {
          const error = await response.json();
          console.error("Error retrieving parent post:", error);
          return null;
        }
      } else if (hasVotedInterest) {
        const response = await fetch(
          `http://localhost:4578/posts/${currentPost._id}/score/?vote=interest&action=down`,
          {
            method: "PATCH",
          }
        );
        if (response.ok) {
          console.log("post updated succesfully");
          try {
            const response = await fetch(
              `http://localhost:4578/users/${currentUser._id}/score/?post=${currentPost._id}&action=remove&field=interest`,
              {
                method: "PATCH",
              }
            );

            if (response.ok) {
              console.log("User updated");
              setHasVotedInterest(false);
              setCurrentPost({
                ...currentPost,
                interestScore: currentPost.interestScore - 1,
              });

              // Refresh user information after successful update
            } else {
              const error = await response.json();
              console.error("Error updating user:", error);
            }
          } catch (error) {
            console.error("Error:", error);
          }
        } else {
          const error = await response.json();
          console.error("Error retrieving parent post:", error);
          return null;
        }
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const handleRelevance = async () => {
    try {
      if (!hasVotedRelevance) {
        const response = await fetch(
          `http://localhost:4578/posts/${currentPost._id}/score/?vote=relevance&action=up`,
          {
            method: "PATCH",
          }
        );
        if (response.ok) {
          console.log("post updated succesfully");
          try {
            const response = await fetch(
              `http://localhost:4578/users/${currentUser._id}/score/?post=${currentPost._id}&action=add&field=relevance`,
              {
                method: "PATCH",
              }
            );

            if (response.ok) {
              console.log("User updated");
              setHasVotedRelevance(true);
              setCurrentPost({
                ...currentPost,
                relevancyScore: currentPost.relevancyScore + 1,
              });
              // Refresh user information after successful update
            } else {
              const error = await response.json();
              console.error("Error updating user:", error);
            }
          } catch (error) {
            console.error("Error:", error);
          }
        } else {
          const error = await response.json();
          console.error("Error retrieving parent post:", error);
          return null;
        }
      } else if (hasVotedRelevance) {
        const response = await fetch(
          `http://localhost:4578/posts/${currentPost._id}/score/?vote=relevance&action=down`,
          {
            method: "PATCH",
          }
        );
        if (response.ok) {
          console.log("post updated succesfully");
          try {
            const response = await fetch(
              `http://localhost:4578/users/${currentUser._id}/score/?post=${currentPost._id}&action=remove&field=relevance`,
              {
                method: "PATCH",
              }
            );

            if (response.ok) {
              console.log("User updated");
              setHasVotedRelevance(false);
              setCurrentPost({
                ...currentPost,
                relevancyScore: currentPost.relevancyScore - 1,
              });
              // Refresh user information after successful update
            } else {
              const error = await response.json();
              console.error("Error updating user:", error);
            }
          } catch (error) {
            console.error("Error:", error);
          }
        } else {
          const error = await response.json();
          console.error("Error retrieving parent post:", error);
          return null;
        }
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  return (
    <div className="carousel">
      <div className="article-headers">
        {!atRoot && (
          <div>
            {" "}
            <a href="#" onClick={() => handleRootPostClick()}>
              {rootPost.article}
            </a>
            <p>...</p>
            <a href="#" onClick={() => handlePreviousButtonClick()}>
              {currentParent?.article}
            </a>
          </div>
        )}

        <h1>{currentPost.article}</h1>
      </div>
      <p>{currentPost.content}</p>
      <p>{currentPost.author}</p>
      <p>{formattedTimestamp}</p>
      {!hasVotedInterest && (
        <button onClick={handleInterest}>Oh Interesting</button>
      )}
      {hasVotedInterest && <button onClick={handleInterest}>Interested</button>}
      <p>Interest: {currentPost.interestScore}</p>{" "}
      {!hasVotedRelevance && (
        <button onClick={handleRelevance}>Relevant</button>
      )}
      {hasVotedRelevance && (
        <button onClick={handleRelevance}>Irrelevant</button>
      )}
      <p>Relevance: {currentPost.relevancyScore}</p>
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
