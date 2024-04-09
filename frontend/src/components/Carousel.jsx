/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import Cookies from "universal-cookie";
import Tree from "../components/Tree";
import { calculateDepth } from "../components/calculateDepth";
import PostCreation from "../pages/PostCreatePage";
import "../styles/carousel.css";

function Carousel({
  rootPost,
  // currentPost,
  // setCurrentPost,
  // currentChildren,
  // currentChildLevel,
  // onNextButtonClick,
  // onPrevButtonClick,
  // onUpClick,
  // onDownClick,
  // goToPost,
}) {
  const [atRoot, setAtRoot] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [atLast, setAtLast] = useState(false);
  const [atFirst, setAtFirst] = useState(false);
  const [currentParent, setCurrentParent] = useState(useUser());

  const [hasVotedInterest, setHasVotedInterest] = useState(false);
  const [hasVotedRelevance, setHasVotedRelevance] = useState(false);

  const [currentUser, setCurrentUser] = useState();

  const [currentPost, setCurrentPost] = useState(null);
  const [currentChildren, setCurrentChildren] = useState([]);
  const [currentChildLevel, setCurrentChildLevel] = useState();
  const [showPostCreation, setShowPostCreation] = useState(false); // State to manage PostCreation vi
  const [selectedArticle, setSelectedArticle] = useState(null); // State to store selected article\
  const [sort, setSort] = useState("New");
  //
  const goToPost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:4578/posts/${postId}`, {
        method: "GET",
      });

      if (response.ok) {
        const postData = await response.json();
        setCurrentPost(postData);
        setShowPostCreation(false); // Hide post creation when navigating to a new post
      } else {
        console.error("Failed to fetch post data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching post data:", error);
    }
  };

  // const handleNextButtonClick = async (postid) => {
  //   if (postid) {
  //     await fetchChildrenData(postid);
  //   }
  // };
  // const handlePrevButtonClick = async (postid) => {
  //   const parent = postid.parentPost;
  //   try {
  //     await fetchParentPostForBack(parent);

  //     // await fetchChildrenData(parent.parentPost, true);
  //   } catch (error) {
  //     console.error(`Error:`, error);
  //   }
  //   console.log("back");
  // };

  const handleUpClick = () => {
    console.log("up");
    const prevSibling = currentChildren[currentChildLevel - 1];
    setCurrentPost(prevSibling);
    setCurrentChildLevel(currentChildLevel - 1);
    setShowPostCreation(false);
  };
  const handleDownClick = () => {
    console.log("down");
    const nextSibling = currentChildren[currentChildLevel + 1];
    setCurrentPost(nextSibling);
    setCurrentChildLevel(currentChildLevel + 1);
    setShowPostCreation(false);
  };

  const fetchChildrenData = async (post, isCalledfromPrevClick) => {
    try {
      const response = await fetch(
        `http://localhost:4578/posts/${post}/children`
      );

      if (response.ok) {
        const data = await response.json();
        let sortedData;
        switch (sort) {
          case "New":
            sortedData = data
              .slice()
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            break;
          case "Relevancy":
            sortedData = data
              .slice()
              .sort((a, b) => b.relevancyScore - a.relevancyScore);
            console.log(sortedData, "sorted by relevancy score");
            break;
          case "Interest":
            sortedData = data
              .slice()
              .sort((a, b) => b.interestScore - a.interestScore);
            console.log(sortedData, "sorted by interest score");
            break;
          case "Length":
            // Map each post to a Promise calculating its depth
            // eslint-disable-next-line no-case-declarations
            const depthPromises = data.map((post) => calculateDepth(post));
            // Wait for all depth calculations to finish
            Promise.all(depthPromises).then((depths) => {
              // Sort posts based on depth
              sortedData = data
                .slice()
                .sort(
                  (a, b) => depths[data.indexOf(b)] - depths[data.indexOf(a)]
                );
              console.log(sortedData, "sorted by length");

              // Once sorting is done, update state or perform other operations
              if (!isCalledfromPrevClick) {
                setCurrentPost(sortedData[0]);
                setCurrentChildLevel(0);
              }
              setCurrentChildren(sortedData);
            });
            break;
          default:
            console.error("Invalid sort option");
        }

        if (sort != "Length") {
          if (!isCalledfromPrevClick) {
            setCurrentPost(sortedData[0]);
            setCurrentChildLevel(0);
          }

          setCurrentChildren(sortedData);
        }
        console.log("children got");
        return sortedData;
      } else {
        console.error(`Failed to fetch descendants for post ${post}`);
      }
    } catch (error) {
      console.error(`Error fetching descendants for post ${post}:`, error);
    }
  };
  const fetchParentPostForBack = async (postId) => {
    try {
      const response = await fetch(`http://localhost:4578/posts/${postId}`, {
        method: "GET",
      });

      if (response.ok) {
        const parentPost = await response.json();
        setCurrentPost(parentPost);
        console.log("Parent post retrieved!");
        if (parentPost.children.length != 0) {
          try {
            const children = await fetchChildrenData(
              parentPost.parentPost,
              true
            );
            setCurrentChildren(children);
            const parentIndex = children.findIndex(
              (child) => child._id === parentPost._id
            );
            console.log(currentChildren, "see");
            if (parentIndex !== -1) {
              setCurrentChildLevel(parentIndex);
              console.log(parentIndex, "hmmmmmmm");
            } else {
              console.error(
                "Parent post not found in the current children array"
              );
            }
          } catch (error) {
            console.error(error);
          }

          // return parentPostData;
        }
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

  const preToggle = (rootPost) => {
    if (currentPost === null) {
      setCurrentPost(rootPost);
    }
    toggleDetails();
  };

  const toggleDetails = async () => {
    console.log("k", currentPost);
    setShowPostCreation(!showPostCreation); // Toggle PostCreation visibility
    setSelectedArticle(currentPost.article); // Store selected article
  };

  //

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
    } else {
      setHasVotedRelevance(false);
    }
  }, []);

  useEffect(() => {
    if (currentPost._id === rootPost._id) {
      setAtRoot(true);
      setAtLast(true);
      setAtFirst(true);
    } else {
      setAtRoot(false);
      setAtLast(false);
      setAtFirst(false);
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
      setAtLast(true);
    }

    if (currentChildLevel === 0) {
      setAtFirst(true);
    }
  }, [currentPost, rootPost, currentChildLevel, currentChildren]);

  if (!currentPost) {
    setCurrentPost(rootPost);
  }

  const handleNextButtonClick = async () => {
    await fetchChildrenData(currentPost._id);
  };

  const handlePreviousButtonClick = async () => {
    const parent = currentPost.parentPost;
    try {
      await fetchParentPostForBack(parent);

      // await fetchChildrenData(parent.parentPost, true);
    } catch (error) {
      console.error(`Error:`, error);
    }
    console.log("back");
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

  const formattedTimestamp = new Date(
    currentPost?.timestamp
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
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
  const handleSort = (event) => {
    setSort(event.target.value);
  };
  useEffect(() => {
    // Fetch root posts when component mounts
    fetchChildrenData(currentPost?.parentPost);
  }, [sort]);

  return (
    <div className="carousel">
      <div className="post-headers">
        {!atRoot && (
          <div className="ancestor-headers">
            <a href="#" onClick={() => handleRootPostClick()}>
              {rootPost.article}
            </a>
            <a>...</a>
            <a href="#" onClick={() => handlePreviousButtonClick()}>
              {currentParent?.article}
            </a>
          </div>
        )}
        <div className="sort-dropdown">
          <label htmlFor="dropdown">Sort By:</label>
          <select id="dropdown" onChange={handleSort}>
            <option value="New">New</option>
            <option value="Length">Longest Route</option>
            <option value="Relevancy">Relevancy</option>
            <option value="Interest">Interest</option>
          </select>
        </div>
        <Tree rootPost={rootPost} currentPost={currentPost}></Tree>
      </div>{" "}
      <h1>{currentPost?.article}</h1>
      <img src={currentPost?.image} alt="" height="100px" />{" "}
      <p>{currentPost?.content}</p>
      <div className="post-details">
        <p>{currentPost?.author}</p>
        <p>{formattedTimestamp}</p>
      </div>
      <div className="voting-info">
        {!hasVotedInterest && (
          <button onClick={handleInterest}>Oh Interesting</button>
        )}
        {hasVotedInterest && (
          <button onClick={handleInterest}>Interested</button>
        )}
        <p>Interest: {currentPost?.interestScore}</p>{" "}
        {!hasVotedRelevance && (
          <button onClick={handleRelevance}>Relevant</button>
        )}
        {hasVotedRelevance && (
          <button onClick={handleRelevance}>Irrelevant</button>
        )}
        <p>Relevance: {currentPost?.relevancyScore}</p>
      </div>
      <div className="carousel-navigation">
        {!atRoot && <button onClick={handlePreviousButtonClick}>Back</button>}
        {!atFirst && <button onClick={handleUpClick}>/\</button>}
        {!atLast && <button onClick={handleDownClick}>\/</button>}

        {!atEnd && <button onClick={handleNextButtonClick}>Next</button>}
      </div>
      <button onClick={() => preToggle(rootPost)}>Show Article</button>
      <div
        id={`details-${currentPost?.article}`}
        style={{
          width: "700px",
          height: "1500px",
          backgroundColor: "lightgray",
          overflow: "auto",
          border: "solid",
          display:
            showPostCreation && currentPost.article === selectedArticle
              ? "block"
              : "none", // Conditionally show/hide the details div based on showPostCreation state and selected article
        }}
      >
        {showPostCreation && currentPost.article === selectedArticle && (
          <PostCreation parentPost={currentPost} goToPost={goToPost} />
        )}
      </div>
    </div>
  );
}

export default Carousel;
