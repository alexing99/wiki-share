import { useState, useEffect } from "react";

// eslint-disable-next-line react/prop-types
function Tree({ rootPost, currentPost }) {
  const [maxDepth, setMaxDepth] = useState(0);

  console.log("root", rootPost, currentPost);

  useEffect(() => {
    const fetchMaxDepth = async () => {
      // eslint-disable-next-line react/prop-types
      const depth = await calculateMaxDepth(currentPost);
      setMaxDepth(depth);
    };
    fetchMaxDepth();
  }, [currentPost]);

  const calculateMaxDepth = async (postId) => {
    console.log("depth", maxDepth);
    try {
      const children = await fetchChildrenData(postId);
      if (Array.isArray(children)) {
        if (children.length === 0) {
          return 0; // No children, depth is 0
        } else {
          // Recursively calculate the depth of each child
          const depths = await Promise.all(
            children.map(async (childId) => {
              const childDepth = await calculateMaxDepth(childId);
              return childDepth + 1; // Add 1 for the current level
            })
          );
          return Math.max(...depths); // Return the maximum depth among children
        }
      } else {
        console.error(
          `Children data is not an array for post ${postId}`,
          children
        );
        return 0; // Return 0 if children data is not in the expected format
      }
    } catch (error) {
      console.error(`Error calculating max depth for post ${postId}:`, error);
      return 0; // Return 0 if there's an error fetching children data
    }
  };

  const fetchChildrenData = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:4578/posts/${postId._id}/children`
      );
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          return data;
        }
      } else {
        console.error(`Failed to fetch children for post ${postId}`);
      }
    } catch (error) {
      console.error(`Error fetching children for post ${postId}:`, error);
    }
  };

  return (
    <div>
      <p>Maximum Depth: {maxDepth}</p>
    </div>
  );
}

export default Tree;
