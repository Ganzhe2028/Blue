import React from "react";

const Message = ({ type, content, innerThought }) => {
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
      <div className={getMessageClass()}>{content}</div>
    </div>
  );
};

export default Message;
