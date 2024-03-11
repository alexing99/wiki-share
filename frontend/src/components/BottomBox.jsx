import "./BottomBox.css";

import { useUser } from "../UserContext";

/* eslint-disable react/prop-types */

const BottomBox = ({ selectedText, wikiURL }) => {
  const user = useUser();

  const postPost = async () => {
    let content = selectedText;

    const author = user.name;
    const url = wikiURL;
    const parts = url.split("/");
    const article = parts[parts.length - 1].split("?")[0];
    console.log("article", article);
    console.log("selected", selectedText);
    console.log("name", author);

    try {
      const response = await fetch("http://localhost:4578/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ article, content, author }),
      });

      if (response.ok) {
        console.log("Post created successfully!");
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
