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
  const [imageString, setImageString] = useState(null);

  const extractMainImage = (html) => {
    console.log("extracting");
    // Regular expression to extract the main image URL from the HTML content

    const regex = /image\d":{"wt":"([^"]+)"/g;
    let matches = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      matches.push(match[1]);
    }
    if (matches) {
      console.log(matches[0]);
      return matches[0];
    } else {
      return null;
    }
  };

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
        const imageURL = extractMainImage(html);
        setImageString(imageURL);

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

    const urlRegex =
      /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+)(?:\.[a-zA-Z]{2,})+(?:\/\S*)?$/;

    if (urlRegex.test(searchQuery)) {
      console.log("h");
      const articleTitle = searchQuery
        .substring(searchQuery.lastIndexOf("/") + 1)
        .replace(/_/g, " ");
      console.log(articleTitle);
      try {
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
            articleTitle
          )}?redirects=1`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }
        setWikiURL(response.url);

        let html = await response.text();
        const imageURL = extractMainImage(html);
        setImageString(imageURL);

        html = html.replace(
          /<h2.*?id="References".*?<\/h2>[\s\S]*?<(?:div|table)[^>]+class=".*?references.*?">[\s\S]*?<\/(?:div|table)>/,
          ""
        );
        setArticle(html);
      } catch (error) {
        console.error(error);
        setArticle("No Articles");
      }
    } else {
      if (searchQuery)
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
          const imageURL = extractMainImage(html);
          setImageString(imageURL);

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

    const linkURL = event.target.getAttribute("href");
    if (event.target.nodeName === "A" && linkURL && linkClickLimit > 0) {
      const articleTitle = linkURL
        .substring(linkURL.lastIndexOf("/") + 1)
        .replace(/_/g, " ");
      try {
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
            articleTitle
          )}?redirects=1`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch linked article");
        }
        const html = await response.text();
        const imageURL = extractMainImage(html);
        setImageString(imageURL);

        setWikiURL(response.url);

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
              placeholder="Enter article title or link"
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
              imageString={imageString}
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
