import "./BottomBox.css";
import Cookies from "universal-cookie";

/* eslint-disable react/prop-types */

const BottomBox = ({ selectedText, wikiURL }) => {
  const cookies = new Cookies();
  const token = cookies.get("token");

  const tokenArray = token.split(".");
  const payload = tokenArray[1];

  const decodedPayload = JSON.parse(atob(payload));

  const userId = decodedPayload.id;

  const getUsername = async () => {
    try {
      const response = await fetch(`http://localhost:4578/users/${userId}`, {
        method: "GET",
      });

      if (response.ok) {
        console.log("user information retreived!");
        const data = await response.json();
        return data.name;
      } else {
        const error = await response.json();
        console.error("Error retreiving user information:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const postPost = async () => {
    let content = selectedText;

    const author = getUsername();
    const url = wikiURL;
    const parts = url.split("/");
    const article = parts[parts.length - 1].split("?")[0];
    console.log("article", article);
    console.log("selected", selectedText);

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
