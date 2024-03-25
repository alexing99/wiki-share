// import Navbar from "../components/NavBar";
// import { useEffect, useState } from "react";
// import PostCreation from "./PostCreatePage";

// function Feed() {
//   //   const [article, setArticle] = useState(null);
//   //   const [selectedText, setSelectedText] = useState(null);
//   useEffect(() => {
//     getPosts();
//   }, []);

//   const [gotPosts, setGotPosts] = useState([]);
//   const [parentPosts, setParentPosts] = useState({}); // Store parent posts

//   const [showPostCreation, setShowPostCreation] = useState(false); // State to manage PostCreation vi
//   const [selectedArticle, setSelectedArticle] = useState(null); // State to store selected article

//   const getPosts = async () => {
//     try {
//       const response = await fetch(`http://localhost:4578/posts`, {
//         method: "GET",
//       });

//       if (response.ok) {
//         console.log("posts retreived!");
//         const posts = await response.json();
//         console.log(posts);
//         setGotPosts(posts);
//         console.log(gotPosts);
//         const parentPostIds = new Set(posts.map((post) => post.parentPost));
//         const parentPostsData = await Promise.all(
//           Array.from(parentPostIds).map(fetchParentPost)
//         );
//         const parentPostsMap = {};
//         parentPostsData.forEach((post) => {
//           if (post) {
//             // Check if post is not null
//             parentPostsMap[post._id] = post.article;
//           }
//         });
//         setParentPosts(parentPostsMap);
//       } else {
//         const error = await response.json();
//         console.error("Error retreiving posts:", error);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };
//   //   const toggleDetails = async (articleName) => {
//   //     const detailsDiv = document.getElementById(`details-${articleName}`);
//   //     if (detailsDiv) {
//   //       detailsDiv.style.display =
//   //         detailsDiv.style.display === "none" ? "block" : "none";

//   //     }
//   //   };
//   const toggleDetails = async (articleName) => {
//     setShowPostCreation(!showPostCreation); // Toggle PostCreation visibility
//     setSelectedArticle(articleName); // Store selected article
//   };
//   //   try {
//   //     const response = await fetch(
//   //       `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
//   //         articleName
//   //       )}?redirects=1`
//   //     );

//   //     if (!response.ok) {
//   //       throw new Error("Failed to fetch search results");
//   //     }
//   //     // setWikiURL(response.url);

//   //     let html = await response.text();

//   //     html = html.replace(
//   //       /<h2.*?id="References".*?<\/h2>[\s\S]*?<(?:div|table)[^>]+class=".*?references.*?">[\s\S]*?<\/(?:div|table)>/,
//   //       ""
//   //     );
//   //     setArticle(html);
//   //   } catch (error) {
//   //     console.error(error);
//   //     setArticle("No Articles");
//   //   }
//   // };
//   const fetchParentPost = async (postId) => {
//     console.log(postId, "hmm");
//     try {
//       const response = await fetch(`http://localhost:4578/posts/${postId}`, {
//         method: "GET",
//       });

//       if (response.ok) {
//         console.log("Parent post retrieved!");
//         const parentPostData = await response.json();
//         return parentPostData;
//       } else {
//         const error = await response.json();
//         console.error("Error retrieving parent post:", error);
//         return null;
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       return null;
//     }
//   };
//   return (
//     <>
//       <Navbar></Navbar>

//       <ul>
//         {gotPosts.map((post) => (
//           <li key={post._id}>
//             <h3>{post.article}</h3>
//             <p>{post.content}</p>
//             <p>From: {post.author}</p>

//             <p>Parent: {parentPosts[post.parentPost]}</p>

//             {/* <ul>
//               {post.children.map((child) => (
//                 <li key={child._id}>
//                   <h4>{child.article}</h4>
//                 </li>
//               ))}
//             </ul> */}
//             <button onClick={() => toggleDetails(post.article)}>
//               Show Article
//             </button>
//             <div
//               id={`details-${post.article}`}
//               style={{
//                 width: "700px",
//                 height: "1500px",
//                 backgroundColor: "lightgray",
//                 overflow: "auto",
//                 border: "solid",
//                 display:
//                   showPostCreation && post.article === selectedArticle
//                     ? "block"
//                     : "none", // Conditionally show/hide the details div based on showPostCreation state and selected article
//               }}
//             >
//               {showPostCreation && post.article === selectedArticle && (
//                 <PostCreation parentPost={post} />
//               )}
//             </div>
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// }

// export default Feed;

