import { useState, useEffect } from "react";
import "../../src/App.css";

import BottomBox from "../components/BottomBox";
import Navbar from "../components/NavBar";

// eslint-disable-next-line react/prop-types
function PostCreation({ stepPost }) {
  console.log(stepPost);
  const [replyMode, setReplyMode] = useState(false);
  const [replyArticle, setReplyArticle] = useState();
  const [article, setArticle] = useState(null);

  const [selectedText, setSelectedText] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showText, setShowText] = useState(false);
  const [wikiURL, setWikiURL] = useState("");

  const getReplyArticle = async () => {
    if (stepPost) {
      // const [linkLimit, setLinkLimit] = useState(false);
      setReplyMode(true);
      setReplyArticle(stepPost);
      console.log("hmm", replyArticle);
      try {
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
            stepPost
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
    if (event.target.nodeName === "A" && event.target.hasAttribute("href")) {
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
        setArticle(html);
      } catch (error) {
        console.error(error);
        setArticle("Failed to load linked article");
      }
    }
  };

  return (
    <>
      {!replyMode && (
        <>
          <Navbar></Navbar>{" "}
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
        <div
          id="article"
          dangerouslySetInnerHTML={{ __html: article }}
          onClick={handleLinkClick}
        ></div>
      )}
      {/* Bottom box component */}
      {showText && <BottomBox selectedText={selectedText} wikiURL={wikiURL} />}
    </>
  );
}

export default PostCreation;
