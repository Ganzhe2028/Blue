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
  const [userResponses, setUserResponses] = useState([]); // 跟踪用户的所有回复

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

  // 在对话结束时生成综合小结
  const generateFinalSummary = () => {
    // 分析用户回复模式
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    userResponses.forEach((response) => {
      if (response.healthImpact > 0) positiveCount++;
      else if (response.healthImpact < 0) negativeCount++;
      else neutralCount++;
    });

    // 确定用户总体沟通模式
    const totalResponses = userResponses.length;
    const positivePercent = (positiveCount / totalResponses) * 100;
    const negativePercent = (negativeCount / totalResponses) * 100;

    let summaryTitle, summaryContent, tips;

    if (positivePercent >= 70) {
      // 积极沟通模式
      summaryTitle = "您的沟通表现优秀！";
      summaryContent =
        "在整个对话中，您大多采用了尊重、理解和支持的沟通方式。您倾听孩子的需求，同时也清晰地表达了自己的顾虑和界限。这种沟通方式有助于建立健康的亲子关系。";
      tips = [
        "继续保持倾听和理解的态度",
        "在设定界限的同时，解释原因并寻求共识",
        "鼓励孩子表达自己的想法和感受",
      ];
    } else if (positivePercent >= 40) {
      // 混合沟通模式
      summaryTitle = "您的沟通有积极之处，也有提升空间";
      summaryContent =
        "在对话中，您有时表现出理解和支持，但有时也忽略了孩子的感受。保持一致的积极沟通模式，将有助于增强亲子间的信任和理解。";
      tips = [
        "在表达担忧前，先确认理解孩子的需求",
        "避免使用评判性语言，专注于描述事实和感受",
        "寻找兼顾安全和尊重的解决方案",
      ];
    } else {
      // 消极沟通模式
      summaryTitle = "您的沟通方式可能需要调整";
      summaryContent =
        "在对话中，您的回应多次忽略了孩子的感受和需求，这可能导致孩子感到不被理解或不被尊重。采用更具支持性的沟通方式，将有助于改善亲子关系。";
      tips = [
        "学习先倾听，再回应的沟通模式",
        "尝试从孩子的角度思考问题",
        "表达关心和担忧，而不是命令和指责",
        "寻求双方都能接受的解决方案",
      ];
    }

    return {
      title: summaryTitle,
      content: summaryContent,
      tips: tips,
    };
  };

  const startScenario = (scenarioIndex) => {
    const scenario = scenarios[scenarioIndex];

    // 重置状态
    setMessages([]);
    setTreeHealth(100);
    setShowSummary(false);
    setSummaryData(null);
    setStage(0);
    setUserResponses([]);

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

    // 记录用户的回复及其分析结果
    setUserResponses((prev) => [...prev, analysis]);

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
      });

      // 检查是否需要显示阶段总结或场景已结束
      if (
        stage >= scenarios[currentScenario].stages.length - 1 ||
        analysis.shouldShowSummary
      ) {
        // 到达最后阶段或需要提前结束时，生成综合反馈
        if (stage >= scenarios[currentScenario].stages.length - 1) {
          const finalSummary = generateFinalSummary();

          // 添加最终沟通小结消息
          setTimeout(() => {
            addMessage({
              type: "system",
              content: `【沟通评估】\n\n${finalSummary.title}\n\n${
                finalSummary.content
              }\n\n【改进建议】\n· ${finalSummary.tips.join("\n· ")}`,
            });

            setTimeout(() => {
              addMessage({
                type: "system",
                content: "场景结束。感谢您的参与！",
              });
            }, 1000);
          }, 1000);
        } else {
          // 准备阶段小结数据（非最终阶段）
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
        }
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
      // 生成最终沟通评估
      const finalSummary = generateFinalSummary();

      // 添加最终沟通小结消息
      addMessage({
        type: "system",
        content: `【沟通评估】\n\n${finalSummary.title}\n\n${
          finalSummary.content
        }\n\n【改进建议】\n· ${finalSummary.tips.join("\n· ")}`,
      });

      // 场景结束消息
      setTimeout(() => {
        addMessage({
          type: "system",
          content: "场景结束。感谢您的参与！",
        });
      }, 1000);
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 移除了小树区域 */}

      {/* 聊天区域 - 现在占据整个高度 */}
      <div className="chat-container" style={{ height: "100%" }}>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <Message key={index} type={msg.type} content={msg.content} />
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
