import { useState, useEffect } from "react";
import Carousel from "../components/Carousel"; // Assume you have a Carousel component
import { useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import "../styles/feed.css";

function Feed() {
  const [rootPosts, setRootPosts] = useState([]);
  const { redPostId } = useParams();

  useEffect(() => {
    // Fetch root posts when component mounts
    fetchRootPosts();
  }, []);

  const fetchRootPosts = async () => {
    try {
      const response = await fetch("http://localhost:4578/posts/rootposts");
      if (response.ok) {
        const data = await response.json();
        setRootPosts(data);
        console.log("roots fetched");
      } else {
        console.error("Failed to fetch root posts");
      }
    } catch (error) {
      console.error("Error fetching root posts:", error);
    }
  };

  // const goToPost = async (postId) => {
  //   try {
  //     const response = await fetch(`http://localhost:4578/posts/${postId}`, {
  //       method: "GET",
  //     });

  //     if (response.ok) {
  //       const postData = await response.json();
  //       setCurrentPost(postData);
  //       setShowPostCreation(false); // Hide post creation when navigating to a new post
  //     } else {
  //       console.error("Failed to fetch post data:", response.status);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching post data:", error);
  //   }
  // };

  // const handleNextButtonClick = async (postid) => {
  //   if (postid) {
  //     await fetchChildrenData(postid);
  //   }
  // };
  // const handlePrevButtonClick = async (postid) => {
  //   const parent = postid.parentPost;
  //   try {
  //     await fetchParentPost(parent);

  //     // await fetchChildrenData(parent.parentPost, true);
  //   } catch (error) {
  //     console.error(`Error:`, error);
  //   }
  //   console.log("back");
  // };

  // const handleUpClick = () => {
  //   console.log("up");
  //   const prevSibling = currentChildren[currentChildLevel - 1];
  //   setCurrentPost(prevSibling);
  //   setCurrentChildLevel(currentChildLevel - 1);
  //   setShowPostCreation(false);
  // };
  // const handleDownClick = () => {
  //   console.log("down");
  //   const nextSibling = currentChildren[currentChildLevel + 1];
  //   setCurrentPost(nextSibling);
  //   setCurrentChildLevel(currentChildLevel + 1);
  //   setShowPostCreation(false);
  // };

  // const fetchChildrenData = async (post, isCalledfromPrevClick) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:4578/posts/${post}/children`
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       let sortedData;
  //       switch (sort) {
  //         case "New":
  //           sortedData = data
  //             .slice()
  //             .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  //           break;
  //         case "Relevancy":
  //           sortedData = data
  //             .slice()
  //             .sort((a, b) => b.relevancyScore - a.relevancyScore);
  //           console.log(sortedData, "sorted by relevancy score");
  //           break;
  //         case "Interest":
  //           sortedData = data
  //             .slice()
  //             .sort((a, b) => b.interestScore - a.interestScore);
  //           console.log(sortedData, "sorted by interest score");
  //           break;
  //         case "Length":
  //           // Map each post to a Promise calculating its depth
  //           // eslint-disable-next-line no-case-declarations
  //           const depthPromises = data.map((post) => calculateDepth(post));
  //           // Wait for all depth calculations to finish
  //           Promise.all(depthPromises).then((depths) => {
  //             // Sort posts based on depth
  //             sortedData = data
  //               .slice()
  //               .sort(
  //                 (a, b) => depths[data.indexOf(b)] - depths[data.indexOf(a)]
  //               );
  //             console.log(sortedData, "sorted by length");

  //             // Once sorting is done, update state or perform other operations
  //             if (!isCalledfromPrevClick) {
  //               setCurrentPost(sortedData[0]);
  //               setCurrentChildLevel(0);
  //             }
  //             setCurrentChildren(sortedData);
  //           });
  //           break;
  //         default:
  //           console.error("Invalid sort option");
  //       }

  //       if (sort != "Length") {
  //         if (!isCalledfromPrevClick) {
  //           setCurrentPost(sortedData[0]);
  //           setCurrentChildLevel(0);
  //         }

  //         setCurrentChildren(sortedData);
  //       }
  //       console.log("children got");
  //       return sortedData;
  //     } else {
  //       console.error(`Failed to fetch descendants for post ${post}`);
  //     }
  //   } catch (error) {
  //     console.error(`Error fetching descendants for post ${post}:`, error);
  //   }
  // };
  // const fetchParentPost = async (postId) => {
  //   try {
  //     const response = await fetch(`http://localhost:4578/posts/${postId}`, {
  //       method: "GET",
  //     });

  //     if (response.ok) {
  //       const parentPost = await response.json();
  //       setCurrentPost(parentPost);
  //       console.log("Parent post retrieved!");
  //       if (parentPost.children.length != 0) {
  //         try {
  //           const children = await fetchChildrenData(
  //             parentPost.parentPost,
  //             true
  //           );
  //           setCurrentChildren(children);
  //           const parentIndex = children.findIndex(
  //             (child) => child._id === parentPost._id
  //           );
  //           console.log(currentChildren, "see");
  //           if (parentIndex !== -1) {
  //             setCurrentChildLevel(parentIndex);
  //             console.log(parentIndex, "hmmmmmmm");
  //           } else {
  //             console.error(
  //               "Parent post not found in the current children array"
  //             );
  //           }
  //         } catch (error) {
  //           console.error(error);
  //         }

  //         // return parentPostData;
  //       }
  //     } else {
  //       const error = await response.json();
  //       console.error("Error retrieving parent post:", error);
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     return null;
  //   }
  // };

  // const preToggle = (rootPost) => {
  //   if (currentPost === null) {
  //     setCurrentPost(rootPost);
  //   }
  //   toggleDetails();
  // };

  // const toggleDetails = async () => {
  //   console.log("k", currentPost);
  //   setShowPostCreation(!showPostCreation); // Toggle PostCreation visibility
  //   setSelectedArticle(currentPost.article); // Store selected article
  // };

  // const handleSort = (event) => {
  //   setSort(event.target.value);
  // };
  // useEffect(() => {
  //   // Fetch root posts when component mounts
  //   fetchChildrenData(currentPost?.parentPost);
  // }, [sort]);

  return (
    <div className="feed">
      {" "}
      <Navbar></Navbar>{" "}
      {rootPosts.map((rootPost, index) => (
        <>
          {/* <div>
            <label htmlFor="dropdown">Sort By:</label>
            <select id="dropdown" onChange={handleSort}>
              <option value="New">New</option>
              <option value="Length">Longest Route</option>
              <option value="Relevancy">Relevancy</option>
              <option value="Interest">Interest</option>
            </select>
          </div> */}

          <Carousel
            key={index}
            rootPost={rootPost}
            redPostId={redPostId}
            // currentPost={currentPost}
            // setCurrentPost={setCurrentPost}
            // currentChildren={currentChildren}
            // currentChildLevel={currentChildLevel}
            // onNextButtonClick={handleNextButtonClick}
            // onPrevButtonClick={handlePrevButtonClick}
            // onUpClick={handleUpClick}
            // onDownClick={handleDownClick}
            // goToPost={goToPost}
            //   onCarouselChange={() => handleCarouselChange(index)}
          />
        </>
      ))}
    </div>
  );
}

export default Feed;
