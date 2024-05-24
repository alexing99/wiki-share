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
  const [searchMode, setSearchMode] = useState(false);
  // const [replyArticle, setReplyArticle] = useState();
  const [article, setArticle] = useState(null);

  const [selectedText, setSelectedText] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showText, setShowText] = useState(false);
  const [wikiURL, setWikiURL] = useState("");
  const [linkClickLimit, setLinkClickLimit] = useState(1);
  const [imageString, setImageString] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const articleRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigateTo = useNavigate();

  const extractMainImage = (html) => {
    let mainImageUrl = null;
    const $ = cheerio.load(html);
    // Traverse the DOM tree to find the first non-SVG image URL in the article, excluding Question-book-new.svg
    $("img").each((index, element) => {
      if (!mainImageUrl) {
        // Get the height of the image
        const height = $(element).attr("height");
        // Check if the height is defined and greater than 100 pixels
        if (height && parseInt(height) > 99) {
          console.log(element, element.height, height);
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
    });

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

        setArticle(cleanHtml);
      } catch (error) {
        console.error(error);
        setArticle("No Articles");
        setIsLoading(false);
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
    if (searchMode) {
      document
        .getElementById("article-container")
        .classList.add("custom-highlight");
    }
  }, [article]);

  // scroll to where post content is in article
  const scrollToContent = async () => {
    if (linkClickLimit > 0) {
      const cleanedText = parentPost.content.replace(/^"|"$/g, "");

      const targetText = cleanedText;
      const articleDiv = articleRef.current;

      if (articleDiv) {
        const paragraphs = articleDiv.getElementsByTagName("p");

        for (let i = 0; i < paragraphs.length; i++) {
          const paragraph = paragraphs[i];
          const paragraphText = paragraph.textContent;

          if (paragraphText.includes(targetText)) {
            // Create a new span element to wrap the target text
            const span = document.createElement("span");
            span.className = "highlight";
            span.textContent = targetText;

            // Replace the target text within the paragraph with the highlighted span
            const newText = paragraphText.replace(targetText, span.outerHTML);
            paragraph.innerHTML = newText;

            const links = span.getElementsByTagName("a");
            for (let j = 0; j < links.length; j++) {
              const link = links[j];
              const linkText = link.textContent;
              const linkHref = link.getAttribute("href");
              link.innerHTML = linkText; // Set the innerHTML to link text
              link.href = linkHref; // Set the href attribute
              link.target = "_blank"; // Open links in a new tab
            }

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

  const handleSearch = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    setLinkClickLimit(0);
    const urlRegex =
      /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+)(?:\.[a-zA-Z]{2,})+(?:\/\S*)?$/;

    if (urlRegex.test(searchQuery)) {
      const articleTitle = searchQuery
        .substring(searchQuery.lastIndexOf("/") + 1) // Get substring after last "/"
        .split("#")[0] // Split on "#" and take the first element (before "#")
        .replace(/_/g, " "); // Replace underscores with spaces
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
        setSearchMode(true);

        let html = await response.text();
        const imageURL = extractMainImage(html);
        setImageString(imageURL);
        console.log("ho", html);

        html = html.replace(
          /<h2.*?id="References".*?<\/h2>[\s\S]*?<(?:div|table)[^>]+class=".*?references.*?">[\s\S]*?<\/(?:div|table)>/,
          ""
        );

        const cleanHtml = DOMPurify.sanitize(html);
        setArticle(cleanHtml);
        document
          .getElementById("article-container")
          .classList.add("custom-highlight");
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setArticle("No Articles");
      }
    } else {
      if (searchQuery)
        try {
          setIsLoading(true);
          const response = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
              searchQuery
            )}?redirects=1`
          );

          if (!response.ok) {
            if (searchQuery.endsWith("s")) {
              const searchSingular = searchQuery.slice(0, -1);
              console.log(searchSingular);
              try {
                setIsLoading(true);
                const response = await fetch(
                  `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
                    searchSingular
                  )}?redirects=1`
                );

                if (!response.ok) {
                  console.log("hmm");
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
                const cleanHtml = await DOMPurify.sanitize(html);
                setArticle(cleanHtml);
                setSearchMode(true);
                setIsLoading(false);
              } catch (error) {
                console.error(error);
                setArticle("No articles found. Try adjusting capitalization.");
              }
              console.log("s");
            } else if (!searchQuery.endsWith("s")) {
              const searchPlural = searchQuery + "s";
              console.log(searchPlural);
              try {
                setIsLoading(true);
                const response = await fetch(
                  `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
                    searchPlural
                  )}?redirects=1`
                );

                if (!response.ok) {
                  console.log("hmm");
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
                const cleanHtml = await DOMPurify.sanitize(html);
                setArticle(cleanHtml);
                setSearchMode(true);
                setIsLoading(false);
              } catch (error) {
                console.error(error);
                setArticle("No articles found. Try adjusting capitalization.");
              }
            }
          } else if (response.ok) {
            setWikiURL(response.url);

            let html = await response.text();
            const imageURL = extractMainImage(html);
            setImageString(imageURL);

            html = html.replace(
              /<h2.*?id="References".*?<\/h2>[\s\S]*?<(?:div|table)[^>]+class=".*?references.*?">[\s\S]*?<\/(?:div|table)>/,
              ""
            );
            const cleanHtml = await DOMPurify.sanitize(html);
            setArticle(cleanHtml);
            setSearchMode(true);
            setIsLoading(false);
          }
        } catch (error) {
          console.error(error);
          setArticle("No articles found. Try adjusting capitalization.");
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
        console.log(linkURL, "url");
        const articleTitle = linkURL
          .substring(linkURL.lastIndexOf("/") + 1) // Get substring after last "/"
          .split("#")[0] // Split on "#" and take the first element (before "#")
          .replace(/_/g, " "); // Replace underscores with spaces
        try {
          const response = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
              articleTitle
            )}?redirects=1`
          );
          if (!response.ok) {
            if (articleTitle.endsWith("s")) {
              const searchSingular = articleTitle.slice(0, -1);
              console.log(searchSingular);
              try {
                setIsLoading(true);
                const response = await fetch(
                  `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
                    searchSingular
                  )}?redirects=1`
                );

                if (!response.ok) {
                  console.log("hmm");
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
                const cleanHtml = await DOMPurify.sanitize(html);
                setArticle(cleanHtml);
                setSearchMode(true);
                setIsLoading(false);
              } catch (error) {
                console.error(error);
                setArticle("No articles found.");
                setReplyMode(true);
                setLinkClickLimit(0);
                setIsLoading(false);
              }
              console.log("s");
            } else if (!articleTitle.endsWith("s")) {
              const searchPlural = articleTitle + "s";
              console.log(searchPlural);
              try {
                setIsLoading(true);
                const response = await fetch(
                  `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
                    searchPlural
                  )}?redirects=1`
                );

                if (!response.ok) {
                  console.log("hmm");
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
                const cleanHtml = await DOMPurify.sanitize(html);
                setArticle(cleanHtml);
                setSearchMode(true);
                setIsLoading(false);
              } catch (error) {
                console.error(error);
                setArticle("No articles found.");
                setReplyMode(true);
                setLinkClickLimit(0);
                setIsLoading(false);
              }
            }
          } else if (response.ok) {
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
          }
        } catch (error) {
          console.error(error);
          setArticle("Failed to load linked article");
          setReplyMode(true);
          setLinkClickLimit(0);
        }
      }
    }
  };

  const user = useUser();

  const postPost = async () => {
    if (user === null) {
      window.location.href = "/";
      return;
    }
    let content = selectedText;

    const author = user.name;
    const url = wikiURL;
    const parts = url.split("/");
    const article = parts[parts.length - 1].split("?")[0];
    let parent = "";

    if (replyMode) {
      parent = articleFrom._id;
    }

    try {
      const response = await fetch(`${apiUrl}/posts`, {
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
        document
          .getElementById("article-container")
          .classList.remove("custom-highlight");
        if (!replyMode) {
          const redirectUrl = `/feed/${newPostId}`;
          console.log("Redirecting to:", redirectUrl);
          navigateTo(redirectUrl);
        } else if (replyMode) {
          const nextResponse = await fetch(
            `${apiUrl}/posts/${articleFrom._id}`,
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
  useEffect;

  return (
    <>
      {!replyMode && (
        <>
          <Navbar className="navbar"></Navbar>{" "}
          <p>
            Paste Wikipedia link below. Or type, but that is not in the spirit
            of the site
          </p>
          <form className="searchForm" onSubmit={handleSearch}>
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
      {isLoading && <p>Loading...</p>}
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
