/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import { useUser } from "../UserContext";
// import Cookies from "universal-cookie";
import Tree from "../components/Tree";
import Vote from "../components/Vote";
import { calculateDepth } from "../components/calculateDepth";
import PostCreation from "../pages/PostCreatePage";
import "../styles/carousel.css";

function Carousel({ rootPost, redPostId, currentUser }) {
  const [atRoot, setAtRoot] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [atLast, setAtLast] = useState(false);
  const [atFirst, setAtFirst] = useState(false);
  const [currentParent, setCurrentParent] = useState(useUser());

  const [currentPost, setCurrentPost] = useState(null);
  const [currentChildren, setCurrentChildren] = useState([]);
  const [currentChildLevel, setCurrentChildLevel] = useState();
  const [showPostCreation, setShowPostCreation] = useState(false); // State to manage PostCreation vi
  const [selectedArticle, setSelectedArticle] = useState(null); // State to store selected article\
  const [sort, setSort] = useState("New");
  const apiUrl = import.meta.env.VITE_API_URL;

  // const [isLoading, setIsLoading] = useState(false); // Track loading state

  // const [backgroundColor, setBackgroundColor] = useState(
  //   "rgba(255, 0, 0, 0.3)"
  // ); // Initial background color

  // useEffect(() => {
  //   if (currentPost._id === rootPost._id) {
  //     setBackgroundColor("rgba(255, 0, 0, 0.3)"); // Transparent red
  //     console.log("back to red");
  //   } else {
  //     console.log("bakc to white");
  //     setBackgroundColor(""); // Default background color
  //   }
  // }, [currentPost, rootPost]);
  // useEffect(() => {
  //   if (currentPost._id === rootPost._id) {
  //     setBackgroundColor("rgba(255, 0, 0, 0.3)"); // Transparent red
  //     console.log("red again");
  //   }
  // }, [currentPost, rootPost]);

  // makes the user's new reply the current post
  const goToPost = async (postId) => {
    try {
      const response = await fetch(`${apiUrl}/posts/${postId}`, {
        method: "GET",
      });

      if (response.ok) {
        const postData = await response.json();
        await fetchChildrenData(postData.parentPost);
        setCurrentPost(postData);
        setShowPostCreation(false); // Hide post creation when navigating to a new post
      } else {
        console.error("Failed to fetch post data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching post data:", error);
    }
  };
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
    if (post) {
      try {
        const response = await fetch(`${apiUrl}/posts/${post}/children`);

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
    }
  };
  const fetchParentPostForBack = async (postId) => {
    try {
      const response = await fetch(`${apiUrl}/posts/${postId}`, {
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
            if (children) {
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

  useEffect(() => {
    //useEffect for setting setters that conditionally render navigation buttons
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
    // useEffect for getting the parentPost of currentPost
    fetchParentPost(currentPost.parentPost);
  }, [currentPost]);

  const fetchParentPost = async (postId) => {
    //the postId is the parent as the function
    if (postId) {
      try {
        const response = await fetch(`${apiUrl}/posts/${postId}`, {
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
    }
  };
  // makes date and time shown like this: March 30, 2024 at 6:12 PM
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

  const handleSort = (event) => {
    setSort(event.target.value);
  };
  useEffect(() => {
    //if sort changes they need to fetch the children again?
    fetchChildrenData(currentPost?.parentPost);
  }, [sort]);

  useEffect(() => {
    // Scroll to the newly created post when the component mounts
    if (redPostId) {
      console.log(redPostId.toString());
      const newPostElement = document.getElementById(redPostId.toString());
      if (newPostElement) {
        newPostElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [redPostId]);

  return (
    <div
      className="carousel"
      id={`${rootPost._id}`}
      // style={{ backgroundColor }}
    >
      <div className="post-headers">
        {!atRoot && (
          <div className="ancestor-headers">
            <a href="#" onClick={() => handleRootPostClick()}>
              {rootPost.article}
            </a>

            {currentParent?.article !== rootPost.article && (
              <>
                <a>...</a>
                <a href="#" onClick={() => handlePreviousButtonClick()}>
                  {currentParent?.article}
                </a>
              </>
            )}
          </div>
        )}
        <div className="sort-dropdown">
          <label htmlFor="dropdown"></label>
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
      {!showPostCreation && currentPost?.image != null && (
        <img src={currentPost?.image} alt="" width="200px" height="auto" />
      )}{" "}
      <div className="content-and-vote">
        <div
          key={`${currentPost?._id}-${showPostCreation}`}
          className="post-content"
        >
          {showPostCreation && currentPost.article === selectedArticle && (
            <div
              id={`details-${currentPost?.id}`}
              className="article-window"
              style={{
                width: "800px",
                minWidth: "700px",
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
              <button onClick={() => preToggle(rootPost)}>
                [Show Article]
              </button>
            </>
          )}
          {showPostCreation && (
            <button onClick={() => preToggle(rootPost)}>[Hide Article]</button>
          )}
        </div>
        {!atEnd && (
          <button className="nextButt" onClick={handleNextButtonClick}>
            Next
          </button>
        )}
      </div>
      <div className="post-details">
        <Vote
          currentUser={currentUser}
          currentPost={currentPost}
          setCurrentPost={setCurrentPost}
          rootPost={rootPost}
        ></Vote>
        <p>{formattedTimestamp}</p> <p>{currentPost?.author}</p>
      </div>
      <div className="carousel-navigation">
        {!atRoot && (
          <button onClick={handlePreviousButtonClick} className="backButt">
            Back
          </button>
        )}
        <div className="up-down">
          {!atFirst && <button onClick={handleUpClick}>/\</button>}
          {!atLast && <button onClick={handleDownClick}>\/</button>}
        </div>
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
