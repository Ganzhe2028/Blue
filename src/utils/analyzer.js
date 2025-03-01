// 分析用户回复的工具

/**
 * 分析用户回复并生成相应的反馈
 * @param {string} userResponse - 用户（父母）的回复
 * @param {object} stageData - 当前阶段的数据
 * @returns {object} 分析结果
 */
export const analyzeResponse = (userResponse, stageData) => {
  // 默认返回值
  const defaultResult = {
    healthImpact: -10,
    emotionImpact: -5,
    childResponse: "哦，好吧...",
    childInnerThought: "父母好像不太理解我的感受...",
    shouldShowSummary: false,
    summary: "您的回应可能让孩子感到被忽视或不被理解。",
    communicationTips: [
      "尝试表达您的担忧，同时也尊重孩子的感受",
      "避免直接拒绝，而是解释您的考虑",
      "寻找双方都能接受的解决方案",
    ],
    violenceIndex: 60, // 添加默认暴力沟通指数
    category: "一般表达", // 默认类别
  };

  // 如果是从快速回复选项中选择的
  if (stageData.quickReplies) {
    const selectedReply = stageData.quickReplies.find(
      (reply) => reply.text === userResponse
    );

    if (selectedReply) {
      // 根据选择的回复选项返回相应的分析结果
      let result = { ...defaultResult };

      // 设置暴力沟通指数和类别
      result.violenceIndex = selectedReply.violenceIndex;
      result.category = selectedReply.category;

      // 根据暴力沟通指数生成相应的结果
      if (selectedReply.violenceIndex <= 10) {
        // 非常积极的回应
        result.healthImpact = 15;
        result.emotionImpact = 15;
        result.childResponse = "谢谢你理解我！我真的很感激你能这样支持我。";
        result.childInnerThought =
          "父母真的很尊重我，我感到被理解和支持，这让我更愿意和他们分享我的想法。";
        result.summary =
          "您的回应非常积极，表达了理解、尊重和支持，这有助于建立健康的亲子关系。";
        result.communicationTips = [
          "继续保持这种理解和支持的沟通方式",
          "在设定界限的同时，解释原因并寻求共识",
          "鼓励孩子自主思考和决策",
        ];
      } else if (selectedReply.violenceIndex <= 30) {
        // 积极的回应
        result.healthImpact = 10;
        result.emotionImpact = 10;
        result.childResponse = "谢谢你能关心我的想法，我会注意安全的。";
        result.childInnerThought =
          "父母愿意倾听我的想法，这让我感到被尊重，虽然他们有担忧，但态度是友善的。";
        result.summary =
          "您的回应表达了关心和理解，同时也照顾到了安全问题，这种平衡的沟通方式有助于建立信任。";
        result.communicationTips = [
          "继续表达关心的同时，尊重孩子的意愿",
          "在表达担忧时，解释原因并提供选择",
          "寻找双方都能接受的解决方案",
        ];
      } else if (selectedReply.violenceIndex <= 50) {
        // 中性偏积极的回应
        result.healthImpact = 5;
        result.emotionImpact = 5;
        result.childResponse = "嗯，我明白你的担心。";
        result.childInnerThought =
          "父母有所顾虑，但至少愿意考虑我的需求，这已经比完全拒绝要好。";
        result.summary =
          "您的回应表达了关心，但可以更注重倾听和理解孩子的感受，减少使用命令式语言。";
        result.communicationTips = [
          "尝试用更多询问而非命令的方式表达",
          "在表达担忧的同时，也肯定孩子的想法",
          "寻找能满足安全需求同时尊重孩子意愿的方案",
        ];
      } else if (selectedReply.violenceIndex <= 70) {
        // 中性偏消极的回应
        result.healthImpact = -5;
        result.emotionImpact = -5;
        result.childResponse = "哦...好吧...";
        result.childInnerThought =
          "父母似乎不太理解我的感受，更关注他们自己的想法，这让我有些失望。";
        result.summary =
          "您的回应可能让孩子感到被忽视或不被理解，这可能影响他们今后与您分享想法的意愿。";
        result.communicationTips = [
          "尝试先理解孩子的感受和需求，再表达自己的担忧",
          "避免质疑或贬低孩子的想法和兴趣",
          "提供建设性的建议，而非简单否定",
        ];
        result.shouldShowSummary = true;
      } else if (selectedReply.violenceIndex <= 85) {
        // 消极的回应
        result.healthImpact = -10;
        result.emotionImpact = -10;
        result.childResponse = "...好吧，我知道了。";
        result.childInnerThought =
          "父母总是这样，从来不理解我。下次我可能就不会告诉他们了，免得又被拒绝。";
        result.summary =
          "您的回应可能伤害了孩子的感受，让他们感到不被尊重和理解，这会损害亲子关系和沟通。";
        result.communicationTips = [
          "避免使用命令、指责或比较的语言",
          "尝试从孩子的角度思考问题",
          "表达关心和担忧，而不是愤怒或失望",
          "寻求理解和共识，而不是强制服从",
        ];
        result.shouldShowSummary = true;
      } else {
        // 非常消极的回应
        result.healthImpact = -15;
        result.emotionImpact = -15;
        result.childResponse = "...";
        result.childInnerThought =
          "父母根本不尊重我，也不在乎我的感受。以后我不会再和他们讨论任何事情了。";
        result.summary =
          "您的回应严重伤害了孩子的感受，这种沟通方式会导致孩子关闭与您的沟通渠道，甚至产生逆反心理。";
        result.communicationTips = [
          "重新思考您的沟通方式，避免使用权威压制",
          "学习倾听和理解孩子的需求和感受",
          "表达关心时，避免使用贬低或指责的语言",
          "寻求专业帮助以改善家庭沟通模式",
        ];
        result.shouldShowSummary = true;
      }

      return result;
    }
  }

  // 如果不是从快速回复中选择的（用户输入的自定义回复）
  // 将用户回复转为小写以便分析
  const response = userResponse.toLowerCase();

  // 分析回复的积极性
  let positiveScore = 0;

  // 积极词汇和表达
  const positivePatterns = [
    "理解",
    "明白",
    "感受",
    "担心",
    "关心",
    "可以",
    "好的",
    "同意",
    "支持",
    "一起",
    "商量",
    "讨论",
    "计划",
    "安全",
    "帮助",
    "建议",
    "指导",
    "信任",
    "尊重",
    "爱",
    "喜欢",
  ];

  // 消极词汇和表达
  const negativePatterns = [
    "不行",
    "不可以",
    "不允许",
    "不能",
    "不准",
    "必须",
    "应该",
    "为什么",
    "怎么会",
    "差",
    "不好",
    "失望",
    "生气",
    "比较",
    "别人家",
    "小明",
    "小红",
    "命令",
    "要求",
    "惩罚",
    "后果",
  ];

  // 计算积极分数
  positivePatterns.forEach((pattern) => {
    if (response.includes(pattern)) {
      positiveScore += 1;
    }
  });

  // 计算消极分数
  negativePatterns.forEach((pattern) => {
    if (response.includes(pattern)) {
      positiveScore -= 1;
    }
  });

  // 分析回复的长度（更长的回复通常表示更多的解释和关注）
  if (response.length > 50) {
    positiveScore += 1;
  }

  // 分析是否包含问句（表示愿意了解更多）
  if (response.includes("?") || response.includes("？")) {
    positiveScore += 1;
  }

  // 根据积极分数计算暴力沟通指数（反向关系）
  // positiveScore范围约为-10到10，将其映射到0-100的暴力沟通指数
  const violenceIndex = Math.max(0, Math.min(100, 50 - positiveScore * 5));

  // 根据暴力沟通指数确定类别
  let category = "一般表达";
  if (violenceIndex <= 10) category = "理解支持";
  else if (violenceIndex <= 30) category = "关心询问";
  else if (violenceIndex <= 50) category = "实用询问";
  else if (violenceIndex <= 70) category = "质疑否定";
  else if (violenceIndex <= 85) category = "强硬拒绝";
  else category = "强制压制";

  // 根据暴力沟通指数生成结果
  let result = { ...defaultResult };
  result.violenceIndex = violenceIndex;
  result.category = category;

  if (violenceIndex <= 10) {
    // 非常积极的回应
    result.healthImpact = 15;
    result.emotionImpact = 15;
    result.childResponse = "谢谢你理解我！我真的很感激你能这样支持我。";
    result.childInnerThought =
      "父母真的很尊重我，我感到被理解和支持，这让我更愿意和他们分享我的想法。";
    result.summary =
      "您的回应非常积极，表达了理解、尊重和支持，这有助于建立健康的亲子关系。";
    result.communicationTips = [
      "继续保持这种理解和支持的沟通方式",
      "在设定界限的同时，解释原因并寻求共识",
      "鼓励孩子自主思考和决策",
    ];
  } else if (violenceIndex <= 30) {
    // 积极的回应
    result.healthImpact = 10;
    result.emotionImpact = 10;
    result.childResponse = "谢谢你能关心我的想法，我会注意安全的。";
    result.childInnerThought =
      "父母愿意倾听我的想法，这让我感到被尊重，虽然他们有担忧，但态度是友善的。";
    result.summary =
      "您的回应表达了关心和理解，同时也照顾到了安全问题，这种平衡的沟通方式有助于建立信任。";
    result.communicationTips = [
      "继续表达关心的同时，尊重孩子的意愿",
      "在表达担忧时，解释原因并提供选择",
      "寻找双方都能接受的解决方案",
    ];
  } else if (violenceIndex <= 50) {
    // 中性偏积极的回应
    result.healthImpact = 5;
    result.emotionImpact = 5;
    result.childResponse = "嗯，我明白你的担心。";
    result.childInnerThought =
      "父母有所顾虑，但至少愿意考虑我的需求，这已经比完全拒绝要好。";
    result.summary =
      "您的回应表达了关心，但可以更注重倾听和理解孩子的感受，减少使用命令式语言。";
    result.communicationTips = [
      "尝试用更多询问而非命令的方式表达",
      "在表达担忧的同时，也肯定孩子的想法",
      "寻找能满足安全需求同时尊重孩子意愿的方案",
    ];
  } else if (violenceIndex <= 70) {
    // 中性偏消极的回应
    result.healthImpact = -5;
    result.emotionImpact = -5;
    result.childResponse = "哦...好吧...";
    result.childInnerThought =
      "父母似乎不太理解我的感受，更关注他们自己的想法，这让我有些失望。";
    result.summary =
      "您的回应可能让孩子感到被忽视或不被理解，这可能影响他们今后与您分享想法的意愿。";
    result.communicationTips = [
      "尝试先理解孩子的感受和需求，再表达自己的担忧",
      "避免质疑或贬低孩子的想法和兴趣",
      "提供建设性的建议，而非简单否定",
    ];
    result.shouldShowSummary = true;
  } else if (violenceIndex <= 85) {
    // 消极的回应
    result.healthImpact = -10;
    result.emotionImpact = -10;
    result.childResponse = "...好吧，我知道了。";
    result.childInnerThought =
      "父母总是这样，从来不理解我。下次我可能就不会告诉他们了，免得又被拒绝。";
    result.summary =
      "您的回应可能伤害了孩子的感受，让他们感到不被尊重和理解，这会损害亲子关系和沟通。";
    result.communicationTips = [
      "避免使用命令、指责或比较的语言",
      "尝试从孩子的角度思考问题",
      "表达关心和担忧，而不是愤怒或失望",
      "寻求理解和共识，而不是强制服从",
    ];
    result.shouldShowSummary = true;
  } else {
    // 非常消极的回应
    result.healthImpact = -15;
    result.emotionImpact = -15;
    result.childResponse = "...";
    result.childInnerThought =
      "父母根本不尊重我，也不在乎我的感受。以后我不会再和他们讨论任何事情了。";
    result.summary =
      "您的回应严重伤害了孩子的感受，这种沟通方式会导致孩子关闭与您的沟通渠道，甚至产生逆反心理。";
    result.communicationTips = [
      "重新思考您的沟通方式，避免使用权威压制",
      "学习倾听和理解孩子的需求和感受",
      "表达关心时，避免使用贬低或指责的语言",
      "寻求专业帮助以改善家庭沟通模式",
    ];
    result.shouldShowSummary = true;
  }

  return result;
};
