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
        <li>Article table of contents</li>
      </ul>
    </>
  );
}

export default About;
