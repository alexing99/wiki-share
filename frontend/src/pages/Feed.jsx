import Navbar from "../components/NavBar";
import { useEffect, useState } from "react";
import PostCreation from "./PostCreatePage";

function Feed() {
  //   const [article, setArticle] = useState(null);
  //   const [selectedText, setSelectedText] = useState(null);
  useEffect(() => {
    getPosts();
  }, []);

  const [gotPosts, setGotPosts] = useState([]);
  const [showPostCreation, setShowPostCreation] = useState(false); // State to manage PostCreation vi
  const [selectedArticle, setSelectedArticle] = useState(null); // State to store selected article

  const getPosts = async () => {
    try {
      const response = await fetch(`http://localhost:4578/posts`, {
        method: "GET",
      });

      if (response.ok) {
        console.log("posts retreived!");
        const posts = await response.json();
        console.log(posts);
        setGotPosts(posts);
        console.log(gotPosts);
      } else {
        const error = await response.json();
        console.error("Error retreiving posts:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  //   const toggleDetails = async (articleName) => {
  //     const detailsDiv = document.getElementById(`details-${articleName}`);
  //     if (detailsDiv) {
  //       detailsDiv.style.display =
  //         detailsDiv.style.display === "none" ? "block" : "none";

  //     }
  //   };
  const toggleDetails = async (articleName) => {
    setShowPostCreation(!showPostCreation); // Toggle PostCreation visibility
    setSelectedArticle(articleName); // Store selected article
  };
  //   try {
  //     const response = await fetch(
  //       `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
  //         articleName
  //       )}?redirects=1`
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch search results");
  //     }
  //     // setWikiURL(response.url);

  //     let html = await response.text();

  //     html = html.replace(
  //       /<h2.*?id="References".*?<\/h2>[\s\S]*?<(?:div|table)[^>]+class=".*?references.*?">[\s\S]*?<\/(?:div|table)>/,
  //       ""
  //     );
  //     setArticle(html);
  //   } catch (error) {
  //     console.error(error);
  //     setArticle("No Articles");
  //   }
  // };

  return (
    <>
      <Navbar></Navbar>
      <p>feed here</p>
      <ul>
        {gotPosts.map((post) => (
          <li key={post._id}>
            <h3>{post.article}</h3>
            <p>{post.content}</p>
            <p>From: {post.author}</p>
            <button onClick={() => toggleDetails(post.article)}>
              Show Article
            </button>
            <div
              id={`details-${post.article}`}
              style={{
                width: "700px",
                height: "1500px",
                backgroundColor: "lightgray",
                overflow: "auto",
                border: "solid",
                display:
                  showPostCreation && post.article === selectedArticle
                    ? "block"
                    : "none", // Conditionally show/hide the details div based on showPostCreation state and selected article
              }}
            >
              {showPostCreation && post.article === selectedArticle && (
                <PostCreation stepPost={post.article} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Feed;
