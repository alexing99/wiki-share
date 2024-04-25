/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import Navbar from "../components/NavBar.jsx";
import "../../src/App.css";
import "../../src/styles/carousel.css";

// import Navbar from "../components/NavBar";
import * as cheerio from "cheerio";

import { useUser } from "../UserContext.jsx";

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

  const navigateTo = useNavigate();

  const extractMainImage = (html) => {
    let mainImageUrl = null;
    const $ = cheerio.load(html);
    // Traverse the DOM tree to find the first non-SVG image URL in the article, excluding Question-book-new.svg
    $("img:not([src$='.svg']):not([src$='Question-book-new.svg'])").each(
      (index, element) => {
        if (!mainImageUrl) {
          const imageUrl = $(element).attr("src");
          // Check if the image URL is not empty
          if (imageUrl && /\.(jpeg|jpg|png|gif|bmp)$/i.test(imageUrl)) {
            // Set the main image URL
            mainImageUrl = imageUrl;
            // Exit the loop once the main image URL is found
            return false;
          }
        }
      }
    );
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
        const cleanHtml = DOMPurify.sanitize(html);
        console.log(cleanHtml, html);
        setArticle(cleanHtml);
        console.log(html);
      } catch (error) {
        console.error(error);
        setArticle("No Articles");
      }
    }
  };
  // scrolls to the top of articles after link click
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

  //scroll to where post content is in article
  const scrollToContent = async () => {
    if (linkClickLimit > 0) {
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
    }
  };

  useEffect(() => {
    getReplyArticle();
    addSelectionListener();
  }, []);
  function checkForGoodArticle(html) {
    // Load the HTML into Cheerio
    const $ = cheerio.load(html);

    // Get the text content of the body element
    const bodyText = $("body").text();

    // Log the body text to inspect it
    console.log(bodyText);

    // Search for the string "This is a good article" case-insensitively
    const containsGoodArticle = bodyText
      .toLowerCase()
      .includes("this is a good article");

    return containsGoodArticle;
  }
  const handleSearch = async (event) => {
    event.preventDefault();
    setLinkClickLimit(0);
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
        console.log("here", response);

        let html = await response.text();
        const imageURL = extractMainImage(html);
        setImageString(imageURL);
        console.log("ho", html);

        html = html.replace(
          /<h2.*?id="References".*?<\/h2>[\s\S]*?<(?:div|table)[^>]+class=".*?references.*?">[\s\S]*?<\/(?:div|table)>/,
          ""
        );
        const isGoodArticle = checkForGoodArticle(html);
        console.log(isGoodArticle);
        const cleanHtml = DOMPurify.sanitize(html);
        setArticle(cleanHtml);
        document
          .getElementById("article-container")
          .classList.add("custom-highlight");
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
          const cleanHtml = DOMPurify.sanitize(html);
          setArticle(cleanHtml);
          document
            .getElementById("article-container")
            .classList.add("custom-highlight");
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

  // const handleLinkClick = async (event) => {
  //   console.log("link clicked");
  //   event.preventDefault();
  //   const linkURL = event.target.getAttribute("href");
  //   if (event.target.nodeName === "A" && linkURL && linkClickLimit > 0) {
  //     const articleTitle = linkURL
  //       .substring(linkURL.lastIndexOf("/") + 1)
  //       .replace(/_/g, " ");
  //     try {
  //       const response = await fetch(
  //         `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
  //           articleTitle
  //         )}?redirects=1`
  //       );
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch linked article");
  //       }
  //       const html = await response.text();
  //       const imageURL = extractMainImage(html);
  //       setImageString(imageURL);
  //       setWikiURL(response.url);
  //       setArticle(html);
  //       setLinkClickLimit(linkClickLimit - 1);
  //       setSelectedText(null);
  //       scrollToTop();
  //       document
  //         .getElementById("article-container")
  //         .classList.add("custom-highlight");
  //     } catch (error) {
  //       console.error(error);
  //       setArticle("Failed to load linked article");
  //     }
  //   }
  // };
  const handleBackButtonClick = async () => {
    setLinkClickLimit(1); // Reset link click limit
    getReplyArticle(); // Reload the parent article
    document
      .getElementById("article-container")
      .classList.remove("custom-highlight");
  };
  const handleLinkClick = async (event) => {
    console.log("link click");
    // Check if the click originated from within the article container
    if (event.target.closest("#article-container")) {
      event.preventDefault(); // Prevent default link navigation
      console.log("link clicked");
      const linkURL = event.target.getAttribute("href");
      if (event.target.nodeName === "A" && linkURL && linkClickLimit > 0) {
        console.log(linkURL);
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
          const cleanHtml = DOMPurify.sanitize(html);
          setArticle(cleanHtml);
          setLinkClickLimit(linkClickLimit - 1);
          setSelectedText(null);
          scrollToTop();
          document
            .getElementById("article-container")
            .classList.add("custom-highlight");
        } catch (error) {
          console.error(error);
          setArticle("Failed to load linked article");
        }
      }
    }
  };

  const user = useUser();

  const postPost = async () => {
    let content = selectedText;

    const author = user.name;
    const url = wikiURL;
    const parts = url.split("/");
    const article = parts[parts.length - 1].split("?")[0];
    let parent = "";

    if (replyMode) {
      parent = articleFrom._id;
      console.log(parent, "ye");
    }

    try {
      console.log(parent);
      const response = await fetch("http://localhost:4578/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ article, content, author, parent, imageString }),
      });

      if (response.ok) {
        const postData = await response.json();
        const newPostId = postData._id;
        const replyingWith = postData._id;
        console.log("Post created successfully!", replyingWith);
        if (!replyMode) {
          const redirectUrl = `/feed/${newPostId}`;
          console.log("Redirecting to:", redirectUrl);
          navigateTo(redirectUrl);
        } else if (replyMode) {
          const nextResponse = await fetch(
            `http://localhost:4578/posts/${articleFrom._id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ replyingWith }),
            }
          );
          if (nextResponse.ok) {
            console.log("reply post created successfully");
            goToPost(newPostId);
            // window.location.reload();
          } else {
            const error = await nextResponse.text();
            console.error("Error creating reply post:", error);
          }
        }
      } else {
        const error = await response.text();
        console.error("Error creating post:", error);
        // goToPost()
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  // const handleNavClick = (event) => {
  //   event.preventDefault();
  //   console.log("Navbar link clicked!");
  //   // Your custom logic for handling navbar link click (optional)
  // };

  return (
    <>
      {!replyMode && (
        <>
          <Navbar className="navbar"></Navbar>{" "}
          <p>
            Paste Wikipedia link below. Or type, but that is not in the spirit
            of the site
          </p>
          <form onSubmit={handleSearch}>
            <input
              className={"searchbar"}
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Enter article title or link"
            />
            <button className="searchButt" type="submit">
              Search
            </button>
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
          {linkClickLimit === 1 && (
            <button onClick={scrollToContent}>Scroll to Clipping</button>
          )}
          {/* Back button */}
          {linkClickLimit === 0 && replyMode && (
            <button className="back-button" onClick={handleBackButtonClick}>
              Back
            </button>
          )}
          {linkClickLimit === 0 && showText === true && (
            <button className="post-button" onClick={postPost}>
              Post
            </button>
          )}
          {/* Article content */}
          <div id="article" className="article-text" onClick={handleLinkClick}>
            <div dangerouslySetInnerHTML={{ __html: article }} />
          </div>
        </div>
      )}

      <style>
        {`
          .article-text a {
            color: ${linkClickLimit > 0 ? "#0645ad" : "black"};
            pointer-events: ${linkClickLimit > 0 ? "auto" : "none"};
            padding: 0px;
          }
        `}
      </style>
    </>
  );
}

export default PostCreation;
