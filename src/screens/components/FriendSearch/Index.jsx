import React from "react";
import styles from "./FriendSearch.module.css";
import { Link } from "react-router-dom";

const FriendSearch = () => {
  return (
    <div>
      <Link to="/Search">
        {" "}
        <svg
          className={styles.searchIcon}
          width="800px"
          height="800px"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
          stroke-width="3"
          stroke="#000000"
          fill="none"
        >
          <circle cx="29.22" cy="16.28" r="11.14" />
          <path d="M41.32,35.69c-2.69-1.95-8.34-3.25-12.1-3.25h0A22.55,22.55,0,0,0,6.67,55h29.9" />
          <circle cx="45.38" cy="46.92" r="11.94" />
          <line x1="45.98" y1="39.8" x2="45.98" y2="53.8" />
          <line x1="38.98" y1="46.8" x2="52.98" y2="46.8" />
        </svg>
      </Link>
    </div>
  );
};

export default FriendSearch;
