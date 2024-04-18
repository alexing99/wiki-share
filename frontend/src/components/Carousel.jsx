/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import Cookies from "universal-cookie";
import Tree from "../components/Tree";
import { calculateDepth } from "../components/calculateDepth";
import PostCreation from "../pages/PostCreatePage";
import "../styles/carousel.css";

function Carousel({ rootPost }) {
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

    // const containerElement = document.querySelector(".post-content");
    // if (containerElement) {
    //   containerElement.scrollIntoView({ behavior: "smooth", block: "start" });
    // }
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
  }, [currentPost]);

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
    setShowPostCreation(false);
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
    setShowPostCreation(false);
  };

  const handleRootPostClick = () => {
    goToPost(rootPost._id);
    setShowPostCreation(false);
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
              const interestImg = document.getElementById(
                `interestImg-${currentPost._id}`
              );
              interestImg.classList.add("animate");

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
              const interestImg = document.getElementById(
                `interestImg-${currentPost._id}`
              );
              interestImg.classList.remove("animate");

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
    console.log("rel");
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
              const relevanceImg = document.getElementById(
                `relevanceImg-${currentPost._id}`
              );
              relevanceImg.classList.add("animate");
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
              const relevanceImg = document.getElementById(
                `relevanceImg-${currentPost._id}`
              );
              relevanceImg.classList.remove("animate");
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
      </div>
      <h1>{currentPost?.article}</h1>
      <img src={currentPost?.image} alt="" height="100px" />{" "}
      <div className="content-and-vote">
        <div className="voting-info">
          <div className="interest-info">
            <svg
              width="50px"
              height="50px"
              viewBox="0 0 72 72"
              xmlns="http://www.w3.org/2000/svg"
              alt="Relevant"
              onClick={handleInterest}
              fill="white"
            >
              <g id="color">
                <path
                  fill="none"
                  stroke="none"
                  d="M31.3882,26.7177c0,0,9.2367-1.8188,8.4221-9.1964c-1.3538-12.261-1.4678-10.4237-1.4678-10.4237 l-5.5293,1.0104C32.8133,8.1081,35.9998,21.7018,31.3882,26.7177z"
                />
                <path
                  id={`interestImg-${currentPost?._id}`}
                  // className={hasVotedRelevance ? "animate" : ""}
                  fill={hasVotedRelevance ? "yellow" : "none"}
                  stroke="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  d="M34.5417,7.0359c-8.1462,0-14.75,7.496-14.75,16.7427v16.388h29.5"
                />
                <rect
                  x="26.8333"
                  y="44.5"
                  width="4"
                  height="22.095"
                  fill="white"
                  stroke="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                />
                <rect
                  x="41.3333"
                  y="44.5"
                  width="4"
                  height="16.4792"
                  fill="white"
                  stroke="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                />
                <path
                  fill="lightGray"
                  stroke="none"
                  d="M34.5417,7.5625c0,0,15.3232,0.5495,15.9047,13.875c0.9664,22.1458,0.0665,18.9191,0.0665,18.9191 l-9.3254-0.19C41.1875,40.1667,42.6247,15.125,34.5417,7.5625z"
                />
                <rect
                  x="43.3333"
                  y="40.7917"
                  width="11.8333"
                  height="3.0833"
                  fill="white"
                  stroke="none"
                />
                <rect
                  x="16.3353"
                  y="40.7917"
                  width="26.998"
                  height="3.0833"
                  fill="white"
                  stroke="none"
                />
              </g>
              <g id="hair" />
              <g id="skin" />
              <g id="skin-shadow" />
              <g id="line">
                <path
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  d="M34.5417,7.0359c-8.1462,0-14.75,7.496-14.75,16.7427v16.388h29.5"
                />
                <rect
                  x="26.8333"
                  y="44.5"
                  width="4"
                  height="22.095"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                />
                <rect
                  x="41.3333"
                  y="44.5"
                  width="4"
                  height="16.4792"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                />
                <path
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  d="M25.8125,19.0625"
                />
                <path
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  d="M35.2497,7.0359c8.1462,0,14.75,7.496,14.75,16.7427v7.388"
                />
                <polygon
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  points="16,44.5 45.5309,44.5 45.9063,44.5 56,44.5 56,40.1667 45.9063,40.1667 45.4999,40.1667 16,40.1667"
                />
              </g>
            </svg>
            {/* {hasVotedInterest && (
          <button onClick={handleInterest}>Interested</button>
        )} */}
            <p> {currentPost?.interestScore}</p>{" "}
          </div>
          <div className="relevance-info">
            <svg
              width="50px"
              height="50px"
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              id={`relevanceImg-${currentPost?._id}`}
              alt="Relevant"
              onClick={handleRelevance}
              className={hasVotedRelevance ? "animate" : ""}
            >
              <path
                d="M71.8708 189.953C76.0596 179.972 67.0124 166.184 74.2179 157.188C75.8153 155.199 122.602 153.152 125.561 155.514C136.45 164.206 111.415 193.423 144.018 201.553C171.926 208.513 155.397 160.743 162.516 157.188C171.049 152.934 188.865 158.57 198.547 157.188C226.846 153.158 203.311 181.664 211.97 193.182C217.423 200.435 261.828 185.402 250.56 219.132C244.647 236.825 226.375 230.776 216.164 235.873C211.338 238.281 215.898 272.743 215.1 272.582C205.09 270.587 157.177 275.336 158.734 276.89C168.054 286.189 186.94 229.756 144.018 235.873C133.985 237.301 125.13 246.004 123.884 255.963C123.16 261.765 125.774 278.518 125.561 278.564C113.242 281.023 100.187 277.778 86.9713 281.075C84.5867 281.671 67.5038 288.431 65.9983 286.935C63.3552 284.292 66.3776 262.486 66.8373 258.788C67.5727 252.946 65.9754 240.01 71.8708 240.01C84.7533 240.01 42.0914 251.826 29.6626 235.873C17.2337 219.92 29.6626 189.953 66.8373 198.994"
                stroke="#000000"
                strokeOpacity="0.9"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M219.962 158.69C301.398 167.678 215.1 108.884 284.641 112.13C309.301 113.281 287.258 146.158 293.857 154.973C299.085 161.97 334.878 147.654 341.615 156.653C345.643 162.039 327.578 197.327 334.074 199.496C339.004 201.142 350.98 188.742 359.204 191.096C376.15 195.952 380.691 231.713 365.907 238.979C351.123 246.245 341.747 240.521 340.777 241.5C336.129 246.154 349.597 267.685 346.642 275.102C344.754 279.832 305.714 287.83 301.398 283.503C292.4 274.481 309.369 240.976 291.344 236.459C265.56 229.998 276.039 267.893 267.046 270.902C254.301 275.16 229.326 272.582 215.1 272.582"
                stroke="#000000"
                strokeOpacity="0.9"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <p>{currentPost?.relevancyScore}</p>
          </div>
        </div>
        <div className="post-content">
          {showPostCreation && currentPost.article === selectedArticle && (
            <div
              id={`details-${currentPost?.article}`}
              className="article-window"
              style={{
                width: "800px",
                height: "260px",
                padding: "50px",
                overflow: "auto",
                border: "solid",
                borderTop: "none",
                borderBottom: "none",
                resize: "both",

                display:
                  showPostCreation && currentPost.article === selectedArticle
                    ? "block"
                    : "none", // Conditionally show/hide the details div based on showPostCreation state and selected article
              }}
            >
              {/* <button className="back-butt">Bakc</button> */}
              {showPostCreation && currentPost.article === selectedArticle && (
                <PostCreation parentPost={currentPost} goToPost={goToPost} />
              )}
            </div>
          )}
          {!showPostCreation && (
            <>
              {" "}
              <p className="article-content">{currentPost?.content}</p>
              <button onClick={() => preToggle(rootPost)}>Show Article</button>
            </>
          )}
          {showPostCreation && (
            <button onClick={() => preToggle(rootPost)}>Hide Article</button>
          )}
        </div>
      </div>
      <div className="post-details">
        <p>{currentPost?.author}</p>
        <p>{formattedTimestamp}</p>
      </div>
      <div className="carousel-navigation">
        {!atRoot && <button onClick={handlePreviousButtonClick}>Back</button>}
        <div className="up-down">
          {!atFirst && <button onClick={handleUpClick}>/\</button>}
          {!atLast && <button onClick={handleDownClick}>\/</button>}
        </div>

        {!atEnd && <button onClick={handleNextButtonClick}>Next</button>}
      </div>
      {/* <div
        id={`details-${currentPost?.article}`}
        style={{
          width: "700px",
          height: "160px",
          backgroundColor: "lightgray",
          overflow: "auto",
          border: "solid",
          resize: "both",

          display:
            showPostCreation && currentPost.article === selectedArticle
              ? "block"
              : "none", // Conditionally show/hide the details div based on showPostCreation state and selected article
        }}
      >
        {showPostCreation && currentPost.article === selectedArticle && (
          <PostCreation parentPost={currentPost} goToPost={goToPost} />
        )}
      </div> */}
    </div>
  );
}

export default Carousel;
