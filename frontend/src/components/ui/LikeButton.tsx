import React from "react";
import Icon from "react-icons-kit";
import { thumbsUp } from "react-icons-kit/feather/thumbsUp";

interface LikeButtonProps {
  liked: boolean;
  count: number;
  onClick: () => void;
}

export const LikeButton: React.FC<LikeButtonProps & { count: number }> = ({
  liked,
  count,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
      }}
      aria-label="Curtir"
    >
      <Icon icon={thumbsUp} size={20} style={{ color: liked ? "blue" : "gray" }} />
      <span>{liked ? "Liked" : "Like"} ({count})</span>
    </button>
  );
};

