import React, { useState } from "react";

const Message = ({ type, content, innerThought }) => {
  const [showInnerThought, setShowInnerThought] = useState(false);

  const getMessageClass = () => {
    switch (type) {
      case "child":
        return "message message-child";
      case "parent":
        return "message message-parent";
      case "system":
        return "message message-system";
      default:
        return "message";
    }
  };

  const toggleInnerThought = () => {
    if (innerThought) {
      setShowInnerThought(!showInnerThought);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems:
          type === "parent"
            ? "flex-end"
            : type === "child"
            ? "flex-start"
            : "center",
        marginBottom: "16px",
      }}
    >
      <div
        className={getMessageClass()}
        onClick={toggleInnerThought}
        style={{ cursor: innerThought ? "pointer" : "default" }}
      >
        {content}

        {innerThought && (
          <div
            style={{
              fontSize: "12px",
              marginTop: "4px",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span>点击查看内心想法</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginLeft: "4px" }}
            >
              <path d="M7 10l5 5 5-5" />
            </svg>
          </div>
        )}
      </div>

      {showInnerThought && innerThought && (
        <div className="message-inner-thought">{innerThought}</div>
      )}
    </div>
  );
};

export default Message;
