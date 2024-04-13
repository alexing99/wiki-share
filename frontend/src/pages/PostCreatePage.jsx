/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import "../../src/App.css";
import "../../src/styles/carousel.css";

import BottomBox from "../components/BottomBox";
import Navbar from "../components/NavBar";
import * as cheerio from "cheerio";

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

  const articleRef = useRef(null);

  const extractMainImage = (html) => {
    let mainImageUrl = null;
    const $ = cheerio.load(html);
    // Traverse the DOM tree to find the first image URL in the article
    $("img").each((index, element) => {
      if (!mainImageUrl) {
        const imageUrl = $(element).attr("src");
        if (imageUrl && /\.(jpeg|jpg|png|gif|bmp)$/i.test(imageUrl)) {
          // Set the main image URL
          mainImageUrl = imageUrl;
          // Exit the loop once the main image URL is found
          return false;
        }
      }
    });
    console.log(mainImageUrl);

    return mainImageUrl;
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
        // console.log(html, "hu");
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
  const scrollToTop = async () => {
    const articleWindow = articleRef.current;
    if (articleWindow) {
      const firstParagraph = articleWindow.querySelector("p");
      if (firstParagraph) {
        firstParagraph.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  useEffect(() => {
    if (article) {
      scrollToContent();
    }
  }, [article]);

  const scrollToContent = async () => {
    // Assuming targetText is the target text you want to scroll to

    const cleanedText = parentPost.content.replace(/^"|"$/g, "");
    console.log("scrolling");
    const targetText = cleanedText;
    const articleDiv = articleRef.current;
    console.log(targetText, articleDiv);

    if (articleDiv) {
      const paragraphs = articleDiv.getElementsByTagName("p");
      console.log(paragraphs);

      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        const paragraphText = paragraph.textContent;

        console.log(paragraphText, "tecxt");

        if (paragraphText.includes(targetText)) {
          // Create a new span element to wrap the target text
          const span = document.createElement("span");
          span.className = "highlight";
          span.textContent = targetText;

          // Replace the target text within the paragraph with the highlighted span
          const newText = paragraphText.replace(targetText, span.outerHTML);
          paragraph.innerHTML = newText;

          // Scroll to the paragraph containing the target text
          // articleRef.scrollIntoView({ behavior: "smooth", block: "start" });
          setTimeout(() => {
            paragraph.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 200); // Adjust the delay as needed

          break; // Stop searching after finding the first match
        } else console.log("no match");
      }
    }
  };

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
        scrollToTop();
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
        <div
          className="article-container"
          id="article-container"
          ref={articleRef}
        >
          {" "}
          <button onClick={scrollToContent}>scroll</button>
          {/* Back button */}
          {linkClickLimit === 0 && (
            <button className="back-button" onClick={handleBackButtonClick}>
              Back
            </button>
          )}
          {/* Article content */}
          <div
            id="article"
            className="article-text"
            dangerouslySetInnerHTML={{ __html: article }}
            onClick={handleLinkClick}
          ></div>
          <div className="target">
            <p>targeet</p> <button onClick={scrollToTop}>Scroll to Top</button>
          </div>
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
