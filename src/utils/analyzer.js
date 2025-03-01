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
  };

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

  // 根据积极分数生成结果
  let result = { ...defaultResult };

  if (positiveScore >= 3) {
    // 非常积极的回应
    result.healthImpact = 10;
    result.emotionImpact = 10;
    result.childResponse = "谢谢你理解我！我保证会注意安全的。";
    result.childInnerThought = "父母真的很尊重我，我感到被理解和支持。";
    result.summary = "您的回应非常积极，表达了关心的同时也尊重了孩子的感受。";
    result.communicationTips = [
      "继续保持这种开放和支持的沟通方式",
      "在设定界限的同时，解释原因并寻求共识",
      "鼓励孩子分享更多想法和感受",
    ];
  } else if (positiveScore >= 1) {
    // 较为积极的回应
    result.healthImpact = 5;
    result.emotionImpact = 5;
    result.childResponse = "我明白你的担心，我会注意安全的。";
    result.childInnerThought = "父母虽然有担忧，但至少愿意听我解释。";
    result.summary = "您的回应表达了关心，但可以更加注重倾听和理解孩子的感受。";
    result.communicationTips = [
      "在表达担忧的同时，也肯定孩子的想法",
      "提出具体的安全措施，而不是简单拒绝",
      "寻找双方都能接受的解决方案",
    ];
  } else if (positiveScore >= -1) {
    // 中性回应
    result.healthImpact = 0;
    result.emotionImpact = 0;
    result.childResponse = "嗯，我知道了...";
    result.childInnerThought = "父母似乎不太理解我，但也没有完全拒绝。";
    result.summary =
      "您的回应较为中性，既没有明显支持也没有强烈反对，可能让孩子感到困惑。";
    result.communicationTips = [
      "更清晰地表达您的想法和担忧",
      "主动询问孩子的感受和想法",
      "提出具体的解决方案或妥协方案",
    ];
  } else if (positiveScore >= -3) {
    // 较为消极的回应
    result.healthImpact = -5;
    result.emotionImpact = -5;
    result.childResponse = "好吧，我不去了...";
    result.childInnerThought = "父母总是不理解我，下次我可能就不会告诉他们了。";
    result.shouldShowSummary = true;
    result.summary =
      "您的回应可能让孩子感到被拒绝或不被理解，这可能影响孩子未来与您分享想法的意愿。";
    result.communicationTips = [
      "避免直接拒绝，而是解释您的担忧",
      "尝试理解孩子的需求和感受",
      "寻找替代方案，而不是简单否定",
    ];
  } else {
    // 非常消极的回应
    result.healthImpact = -15;
    result.emotionImpact = -15;
    result.childResponse = "...";
    result.childInnerThought =
      "父母根本不理解我，也不尊重我。以后我不会再和他们说这些事了。";
    result.shouldShowSummary = true;
    result.summary =
      "您的回应可能严重伤害了孩子的感受，让孩子感到被忽视、不被尊重或不被理解。";
    result.communicationTips = [
      "避免指责、比较或命令式的语言",
      "尝试从孩子的角度思考问题",
      "表达关心和担忧，而不是愤怒或失望",
      "寻求理解和共识，而不是强制服从",
    ];
  }

  return result;
};
