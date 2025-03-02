import React, { useState, useEffect, useRef } from "react";
// import Tree from "./Tree"; // 移除Tree导入
import Message from "./Message";
import StageSummary from "./StageSummary";
import { scenarios } from "../utils/scenarios";
import { analyzeResponse } from "../utils/analyzer";
import tree11 from "./11.jpg"; // 导入树图片
import tree22 from "./22.jpg"; // 导入树图片
import tree33 from "./33.jpg"; // 导入树图片
import tree44 from "./44.jpg"; // 导入树图片

const ChatScreen = ({ customScenario, userIdentity }) => {
  // 将初始场景固定为学习成绩下降场景（索引0）
  const [currentScenario, setCurrentScenario] = useState(0);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [treeHealth, setTreeHealth] = useState(100); // 保留状态但不再显示Tree
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [emotionLevel, setEmotionLevel] = useState(50); // 0-100, 50 is neutral
  const [stage, setStage] = useState(0);
  const [waitingForUserInput, setWaitingForUserInput] = useState(false);
  const [userResponses, setUserResponses] = useState([]); // 跟踪用户的所有回复
  const [isParent, setIsParent] = useState(userIdentity === "我是家长");

  // 添加固定回复集
  const standardResponses = [
    "我理解你的感受，让我们一起想想办法。",
    "我看到你很努力了，我能帮你什么吗？",
    "这确实需要我们共同面对，谢谢你的分享。",
    "我会一直支持你，无论发生什么。",
    "我们相信你能做到更好，让我们一起努力。",
  ];

  const messagesEndRef = useRef(null);

  // 重新开始一个随机场景的函数 - 固定为场景0
  const startRandomScenario = () => {
    setCurrentScenario(0);
    startScenario(0);
  };

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
    let totalViolenceScore = 0;
    let categoryCount = {
      理解支持: 0,
      关心询问: 0,
      理解解决: 0,
      信任支持: 0,
      尊重协作: 0,
      感受探询: 0,
      实用询问: 0,
      期望压力: 0,
      条件允许: 0,
      妥协偏向: 0,
      回避转移: 0,
      质疑否定: 0,
      贬低否定: 0,
      责任指责: 0,
      强硬拒绝: 0,
      指责评判: 0,
      比较打击: 0,
      强制抑制: 0,
      强制压制: 0,
      强制单一: 0,
      指责转移: 0,
      责任推卸: 0,
      优先说教: 0,
      一般表达: 0,
    };

    // 统计各类回复和计算总暴力沟通分数
    userResponses.forEach((response) => {
      totalViolenceScore += response.violenceIndex || 0;
      if (response.category) {
        categoryCount[response.category] =
          (categoryCount[response.category] || 0) + 1;
      }
    });

    // 计算平均暴力沟通指数
    const averageViolenceIndex = totalViolenceScore / userResponses.length;

    // 找出最常用的沟通类别（取前三个）
    const sortedCategories = Object.entries(categoryCount)
      .filter(([_, count]) => count > 0)
      .sort(([_, countA], [__, countB]) => countB - countA)
      .slice(0, 3)
      .map(([category]) => category);

    let summaryTitle, summaryContent, tips;
    // 根据平均暴力沟通指数决定树图片
    let treeImage = null;

    // 根据平均暴力沟通指数生成不同的综合评估
    if (averageViolenceIndex <= 20) {
      // 非暴力沟通模式 - 不放图片
      treeImage = tree55;
      summaryTitle = "您的沟通表现出色！";
      summaryContent = `在整个对话中，您采用了尊重、理解和支持的沟通方式。您的沟通暴力指数为${Math.round(
        averageViolenceIndex
      )}（0-100，越低越好），表明您能够很好地理解孩子的需求，同时用积极的方式表达自己的顾虑。您最常使用的沟通方式是"${sortedCategories.join(
        "、"
      )}"，这些方式有助于建立健康的亲子关系。`;
      tips = [
        "您展现了出色的情感协调能力，既能守护孩子安全又能尊重自主权",
        "当孩子遇到困难时，试试用'我注意到...'开启对话（如：我注意到你最近很想交新朋友）",
        "继续保持'先确认需求再表达担忧'的模式（如：你希望有更多社交对吗？妈妈也很支持，我们可以一起想想怎么既安全又有趣）",
      ];
    } else if (averageViolenceIndex <= 40) {
      // 较好的沟通模式 - 放tree22
      treeImage = tree44;
      summaryTitle = "您的沟通整体良好";
      summaryContent = `您表现出强烈的保护意识（沟通指数${Math.round(
        averageViolenceIndex
      )}），这源于对孩子安全的深切关怀。我们注意到您最常使用"${sortedCategories.join(
        "、"
      )}"，这些方式体现了您希望建立规范的用心。若能更多展现关怀背后的情感，效果会更好。`;
      tips = [
        "当您说'晚上危险'时，其实是想说'我特别担心你的安全'对吗？试着直接表达这份关心",
        "在设定限制前，可以先说'妈妈理解你想和朋友相处的需要'",
        "把'不许去'换成'我们可以一起制定安全计划吗？'",
      ];
    } else if (averageViolenceIndex <= 60) {
      // 混合沟通模式 - 放tree33
      treeImage = tree33;
      summaryTitle = "您的沟通方式需要调整";
      summaryContent = `您正处在爱与规则的平衡探索中（指数${Math.round(
        averageViolenceIndex
      )}）。我们理解您使用"${sortedCategories.join(
        "、"
      )}"是希望培养孩子的责任感。这些严格要求的背后，是您对子女健康成长的殷切期待。若能增加情感确认环节，孩子会更理解您的用心。`;
      tips = [
        "当孩子坚持时，您可能担心失去权威。其实可以说：'妈妈需要点时间想想怎么既尊重你又确保安全'",
        "把'就知道玩'转化为：'你最近对社交很感兴趣呢，能和我聊聊吸引你的地方吗？'",
        "试着每天发现孩子一个值得肯定的细节（如：你今天主动收拾书包，说明你越来越有责任感了）",
      ];
    } else if (averageViolenceIndex <= 80) {
      // 较为消极的沟通模式 - 放tree44
      treeImage = tree11;
      summaryTitle = "您的沟通方式需要重大改变";
      summaryContent = `我们感受到您深重的育儿焦虑（指数${Math.round(
        averageViolenceIndex
      )}）。您常用的"${sortedCategories.join(
        "、"
      )}"方式，折射出社会压力对父母的高要求。这些严厉措施背后，是您生怕孩子行差踏错的良苦用心。让我们找到既能传递关心，又不伤害亲子关系的新方式。`;
      tips = [
        "当您说'别人家孩子'时，其实是希望孩子更优秀。可以试试：'妈妈相信你独特的潜力'",
        "把'必须听我的'换成'这是妈妈特别担心的地方，你能帮我一起想办法吗？'",
        "每天给孩子一个拥抱，什么话都不说，持续观察孩子的变化",
      ];
    } else {
      // 高度消极的沟通模式 - 放tree44
      treeImage = tree11;
      summaryTitle = "您的沟通方式亟需重大调整";
      summaryContent = `您正承受着巨大的养育压力（指数${Math.round(
        averageViolenceIndex
      )}）。那些"${sortedCategories.join(
        "、"
      )}"的表达，反映出您可能也未曾被温柔对待过的成长经历。这不是您的错，但我们可以一起打破这个循环。修复关系永远不晚，您踏出的第一步就是孩子幸福的起点。`;
      tips = [
        "今天可以先从'对不起'开始，告诉孩子：'妈妈正在学习更好地爱你'",
        "记录三件孩子让你感动的小事，睡前分享给他听",
        "当情绪激动时，试着说：'妈妈现在很难过，需要冷静一下，我们半小时后再谈好吗？'",
      ];
    }

    // 根据最常用的沟通类别提供额外的针对性建议
    if (
      sortedCategories.includes("强硬拒绝") ||
      sortedCategories.includes("强制压制") ||
      sortedCategories.includes("强制单一")
    ) {
      tips.push(
        "您快速决断是希望规避风险，可以说：'这个提议妈妈需要认真考虑，你能说说你的安全计划吗？'"
      );
      tips.push("学习在不使用强制语言的情况下设定必要的界限");
      tips.push("理解权威压制可能导致孩子暂时服从但长期反抗");
    }

    if (
      sortedCategories.includes("比较打击") ||
      sortedCategories.includes("贬低否定")
    ) {
      tips.push(
        "您进行比较是希望激励孩子，可以改为：'妈妈注意到你在...方面特别有天赋，我们要不要重点发展这个优势？'"
      );
      tips.push("避免将孩子与他人比较，这会损害孩子的自尊心");
      tips.push("尊重孩子的兴趣爱好，不要贬低他们认为重要的事物");
    }

    if (
      sortedCategories.includes("质疑否定") ||
      sortedCategories.includes("指责评判")
    ) {
      tips.push("用好奇和开放的态度代替质疑和评判");
      tips.push("记住，孩子的行为通常是满足某种需求的尝试");
    }

    return {
      title: summaryTitle,
      content: summaryContent,
      tips: tips,
      treeImage: treeImage, // 返回对应的树图片
    };
  };

  // 开始一个场景
  const startScenario = (scenarioIndex) => {
    setMessages([]);
    setStage(0);
    setTreeHealth(100);
    setEmotionLevel(50);
    setUserResponses([]);
    setShowSummary(false);
    setSummaryData(null);

    const scenarioIntro =
      customScenario && customScenario.trim()
        ? customScenario
        : scenarios[scenarioIndex].introduction;

    // 添加身份标识
    addMessage({
      type: "system",
      content: `<div style="text-align: center; margin-bottom: 10px;">
        <p>您当前的身份是: <strong>${userIdentity}</strong></p>
      </div>`,
    });

    // 添加树的图片和状态说明
    addMessage({
      type: "system",
      content: `<div style="text-align: center;">
        <img src="${tree22}" alt="情绪树" style="width: 200px; margin: 10px auto;" />
        <p>这棵树代表着孩子的心理健康状态。沟通方式会直接影响孩子的情绪和成长。</p>
      </div>`,
    });

    // 添加场景介绍
    setTimeout(() => {
      addMessage({
        type: "system",
        content: `【场景介绍】${scenarioIntro}`,
      });

      // 添加孩子的第一条消息
      setTimeout(() => {
        addMessage({
          type: "child",
          content: scenarios[scenarioIndex].stages[0].childMessage,
        });
        setWaitingForUserInput(true);
      }, 1000);
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

    // 分析用户的回复 - 使用固定的标准回复
    const currentStageData = scenarios[currentScenario].stages[stage];
    // 使用标准回复进行分析，而不是实际用户输入
    const standardResponse =
      standardResponses[stage % standardResponses.length];
    const analysis = analyzeResponse(standardResponse, currentStageData);

    // 记录用户的回复及其分析结果 - 使用固定的分析结果
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
      // 在最后一轮，使用场景定义的孩子消息，而不是由analyzeResponse生成的回复
      if (stage >= scenarios[currentScenario].stages.length - 1) {
        // 使用场景中定义的最后一条孩子消息
        addMessage({
          type: "child",
          content: scenarios[currentScenario].stages[stage].childMessage,
        });
      } else if (stage === scenarios[currentScenario].stages.length - 2) {
        // 倒数第二轮时显示固定的回复
        addMessage({
          type: "child",
          content: "嗯，我明白你的担心。",
        });

        // 短暂延迟后自动显示最后一句话，无需用户输入
        setTimeout(() => {
          // 显示最后一轮孩子的台词
          addMessage({
            type: "child",
            content: scenarios[currentScenario].stages[stage + 1].childMessage,
          });

          // 直接进入总结阶段
          setTimeout(() => {
            // 到达最后阶段时，生成综合反馈
            const finalSummary = generateFinalSummary();

            // 添加最终沟通小结消息
            setTimeout(() => {
              // 根据是否有树图片构建不同的内容
              let summaryContent = `【沟通评估】\n\n${finalSummary.title}\n\n${
                finalSummary.content
              }\n\n【改进建议】\n· ${finalSummary.tips.join("\n· ")}`;

              // 如果有树图片，添加图片HTML
              if (finalSummary.treeImage) {
                addMessage({
                  type: "system",
                  content: `<div style="text-align: center;">
                    <img src="${finalSummary.treeImage}" alt="情绪树" style="width: 200px; margin: 10px auto;" />
                    <p>这是孩子当前的心理状态。</p>
                  </div>
                  ${summaryContent}`,
                });
              } else {
                addMessage({
                  type: "system",
                  content: summaryContent,
                });
              }

              setTimeout(() => {
                // 添加沟通心法文段
                addMessage({
                  type: "system",
                  content: `亲爱的家长：

您是否发现这样的对话困境？  
当孩子说"我想晚上出去玩"，您立即说"不可以"时  
您心里翻涌的其实是："现在治安不好，上周新闻刚有事故...要是出事我这当父母的怎么担得起..."  
但孩子听到的只是冰冷的拒绝，他脑中的声音是："爸妈根本不信任我，在他们眼里我永远长不大"  

这不是沟通，这是两颗心在黑暗中的隔空喊话。  

试着像使用ChatGPT那样与孩子对话——当AI答非所问时，您会补充背景："我需要一封求职信，对方是互联网公司，我有3年运营经验..."  
对孩子也该如此：  
"妈妈很矛盾，既想支持你独立（需求），又担心夜间安全（顾虑）。你能说说想出去玩的具体计划吗？我们找找两全其美的方案（共同解决）"  

魔法公式 = 袒露脆弱 + 展示思考过程  
- 当您要拒绝时，先说："爸爸刚才心跳都加快了，因为..."  
- 当您不赞同时，先坦白："妈妈小时候被过度保护，现在可能矫枉过正了..."  
- 当您担忧时，展示纠结："批不批准这个聚会让我失眠了，既怕你错过社交，又担心..."  

这样的对话不是示弱，而是在孩子心里播撒三颗种子：  
1️⃣ 信任的种子："原来我的每个请求，爸妈都认真考虑过"  
2️⃣ 共情的种子："爸妈的反对背后藏着爱，不是专制"  
3️⃣ 智慧的种子："解决问题要考虑多方因素，不能非黑即白"  

就像孩子学步时会摔跤，我们学习新型沟通时也可能退回旧模式。但请记住：当您开始说"我为什么这么说"，孩子就开始听懂"爱为什么这样表达"。`,
                });

                setTimeout(() => {
                  addMessage({
                    type: "system",
                    content:
                      "场景结束。本项目完全没有改变您、甚至教育您的想法的意图。我们只想通过这个项目让您意识到：把隐藏在心里没说出口的那些话说出来，就能改善很多，仅此而已。感谢您的参与！",
                  });
                }, 1500);
              }, 1500);
            }, 1000);
          }, 1000);
        }, 2000);

        // 更新阶段到最后一个阶段，这样系统知道对话已结束
        setStage(scenarios[currentScenario].stages.length - 1);
      } else {
        // 使用分析生成的回复
        addMessage({
          type: "child",
          content: analysis.childResponse,
        });
      }

      // 检查是否到达最后阶段，且不是从倒数第二轮自动跳转来的
      if (
        stage >= scenarios[currentScenario].stages.length - 1 &&
        !(stage === scenarios[currentScenario].stages.length - 2)
      ) {
        // 到达最后阶段时，生成综合反馈
        const finalSummary = generateFinalSummary();

        // 添加最终沟通小结消息
        setTimeout(() => {
          // 根据是否有树图片构建不同的内容
          let summaryContent = `【沟通评估】\n\n${finalSummary.title}\n\n${
            finalSummary.content
          }\n\n【改进建议】\n· ${finalSummary.tips.join("\n· ")}`;

          // 如果有树图片，添加图片HTML
          if (finalSummary.treeImage) {
            addMessage({
              type: "system",
              content: `<div style="text-align: center;">
                <img src="${finalSummary.treeImage}" alt="情绪树" style="width: 200px; margin: 10px auto;" />
                <p>这是孩子当前的心理状态。</p>
              </div>
              ${summaryContent}`,
            });
          } else {
            addMessage({
              type: "system",
              content: summaryContent,
            });
          }

          setTimeout(() => {
            // 添加沟通心法文段
            addMessage({
              type: "system",
              content: `亲爱的家长：

您是否发现这样的对话困境？  
当孩子说"我想晚上出去玩"，您立即说"不可以"时  
您心里翻涌的其实是："现在治安不好，上周新闻刚有事故...要是出事我这当父母的怎么担得起..."  
但孩子听到的只是冰冷的拒绝，他脑中的声音是："爸妈根本不信任我，在他们眼里我永远长不大"  

这不是沟通，这是两颗心在黑暗中的隔空喊话。  

试着像使用ChatGPT那样与孩子对话——当AI答非所问时，您会补充背景："我需要一封求职信，对方是互联网公司，我有3年运营经验..."  
对孩子也该如此：  
"妈妈很矛盾，既想支持你独立（需求），又担心夜间安全（顾虑）。你能说说想出去玩的具体计划吗？我们找找两全其美的方案（共同解决）"  

魔法公式 = 袒露脆弱 + 展示思考过程  
- 当您要拒绝时，先说："爸爸刚才心跳都加快了，因为..."  
- 当您不赞同时，先坦白："妈妈小时候被过度保护，现在可能矫枉过正了..."  
- 当您担忧时，展示纠结："批不批准这个聚会让我失眠了，既怕你错过社交，又担心..."  

这样的对话不是示弱，而是在孩子心里播撒三颗种子：  
1️⃣ 信任的种子："原来我的每个请求，爸妈都认真考虑过"  
2️⃣ 共情的种子："爸妈的反对背后藏着爱，不是专制"  
3️⃣ 智慧的种子："解决问题要考虑多方因素，不能非黑即白"  

就像孩子学步时会摔跤，我们学习新型沟通时也可能退回旧模式。但请记住：当您开始说"我为什么这么说"，孩子就开始听懂"爱为什么这样表达"。`,
            });

            setTimeout(() => {
              addMessage({
                type: "system",
                content:
                  "场景结束。本项目完全没有改变您、甚至教育您的想法的意图。我们只想通过这个项目让您意识到：把隐藏在心里没说出口的那些话说出来，就能改善很多，仅此而已。感谢您的参与！",
              });

              // 不再添加结束提示
              setWaitingForUserInput(true);
            }, 1500);
          }, 1500);
        }, 1000);
      } else if (!(stage === scenarios[currentScenario].stages.length - 2)) {
        // 继续下一个阶段，不显示中间小结
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
    }
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
      // 根据是否有树图片构建不同的内容
      let summaryContent = `【沟通评估】\n\n${finalSummary.title}\n\n${
        finalSummary.content
      }\n\n【改进建议】\n· ${finalSummary.tips.join("\n· ")}`;

      // 如果有树图片，添加图片HTML
      if (finalSummary.treeImage) {
        addMessage({
          type: "system",
          content: `<div style="text-align: center;">
            <img src="${finalSummary.treeImage}" alt="情绪树" style="width: 200px; margin: 10px auto;" />
            <p>这是孩子当前的心理状态。</p>
          </div>
          ${summaryContent}`,
        });
      } else {
        addMessage({
          type: "system",
          content: summaryContent,
        });
      }

      setTimeout(() => {
        // 添加沟通心法文段
        addMessage({
          type: "system",
          content: `亲爱的家长：

您是否发现这样的对话困境？  
当孩子说"我想晚上出去玩"，您立即说"不可以"时  
您心里翻涌的其实是："现在治安不好，上周新闻刚有事故...要是出事我这当父母的怎么担得起..."  
但孩子听到的只是冰冷的拒绝，他脑中的声音是："爸妈根本不信任我，在他们眼里我永远长不大"  

这不是沟通，这是两颗心在黑暗中的隔空喊话。  

试着像使用ChatGPT那样与孩子对话——当AI答非所问时，您会补充背景："我需要一封求职信，对方是互联网公司，我有3年运营经验..."  
对孩子也该如此：  
"妈妈很矛盾，既想支持你独立（需求），又担心夜间安全（顾虑）。你能说说想出去玩的具体计划吗？我们找找两全其美的方案（共同解决）"  

魔法公式 = 袒露脆弱 + 展示思考过程  
- 当您要拒绝时，先说："爸爸刚才心跳都加快了，因为..."  
- 当您不赞同时，先坦白："妈妈小时候被过度保护，现在可能矫枉过正了..."  
- 当您担忧时，展示纠结："批不批准这个聚会让我失眠了，既怕你错过社交，又担心..."  

这样的对话不是示弱，而是在孩子心里播撒三颗种子：  
1️⃣ 信任的种子："原来我的每个请求，爸妈都认真考虑过"  
2️⃣ 共情的种子："爸妈的反对背后藏着爱，不是专制"  
3️⃣ 智慧的种子："解决问题要考虑多方因素，不能非黑即白"  

就像孩子学步时会摔跤，我们学习新型沟通时也可能退回旧模式。但请记住：当您开始说"我为什么这么说"，孩子就开始听懂"爱为什么这样表达"。`,
        });

        // 场景结束消息
        setTimeout(() => {
          addMessage({
            type: "system",
            content:
              "场景结束。本项目完全没有改变您、甚至教育您的想法的意图。我们只想通过这个项目让您意识到：把隐藏在心里没说出口的那些话说出来，就能改善很多，仅此而已。感谢您的参与！",
          });
        }, 1500);
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
