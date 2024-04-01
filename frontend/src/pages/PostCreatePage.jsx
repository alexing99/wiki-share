import { useState, useEffect } from "react";
import "../../src/App.css";

import BottomBox from "../components/BottomBox";
import Navbar from "../components/NavBar";

// eslint-disable-next-line react/prop-types
function PostCreation({ parentPost, goToPost }) {
  const [replyMode, setReplyMode] = useState(false);
  // const [replyArticle, setReplyArticle] = useState();
  const [article, setArticle] = useState(null);

  const [selectedText, setSelectedText] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showText, setShowText] = useState(false);
  const [wikiURL, setWikiURL] = useState("");
  const [linkClickLimit, setLinkClickLimit] = useState(1);

  let articleFrom = parentPost;
  const getReplyArticle = async () => {
    if (parentPost) {
      // const [linkLimit, setLinkLimit] = useState(false);
      setReplyMode(true);

      try {
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
            articleFrom.article
          )}?redirects=1`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }
        setWikiURL(response.url);

        let html = await response.text();

        html = html.replace(
          /<h2.*?id="References".*?<\/h2>[\s\S]*?<(?:div|table)[^>]+class=".*?references.*?">[\s\S]*?<\/(?:div|table)>/,
          ""
        );
        setArticle(html);
      } catch (error) {
        console.error(error);
        setArticle("No Articles");
      }
    }
  };

  // const [pageViews, setPageViews] = useState(null);
  // const [articleTitle, setArticleTitle] = useState(null);

  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  useEffect(() => {
    // fetchRandomArticle();
    // handleArticleClick();
    getReplyArticle();
    addSelectionListener();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
          searchQuery
        )}?redirects=1`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      setWikiURL(response.url);

      let html = await response.text();

      html = html.replace(
        /<h2.*?id="References".*?<\/h2>[\s\S]*?<(?:div|table)[^>]+class=".*?references.*?">[\s\S]*?<\/(?:div|table)>/,
        ""
      );
      setArticle(html);
    } catch (error) {
      console.error(error);
      setArticle("No Articles");
    }
  };

  const addSelectionListener = () => {
    document.addEventListener("selectionchange", handleSelectionChange);
  };

  const handleSelectionChange = () => {
    const currentSearch = searchQuery;
    const selectedText = window.getSelection().toString();
    if (
      selectedText != "" &&
      selectedText != " " &&
      selectedText != currentSearch &&
      selectedText.length < 1000
    ) {
      setSelectedText(`"${selectedText}"`);
      setShowText(true);
    } else {
      setShowText(false);
    }
  };

  const handleLinkClick = async (event) => {
    event.preventDefault();

    const linkWord = event.target.textContent.trim();
    if (
      event.target.nodeName === "A" &&
      event.target.hasAttribute("href") &&
      linkClickLimit > 0
    ) {
      try {
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
            linkWord
          )}?redirects=1`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch linked article");
        }
        const html = await response.text();

        setWikiURL(response.url);
        console.log("bettt", wikiURL);
        setArticle(html);
        setLinkClickLimit(linkClickLimit - 1);
        setSelectedText(null);
      } catch (error) {
        console.error(error);
        setArticle("Failed to load linked article");
      }
    }
  };
  const handleBackButtonClick = async () => {
    setLinkClickLimit(1); // Reset link click limit
    getReplyArticle(); // Reload the parent article
  };

  return (
    <>
      {!replyMode && (
        <>
          <Navbar className="navbar"></Navbar>{" "}
          <form onSubmit={handleSearch}>
            <input
              className={"searchbar"}
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Enter article title"
            />
            <button type="submit">Search</button>
          </form>
        </>
      )}

      {article && (
        <div className="article-container">
          {/* Back button */}
          {linkClickLimit === 0 && (
            <button className="back-button" onClick={handleBackButtonClick}>
              Back
            </button>
          )}

          {/* Article content */}
          <div
            id="article"
            dangerouslySetInnerHTML={{ __html: article }}
            onClick={handleLinkClick}
          ></div>
        </div>
      )}
      {(linkClickLimit === 0 || !replyMode) && (
        <>
          {/* Bottom box component */}
          {showText && (
            <BottomBox
              key={wikiURL}
              selectedText={selectedText}
              wikiURL={wikiURL}
              replyMode={replyMode}
              articleFrom={articleFrom}
              goToPost={goToPost}
            />
          )}
          <style>
            {`
          a {
            color: ${linkClickLimit > 0 ? "#0645ad" : "black"};
            pointer-events: ${linkClickLimit > 0 ? "auto" : "none"};
          }
          .article-container {
            position: relative;
          }
          .back-button {
            position: sticky;
            top: 10px;
            right: 800px;
            margin-left: 20px;
            
            z-index: 999; /* Ensure the button is on top of the article content */
          }
  
        `}
          </style>
        </>
      )}
    </>
  );
}

export default PostCreation;
