import { useState, useEffect } from "react";
import BottomBox from "./components/BottomBox";
import "./App.css";
import CreateUserForm from "./components/CreateUserForm";

function App() {
  const [article, setArticle] = useState(null);

  const [selectedText, setSelectedText] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showText, setShowText] = useState(false);
  // const [pageViews, setPageViews] = useState(null);
  // const [articleTitle, setArticleTitle] = useState(null);

  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  useEffect(() => {
    // fetchRandomArticle();
    // handleArticleClick();
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

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   try {
  //     const response = await fetch("/api/users", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ name, email, password }),
  //     });

  //     if (response.ok) {
  //       console.log("User created successfully!");

  //       setName("");
  //       setEmail("");
  //       setPassword("");
  //     } else {
  //       const error = await response.json();
  //       console.error("Error creating user:", error);
  //     }
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //   }
  // };

  return (
    <div className="App">
      <h1>Wiki Passion</h1>
      {/* <div>
        <h1>Sign Up</h1> */}
      {/* <form id="signup-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit">Sign Up</button>
        </form>
      </div> */}
      <CreateUserForm />
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

      {article && (
        <div
          id="article"
          dangerouslySetInnerHTML={{ __html: article }}
          onClick={handleLinkClick}
        ></div>
      )}

      {/* Bottom box component */}
      {showText && <BottomBox selectedText={selectedText} />}
    </div>
  );
}

export default App;
