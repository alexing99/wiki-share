import { useState, useEffect } from "react";
import "../src/App.css";
import Cookies from "universal-cookie";
// import { Route, Switch } from "react-router-dom";

import CreateUserForm from "./components/CreateUserForm";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/NavBar";
// import dotenv from "dotenv";
// dotenv.config();

function App() {
  // const [article, setArticle] = useState(null);

  // const [selectedText, setSelectedText] = useState(null);
  // const [searchQuery, setSearchQuery] = useState("");
  // const [showText, setShowText] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false); // Track visibility of create user form
  const [showLoginForm, setShowLoginForm] = useState(false); // Track visibility of login form
  // const [pageViews, setPageViews] = useState(null);
  // const [articleTitle, setArticleTitle] = useState(null);

  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  // useEffect(() => {
  //   // fetchRandomArticle();
  //   // handleArticleClick();

  //   addSelectionListener();
  // }, []);

  console.log(Cookies);

  useEffect(() => {
    // Check if token exists in cookies when component mounts
    const cookies = new Cookies();
    const token = cookies.get("token");
    if (token) {
      setLoggedIn(true);
      console.log("ur in");
    } else {
      setLoggedIn(false);
      console.log("nooo");
    }
  }, []); // Run this effect only once when component mounts

  // const handleSearch = async (event) => {
  //   event.preventDefault();
  //   try {
  //     const response = await fetch(
  //       `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
  //         searchQuery
  //       )}?redirects=1`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch search results");
  //     }

  //     let html = await response.text();

  //     html = html.replace(
  //       /<h2.*?id="References".*?<\/h2>[\s\S]*?<(?:div|table)[^>]+class=".*?references.*?">[\s\S]*?<\/(?:div|table)>/,
  //       ""
  //     );
  //     setArticle(html);
  //   } catch (error) {
  //     console.error(error);
  //     setArticle("No Articles");
  //   }
  // };

  // const addSelectionListener = () => {
  //   document.addEventListener("selectionchange", handleSelectionChange);
  // };

  // const handleSelectionChange = () => {
  //   const currentSearch = searchQuery;
  //   const selectedText = window.getSelection().toString();
  //   if (
  //     selectedText != "" &&
  //     selectedText != " " &&
  //     selectedText != currentSearch &&
  //     selectedText.length < 1000
  //   ) {
  //     setSelectedText(`"${selectedText}"`);
  //     setShowText(true);
  //   } else {
  //     setShowText(false);
  //   }
  // };

  // const handleLinkClick = async (event) => {
  //   event.preventDefault();
  //   const linkWord = event.target.textContent.trim();
  //   if (event.target.nodeName === "A" && event.target.hasAttribute("href")) {
  //     try {
  //       const response = await fetch(
  //         `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
  //           linkWord
  //         )}?redirects=1`
  //       );
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch linked article");
  //       }
  //       const html = await response.text();
  //       setArticle(html);
  //     } catch (error) {
  //       console.error(error);
  //       setArticle("Failed to load linked article");
  //     }
  //   }
  // };

  const handleCreateUserClick = () => {
    setShowCreateUserForm(true);
    setShowLoginForm(false);
  };

  const handleLoginClick = () => {
    setShowLoginForm(true);
    setShowCreateUserForm(false);
  };

  const handleLogOut = () => {
    const cookies = new Cookies();
    cookies.remove("token");

    setLoggedIn(false);
  };

  return (
    <div className="App">
      <h1>Peecer</h1>

      {/* <Switch>
        <Route exact path="/">
          <Feed />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/create-post">
          <PostCreator />
        </Route>
      </Switch> */}

      {!isLoggedIn && (
        <>
          <div>
            {!showCreateUserForm && (
              <div>
                <button className="createButt" onClick={handleCreateUserClick}>
                  Create Account
                </button>
              </div>
            )}
            {!showLoginForm && (
              <div>
                <button className="loginButt" onClick={handleLoginClick}>
                  Log In
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <br />

      {/* Render create user form if showCreateUserForm is true */}
      {showCreateUserForm && <CreateUserForm />}

      {/* Render login form if showLoginForm is true */}
      {showLoginForm && <LoginForm />}

      {isLoggedIn && (
        <>
          <button className="logoutButt" onClick={handleLogOut}>
            Log Out
          </button>
        </>
      )}

      <Navbar></Navbar>

      {/* <form onSubmit={handleSearch}>
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
          // onClick={handleLinkClick}
        ></div>
      )} */}
    </div>
  );
}

export default App;
