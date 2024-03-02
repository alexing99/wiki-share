import "./BottomBox.css";

/* eslint-disable react/prop-types */

const BottomBox = ({ selectedText, handlePost }) => {
  return (
    <div className="bottom-box">
      <p>{selectedText}</p>
      <button onClick={handlePost}>Post</button>
    </div>
  );
};

export default BottomBox;
