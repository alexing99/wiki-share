/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

// eslint-disable-next-line react/prop-types
function Tree({ rootPost, currentPost }) {
  const [maxDepth, setMaxDepth] = useState(0);
  const [currentDepth, setCurrentDepth] = useState(0);
  const [routeDepth, setRouteDepth] = useState(0);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchMaxDepth = async () => {
      // eslint-disable-next-line react/prop-types
      const depth = await calculateDepth(rootPost);
      setMaxDepth(depth);
    };
    fetchMaxDepth();
  }, [rootPost]);

  useEffect(() => {
    const fetchCurrentDepth = async () => {
      const depth = await countLevelsToRoot(currentPost);
      setCurrentDepth(depth);
    };
    fetchCurrentDepth();

    const fetchRouteDepth = async () => {
      const routeDepth = await calculateDepth(currentPost);
      setRouteDepth(routeDepth - 1);
    };
    fetchRouteDepth();
  }, [currentPost, rootPost]);

  const calculateDepth = async (postId) => {
    try {
      const children = await fetchChildrenData(postId);
      if (Array.isArray(children)) {
        if (children.length === 0) {
          return 1; // No children, depth is 0
        } else {
          // Recursively calculate the depth of each child
          const depths = await Promise.all(
            children.map(async (childId) => {
              const childDepth = await calculateDepth(childId);
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
        return 1; // Return 0 if children data is not in the expected format
      }
    } catch (error) {
      console.error(`Error calculating max depth for post ${postId}:`, error);
      return 1; // Return 0 if there's an error fetching children data
    }
  };

  const fetchChildrenData = async (postId) => {
    try {
      const response = await fetch(`${apiUrl}/posts/${postId._id}/children`);
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

  const fetchParentPost = async (postId) => {
    try {
      const response = await fetch(`${apiUrl}/posts/${postId}/`);
      if (response.ok) {
        return await response.json();
      } else {
        console.error(`Failed to fetch parent post for post ${postId}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching parent post for post ${postId}:`, error);
      return null;
    }
  };

  const countLevelsToRoot = async (post) => {
    let currPost = post;
    let levels = 1; // Start at level 1

    try {
      while (currPost._id !== rootPost._id) {
        const parentPost = await fetchParentPost(currPost.parentPost);
        if (!parentPost) {
          throw new Error(`Parent post not found for post ${currPost}`);
        }
        currPost = parentPost;
        levels++;
      }
      return levels;
    } catch (error) {
      console.error(`Error counting levels to root for post ${post}:`, error);
      return 0; // Return 0 in case of an error
    }
  };

  return (
    <div>
      <p>
        Depth: {currentDepth}/{maxDepth}
      </p>
      <p>Route Depth: {routeDepth}</p>
    </div>
  );
}

export default Tree;
