import React from "react";
import { useSpring, animated } from "react-spring";

const Tree = ({ health = 100 }) => {
  // 根据健康值计算树的状态
  const treeColor = calculateTreeColor(health);
  const treeScale = calculateTreeScale(health);
  const leavesOpacity = calculateLeavesOpacity(health);

  // 动画效果
  const treeAnimation = useSpring({
    from: { opacity: 0, transform: "scale(0.8)" },
    to: { opacity: 1, transform: `scale(${treeScale})` },
    config: { tension: 100, friction: 10 },
  });

  return (
    <animated.div
      style={{
        ...treeAnimation,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg viewBox="0 0 100 120" width="100%" height="100%">
        {/* 树干 */}
        <path
          d="M50,120 C45,100 40,70 45,50 C48,35 50,20 50,10"
          stroke="#8B4513"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />

        {/* 树枝 */}
        <path
          d="M50,50 C60,45 70,48 75,40"
          stroke="#8B4513"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          style={{ opacity: health > 30 ? 1 : 0.5 }}
        />

        <path
          d="M50,70 C40,65 30,68 25,60"
          stroke="#8B4513"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          style={{ opacity: health > 30 ? 1 : 0.5 }}
        />

        {/* 树叶 */}
        <ellipse
          cx="50"
          cy="20"
          rx="20"
          ry="15"
          fill={treeColor.top}
          style={{ opacity: leavesOpacity.top }}
        />

        <ellipse
          cx="75"
          cy="40"
          rx="12"
          ry="10"
          fill={treeColor.right}
          style={{ opacity: leavesOpacity.right }}
        />

        <ellipse
          cx="25"
          cy="60"
          rx="12"
          ry="10"
          fill={treeColor.left}
          style={{ opacity: leavesOpacity.left }}
        />

        {/* 如果树的健康值很低，添加一些掉落的叶子 */}
        {health < 50 && (
          <>
            <circle
              cx="60"
              cy="80"
              r="3"
              fill="#A0522D"
              style={{ opacity: 0.7 }}
            />
            <circle
              cx="40"
              cy="90"
              r="2"
              fill="#A0522D"
              style={{ opacity: 0.6 }}
            />
            <circle
              cx="70"
              cy="95"
              r="2.5"
              fill="#A0522D"
              style={{ opacity: 0.5 }}
            />
          </>
        )}
      </svg>
    </animated.div>
  );
};

// 根据健康值计算树的颜色
function calculateTreeColor(health) {
  // 从绿色到黄色到棕色的渐变
  if (health > 70) {
    return {
      top: "#4CAF50", // 健康的绿色
      right: "#81C784",
      left: "#81C784",
    };
  } else if (health > 40) {
    return {
      top: "#FDD835", // 黄色
      right: "#FFB300",
      left: "#FFB300",
    };
  } else {
    return {
      top: "#A0522D", // 棕色
      right: "#8D6E63",
      left: "#8D6E63",
    };
  }
}

// 根据健康值计算树的缩放比例
function calculateTreeScale(health) {
  return 0.8 + (health / 100) * 0.4; // 从0.8到1.2的范围
}

// 根据健康值计算叶子的透明度
function calculateLeavesOpacity(health) {
  return {
    top: Math.min(1, health / 60),
    right: Math.min(1, (health - 10) / 60),
    left: Math.min(1, (health - 20) / 60),
  };
}

export default Tree;
