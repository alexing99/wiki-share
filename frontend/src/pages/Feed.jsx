import { useState, useEffect } from "react";
import Carousel from "../components/Carousel"; // Assume you have a Carousel component
import { useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import { calculateDepth } from "../components/calculateDepth";
import "../styles/feed.css";
import Cookies from "universal-cookie";

function Feed() {
  const [rootPosts, setRootPosts] = useState([]);
  const { redPostId } = useParams();
  const [currentUser, setCurrentUser] = useState();
  const [feedSort, setFeedSort] = useState("New");
  // const [pageNumber, setPageNumber] = useState(1); // Track page number for pagination
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  // const endOfPostsRef = useRef(null); // Reference to end of posts element

  useEffect(() => {
    // Fetch root posts when component mounts
    fetchRootPosts();
  }, [feedSort]);

  useEffect(() => {
    // Fetch root posts when component mounts
    getUserData();
  }, []);
  // const fetchRootPosts = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await fetch(
  //       `http://localhost:4578/posts/rootposts?page=${pageNumber}&limit=10`
  //     );
  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log(typeof data);
  //       // Update root posts based on feed sort
  //       let sortedData;
  //       switch (feedSort) {
  //         case "New":
  //           sortedData = data
  //             .slice()
  //             .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  //           break;

  //         case "Interest":
  //           sortedData = data
  //             .slice()
  //             .sort((a, b) => b.interestScore - a.interestScore);

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
  //             setRootPosts(sortedData);
  //             // Once sorting is done, update state or perform other operations
  //           });
  //           break;
  //         default:
  //           console.error("Invalid sort option");
  //       }

  //       setRootPosts(sortedData);
  //       switch (feedSort) {
  //         // Sorting logic
  //         default:
  //           console.error("Invalid sort option");
  //       }
  //       setRootPosts((prevPosts) => [...prevPosts, ...data]); // Append new posts to existing posts
  //       setIsLoading(false); // Set loading state to false
  //     } else {
  //       console.error("Failed to fetch root posts");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching root posts:", error);
  //     setIsLoading(false); // Set loading state to false
  //   }
  // };
  const fetchRootPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:4578/posts/rootposts");
      if (response.ok) {
        const data = await response.json();
        let sortedData;
        switch (feedSort) {
          case "New":
            sortedData = data
              .slice()
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            break;

          case "Interest":
            sortedData = data
              .slice()
              .sort((a, b) => b.interestScore - a.interestScore);

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
              setRootPosts(sortedData);
              // Once sorting is done, update state or perform other operations
            });
            break;
          default:
            console.error("Invalid sort option");
        }

        setRootPosts(sortedData);
        setIsLoading(false);
        console.log("roots fetched");
      } else {
        console.error("Failed to fetch root posts");
      }
    } catch (error) {
      console.error("Error fetching root posts:", error);
    }
  };

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
  const handleFeedSort = (event) => {
    setFeedSort(event.target.value);
  };
  // const handleScroll = () => {
  //   // Check if user has scrolled to the bottom of the page
  //   if (
  //     endOfPostsRef.current &&
  //     window.innerHeight + window.scrollY >= endOfPostsRef.current.offsetTop
  //   ) {
  //     setPageNumber((prevPageNumber) => prevPageNumber + 1); // Increment page number
  //   }
  // };
  // useEffect(() => {
  //   // Add event listener for scrolling when component mounts
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     // Clean up event listener when component unmounts
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  return (
    <div className="feed">
      {" "}
      <div className="header">
        <Navbar></Navbar> <h1 className="logo">PeecePeek</h1>
        <div className="feed-sort-dropdown">
          <label htmlFor="dropdown">Sort Feed By:</label>
          <select id="dropdown" onChange={handleFeedSort}>
            <option value="New">New</option>
            <option value="Length">Longest Route</option>

            <option value="Interest">Interest</option>
          </select>
        </div>
      </div>
      {rootPosts?.map((rootPost) => (
        <Carousel
          key={rootPost._id}
          rootPost={rootPost}
          redPostId={redPostId}
          currentUser={currentUser}
        />
      ))}
      {isLoading && <p>Loading...</p>}
    </div>
  );
}

export default Feed;
