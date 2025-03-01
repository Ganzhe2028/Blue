import React, { useState, useEffect, useRef } from "react";
// import Tree from "./Tree"; // 移除Tree导入
import Message from "./Message";
import StageSummary from "./StageSummary";
import { scenarios } from "../utils/scenarios";
import { analyzeResponse } from "../utils/analyzer";

const ChatScreen = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [treeHealth, setTreeHealth] = useState(100); // 保留状态但不再显示Tree
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [quickReplies, setQuickReplies] = useState([]);
  const [emotionLevel, setEmotionLevel] = useState(50); // 0-100, 50 is neutral
  const [stage, setStage] = useState(0);
  const [waitingForUserInput, setWaitingForUserInput] = useState(false);

  const messagesEndRef = useRef(null);

  // 初始化场景
  useEffect(() => {
    startScenario(currentScenario);
  }, []);

  // 自动滚动到最新消息
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startScenario = (scenarioIndex) => {
    const scenario = scenarios[scenarioIndex];

    // 重置状态
    setMessages([]);
    setTreeHealth(100);
    setShowSummary(false);
    setSummaryData(null);
    setStage(0);

    // 添加场景介绍
    addMessage({
      type: "system",
      content: scenario.introduction,
    });

    // 添加第一条孩子的消息
    setTimeout(() => {
      addMessage({
        type: "child",
        content: scenario.stages[0].childMessage,
        innerThought: scenario.stages[0].childInnerThought,
      });

      setWaitingForUserInput(true);

      // 如果有快速回复选项，显示它们
      if (scenario.stages[0].quickReplies) {
        setQuickReplies(scenario.stages[0].quickReplies);
      } else {
        setQuickReplies([]);
      }
    }, 1000);
  };

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleSendMessage = () => {
    if (!userInput.trim() || !waitingForUserInput) return;

    // 添加用户（父母）的消息
    addMessage({
      type: "parent",
      content: userInput,
    });

    setUserInput("");
    setWaitingForUserInput(false);
    setQuickReplies([]);

    // 分析用户的回复
    const currentStageData = scenarios[currentScenario].stages[stage];
    const analysis = analyzeResponse(userInput, currentStageData);

    // 更新树的健康状态
    const newHealth = Math.max(
      0,
      Math.min(100, treeHealth + analysis.healthImpact)
    );
    setTreeHealth(newHealth);

    // 更新情绪水平
    setEmotionLevel(
      Math.max(0, Math.min(100, emotionLevel + analysis.emotionImpact))
    );

    // 显示孩子的反应
    setTimeout(() => {
      addMessage({
        type: "child",
        content: analysis.childResponse,
        innerThought: analysis.childInnerThought,
      });

      // 检查是否需要显示阶段总结
      if (
        stage >= scenarios[currentScenario].stages.length - 1 ||
        analysis.shouldShowSummary
      ) {
        // 准备总结数据
        const summaryInfo = {
          stage: stage,
          initialHealth: treeHealth,
          finalHealth: newHealth,
          analysis: analysis.summary,
          tips: analysis.communicationTips,
        };

        setSummaryData(summaryInfo);

        setTimeout(() => {
          setShowSummary(true);
        }, 1000);
      } else {
        // 继续下一个阶段
        setTimeout(() => {
          proceedToNextStage();
        }, 1500);
      }
    }, 1000);
  };

  const proceedToNextStage = () => {
    const nextStage = stage + 1;
    setStage(nextStage);

    if (nextStage < scenarios[currentScenario].stages.length) {
      const nextStageData = scenarios[currentScenario].stages[nextStage];

      // 添加下一个阶段的孩子消息
      addMessage({
        type: "child",
        content: nextStageData.childMessage,
        innerThought: nextStageData.childInnerThought,
      });

      setWaitingForUserInput(true);

      // 如果有快速回复选项，显示它们
      if (nextStageData.quickReplies) {
        setQuickReplies(nextStageData.quickReplies);
      } else {
        setQuickReplies([]);
      }
    }
  };

  const handleQuickReplyClick = (reply) => {
    setUserInput(reply.text);
    handleSendMessage();
  };

  const handleSummaryClose = () => {
    setShowSummary(false);

    // 检查是否还有下一个阶段
    if (stage < scenarios[currentScenario].stages.length - 1) {
      proceedToNextStage();
    } else {
      // 场景结束，显示最终总结
      addMessage({
        type: "system",
        content: "场景结束。感谢您的参与！",
      });

      // 可以在这里添加逻辑来开始新的场景或返回主菜单
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 移除了小树区域 */}

      {/* 聊天区域 - 现在占据整个高度 */}
      <div className="chat-container" style={{ height: "100%" }}>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <Message
              key={index}
              type={msg.type}
              content={msg.content}
              innerThought={msg.innerThought}
            />
          ))}
          <div ref={messagesEndRef} />

          {/* 快速回复选项 */}
          {waitingForUserInput && quickReplies.length > 0 && (
            <div className="quick-replies">
              {quickReplies.map((reply, index) => (
                <div key={index}>
                  <div
                    className="quick-reply-option"
                    onClick={() => handleQuickReplyClick(reply)}
                  >
                    {reply.text}
                  </div>
                  {reply.hint && (
                    <div className="quick-reply-hint">{reply.hint}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 输入区域 */}
        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder={
              waitingForUserInput ? "请输入您的回复..." : "等待对话中..."
            }
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={!waitingForUserInput}
          />
          <button
            className="chat-send-btn"
            onClick={handleSendMessage}
            disabled={!waitingForUserInput}
          >
            发送
          </button>
        </div>
      </div>

      {/* 阶段总结 */}
      {showSummary && summaryData && (
        <StageSummary data={summaryData} onClose={handleSummaryClose} />
      )}
    </div>
  );
};

export default ChatScreen;
