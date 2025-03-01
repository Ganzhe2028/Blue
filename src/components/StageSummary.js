import React from "react";
// import Tree from "./Tree"; // 移除Tree导入

const StageSummary = ({ data, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }}
    >
      <div
        className="stage-summary"
        style={{
          maxWidth: "480px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h2 className="stage-summary-title">阶段回顾</h2>

        {/* 移除了树的比较部分 */}

        <div className="stage-summary-content">
          <h3
            style={{
              fontSize: "16px",
              marginBottom: "8px",
              color: "var(--primary-dark)",
            }}
          >
            沟通分析
          </h3>
          <p style={{ marginBottom: "16px" }}>{data.analysis}</p>

          <h3
            style={{
              fontSize: "16px",
              marginBottom: "8px",
              color: "var(--primary-dark)",
            }}
          >
            沟通技巧提示
          </h3>
          <ul style={{ paddingLeft: "20px", marginBottom: "16px" }}>
            {data.tips.map((tip, index) => (
              <li key={index} style={{ marginBottom: "8px" }}>
                {tip}
              </li>
            ))}
          </ul>

          <div
            style={{
              padding: "12px",
              backgroundColor: "#FFF8E1",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            <p style={{ fontWeight: "500", marginBottom: "4px" }}>
              非暴力沟通提示:
            </p>
            <p>
              尝试表达你的感受和需求，而不是评判或指责。理解孩子的内心想法和感受，建立共情连接。
            </p>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={onClose}
          style={{ width: "100%" }}
        >
          继续
        </button>
      </div>
    </div>
  );
};

export default StageSummary;
