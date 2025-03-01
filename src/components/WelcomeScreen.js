import React from "react";
import Tree from "./Tree";

const WelcomeScreen = ({ onStart }) => {
  return (
    <div className="welcome-screen">
      <h1 className="welcome-title">中式父母</h1>
      <h2 className="welcome-subtitle">让天下的父母不再难做</h2>

      <div style={{ width: "200px", height: "200px", marginBottom: "32px" }}>
        <Tree health={100} />
      </div>

      <p style={{ marginBottom: "24px", maxWidth: "400px" }}>
        通过这个互动体验，您将了解如何更好地与孩子沟通，避免常见的沟通误区，建立更健康的亲子关系。
      </p>

      <button className="btn btn-primary" onClick={onStart}>
        开始体验
      </button>

      <p
        style={{
          marginTop: "16px",
          fontSize: "14px",
          color: "var(--text-secondary)",
        }}
      >
        基于非暴力沟通理论
      </p>
    </div>
  );
};

export default WelcomeScreen;
