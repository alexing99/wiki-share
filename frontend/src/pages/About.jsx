import Navbar from "../components/NavBar";
function About() {
  return (
    <>
      <Navbar /> <h1>About</h1>
      <p>
        Wiki Passion started in March of 2024 as a final project after
        completing the Odin Project. It is built with React, Node.js, and
        MongoDB.{" "}
      </p>
      <h3>How It Works</h3>
      <p>
        Copy and paste a Wikipedia link in the search bar of the create post
        tab. Then highlight the desired excerpt and click on the post button.
        Once a root post is created, you or other users can click on the [Show
        Article] button to reveal the rest of the Wikipedia article. Then, if a
        link within the root article is visited, a new post can be created as a
        child. You may only travel one link away from wherever you are. The
        posts do not need to be relevant to eachother. If they are, you can
        click on the puzzle peice icon. If you find a post interesting, click on
        the little LED icon. You can use this typeless platform however you
        wish.{" "}
      </p>
      <h3>Coming Soon</h3>
      <ul>
        <li>
          For a full no typing reality, the site will only allow sign-up through
          Google
        </li>
        <li>AAA WCAG Accessibility</li>
        <li>Quality Assurance Ratings of articles</li>
        <li>Responsive Design for variable screen size</li>
        <li>
          Allow articles that redirect (eg. Mire redirects to Peatland) and
          other fringe cases
        </li>
        <li>10 post pagination with infinite scroll</li>
        <li>Tree diagram display of all routes from root posts</li>
        <li>Swipe functionality for navigation</li>
        <li>Separated quotes with ...</li>
        <li>Display of the sub header of the clipping</li>
        <li>Article table of contents directory</li>
        <li>
          A playful tech or modern retro tech aesthetic a la Glitch or Code
          Academy{" "}
        </li>
      </ul>
    </>
  );
}

export default About;
