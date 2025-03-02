import React, { useState } from "react";
import Tree from "./Tree";

const WelcomeScreen = ({ onStart }) => {
  const [customScenario, setCustomScenario] = useState("");
  const [identity, setIdentity] = useState("我是孩子");

  const handleStart = () => {
    onStart(customScenario, identity);
  };

  return (
    <div className="welcome-screen">
      <h1 className="welcome-title">非暴力沟通</h1>
      <h2 className="welcome-subtitle">让天下的父母不再难做</h2>

      <div style={{ width: "200px", height: "200px", marginBottom: "32px" }}>
        <Tree health={100} />
      </div>

      <div style={{ marginBottom: "24px", maxWidth: "400px" }}>
        <select
          value={identity}
          onChange={(e) => setIdentity(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        >
          <option value="我是孩子">我是孩子</option>
          <option value="我是家长">我是家长</option>
        </select>
      </div>

      <div style={{ marginBottom: "20px", width: "100%", maxWidth: "400px" }}>
        <label
          htmlFor="scenarioInput"
          style={{ display: "block", marginBottom: "8px", textAlign: "left" }}
        >
          请输入您想要体验的场景描述：
        </label>
        <textarea
          id="scenarioInput"
          value={customScenario}
          onChange={(e) => setCustomScenario(e.target.value)}
          placeholder="例如：孩子沉迷手机游戏，影响了学习..."
          style={{
            width: "100%",
            padding: "10px",
            minHeight: "100px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            resize: "vertical",
          }}
        />
      </div>

      <button className="btn btn-primary" onClick={handleStart}>
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
