import "./BottomBox.css";

import { useUser } from "../UserContext.jsx";

/* eslint-disable react/prop-types */

const BottomBox = ({ selectedText, wikiURL, replyMode, articleFrom }) => {
  const user = useUser();

  const postPost = async () => {
    let content = selectedText;
    console.log(wikiURL);

    const author = user.name;
    const url = wikiURL;
    const parts = url.split("/");
    const article = parts[parts.length - 1].split("?")[0];
    let parent = "";
    // console.log("articleFrom", parent);
    // console.log("article", article);
    // console.log("selected", selectedText);
    // console.log("name", author);
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
        body: JSON.stringify({ article, content, author, parent }),
      });

      if (response.ok) {
        const postData = await response.json();
        const replyingWith = postData._id;
        console.log("Post created successfully!", replyingWith);
        if (replyMode) {
          try {
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
            } else {
              const error = await response.json();
              console.error("Error creating reply post:", error);
            }
          } catch (error) {
            console.error("Error creating post:", error);
          }
        }
      } else {
        const error = await response.json();
        console.error("Error creating post:", error);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  return (
    <div className="bottom-box">
      <p>{selectedText}</p>
      <button onClick={postPost}>Post</button>
    </div>
  );
};

export default BottomBox;