import { useState, useEffect } from "react";
import Carousel from "../components/Carousel"; // Assume you have a Carousel component
import PostCreation from "./PostCreatePage";
import Navbar from "../components/NavBar";

function Feed() {
  const [rootPosts, setRootPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [currentChildren, setCurrentChildren] = useState([]);
  const [currentChildLevel, setCurrentChildLevel] = useState();
  const [showPostCreation, setShowPostCreation] = useState(false); // State to manage PostCreation vi
  const [selectedArticle, setSelectedArticle] = useState(null); // State to store selected article

  //   const [currentLevel, setCurrentLevel] = useState(0);
  //   const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

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

  //   const handleBackButtonClick = () => {
  //     // Replace current post with its parent post
  //     const parentPostId = currentPost.parentPostId;
  //     setCurrentPost(
  //       parentPostId ? rootPosts.find((post) => post._id === parentPostId) : null
  //     );
  //   };

  const handleNextButtonClick = async (postid) => {
    await fetchChildrenData(postid);
    // try {
    //   const children = await fetchChildrenData(postid);

    //   if (children && children.length > 0) {
    //     const newestPost = children[currentChildren.length - 1];

    //     setCurrentPost(newestPost);
    //     setCurrentChildLevel(children.length - 1);
    //     console.log("next", newestPost);
    //   }
    // } catch (error) {
    //   console.error(`Error:`, error);
    // }
  };
  const handlePrevButtonClick = async (postid) => {
    const parent = postid.parentPost;
    try {
      await fetchParentPost(parent);

      // await fetchChildrenData(parent.parentPost, true);
    } catch (error) {
      console.error(`Error:`, error);
    }
    console.log("back");
  };

  const handleUpClick = () => {
    console.log("up");
    const prevSibling = currentChildren[currentChildLevel + 1];
    setCurrentPost(prevSibling);
    setCurrentChildLevel(currentChildLevel + 1);
    setShowPostCreation(false);
  };
  const handleDownClick = () => {
    console.log("down");
    const nextSibling = currentChildren[currentChildLevel - 1];
    setCurrentPost(nextSibling);
    setCurrentChildLevel(currentChildLevel - 1);
    setShowPostCreation(false);
  };

  //   const handleBackButtonClick = () => {
  //     setCurrentLevel(-1);
  //   };

  //   const handleCarouselChange = (index) => {
  //     // Change the current carousel index
  //     setCurrentCarouselIndex(index);
  //   };

  const fetchChildrenData = async (post, isCalledfromPrevClick) => {
    try {
      const response = await fetch(
        `http://localhost:4578/posts/${post}/children`
      );
      if (response.ok) {
        const data = await response.json();
        if (!isCalledfromPrevClick) {
          setCurrentPost(data[data.length - 1]);
          setCurrentChildLevel(data.length - 1);
        }

        setCurrentChildren(data);

        console.log("children got");
        return data;
      } else {
        console.error(`Failed to fetch descendants for post ${post}`);
      }
    } catch (error) {
      console.error(`Error fetching descendants for post ${post}:`, error);
    }
  };
  const fetchParentPost = async (postId) => {
    console.log(postId, "hmm");
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

  //     try {
  //       const response = await fetch(
  //         `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
  //           articleName
  //         )}?redirects=1`
  //       );

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch search results");
  //       }
  //       // setWikiURL(response.url);

  //       let html = await response.text();

  //       html = html.replace(
  //         /<h2.*?id="References".*?<\/h2>[\s\S]*?<(?:div|table)[^>]+class=".*?references.*?">[\s\S]*?<\/(?:div|table)>/,
  //         ""
  //       );
  //       setArticle(html);
  //     } catch (error) {
  //       console.error(error);
  //       setArticle("No Articles");
  //     }
  //   };

  return (
    <div>
      {" "}
      <Navbar></Navbar>
      {rootPosts.map((rootPost, index) => (
        <>
          <Carousel
            key={index}
            rootPost={rootPost}
            currentPost={currentPost}
            currentChildren={currentChildren}
            currentChildLevel={currentChildLevel}
            //   currentLevel={currentLevel}
            //   currentIndex={currentCarouselIndex === index ? currentPost : null}
            //   onBackButtonClick={handleBackButtonClick}
            onNextButtonClick={handleNextButtonClick}
            onPrevButtonClick={handlePrevButtonClick}
            onUpClick={handleUpClick}
            onDownClick={handleDownClick}
            //   onCarouselChange={() => handleCarouselChange(index)}
          />

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
              <PostCreation parentPost={currentPost} />
            )}
          </div>
        </>
      ))}
    </div>
  );
}

export default Feed;
