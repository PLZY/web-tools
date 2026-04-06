export type Dimension = 'EI' | 'SN' | 'TF' | 'JP';
export type Pole = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

// ─── Classic MBTI (104 Questions) ─────────────────────────────────────────────
// 26 per dimension, 13 per pole — balanced and deduplicated
// yesType: which pole "agree / 符合" maps to
export interface ClassicQuestion {
  id: number;
  zh: string;
  en: string;
  dimension: Dimension;
  yesType: Pole;
}

export const classicQuestions: ClassicQuestion[] = [
  // ── E/I  (26 questions: 13 E + 13 I) ──────────────────────────────────────────
  // — E (Extroversion) —
  { id: 1,  zh: "你喜欢在人多的聚会上与各种人交谈，这让你感到精力充沛。", en: "You enjoy talking to many different people at large gatherings — it energizes you.", dimension: "EI", yesType: "E" },
  { id: 2,  zh: "遇到陌生人时，你通常会主动打招呼或攀谈。", en: "When you meet strangers, you usually initiate a greeting or conversation.", dimension: "EI", yesType: "E" },
  { id: 3,  zh: "在团队中，你自然而然地承担起带动气氛的角色。", en: "In a team, you naturally take on the role of energizing the group.", dimension: "EI", yesType: "E" },
  { id: 4,  zh: "你觉得一个人待太久会让你觉得无聊或不安。", en: "Being alone for too long makes you feel bored or restless.", dimension: "EI", yesType: "E" },
  { id: 5,  zh: "你更倾向于边说边想，在讨论中形成自己的观点。", en: "You tend to think out loud, forming your opinions during discussion.", dimension: "EI", yesType: "E" },
  { id: 6,  zh: "朋友遇到困难时，你更愿意当面陪伴他们，而不是发条消息。", en: "When friends are in trouble, you prefer being there in person rather than sending a message.", dimension: "EI", yesType: "E" },
  { id: 7,  zh: "你喜欢同时参与多个社交圈子，觉得这让生活更丰富。", en: "You enjoy being part of multiple social circles — it makes life richer.", dimension: "EI", yesType: "E" },
  { id: 8,  zh: "你更喜欢与人面对面沟通，而不是通过文字或邮件。", en: "You prefer face-to-face communication over text or email.", dimension: "EI", yesType: "E" },
  { id: 9,  zh: "当你有好消息时，你的第一反应是立刻告诉身边的人。", en: "When you have good news, your first impulse is to share it with people around you right away.", dimension: "EI", yesType: "E" },
  { id: 10, zh: "在小组讨论中，你经常是最先发言的那个人。", en: "In group discussions, you are often the first one to speak up.", dimension: "EI", yesType: "E" },
  { id: 11, zh: "你认为认识更多的人意味着更多的机会和可能性。", en: "You believe knowing more people means more opportunities and possibilities.", dimension: "EI", yesType: "E" },
  { id: 12, zh: "休息日你更愿意约朋友出去活动，而不是宅在家里。", en: "On days off you'd rather go out with friends than stay home.", dimension: "EI", yesType: "E" },
  { id: 13, zh: "你在需要获取信息时，更倾向于直接找人聊聊，而不是自己上网搜索。", en: "When you need information, you'd rather ask someone directly than search online yourself.", dimension: "EI", yesType: "E" },
  // — I (Introversion) —
  { id: 14, zh: "你更喜欢与少数几个亲密朋友共度时光，而不是参加大型聚会。", en: "You prefer spending time with a few close friends rather than attending large parties.", dimension: "EI", yesType: "I" },
  { id: 15, zh: "在社交场合中，你更喜欢观察和倾听，而不是成为焦点。", en: "In social settings, you prefer to observe and listen rather than be the center of attention.", dimension: "EI", yesType: "I" },
  { id: 16, zh: "一段时间的社交之后，你需要独处来恢复精力。", en: "After a period of socializing, you need time alone to recharge.", dimension: "EI", yesType: "I" },
  { id: 17, zh: "你通常在开口之前会在心里先把要说的话想清楚。", en: "You usually think through what you want to say before speaking.", dimension: "EI", yesType: "I" },
  { id: 18, zh: "你更喜欢在安静的环境中独自思考，而不是在嘈杂的环境中寻找灵感。", en: "You prefer thinking alone in a quiet environment rather than seeking inspiration in noisy places.", dimension: "EI", yesType: "I" },
  { id: 19, zh: "你更喜欢与人进行深入的一对一交流，而不是参与大群体的闲聊。", en: "You prefer deep one-on-one conversations over casual group chats.", dimension: "EI", yesType: "I" },
  { id: 20, zh: "你觉得与不太熟的人寒暄闲聊是一件消耗精力的事情。", en: "Making small talk with acquaintances feels draining to you.", dimension: "EI", yesType: "I" },
  { id: 21, zh: "你宁愿写邮件或发消息，也不太想打电话。", en: "You'd rather send an email or message than make a phone call.", dimension: "EI", yesType: "I" },
  { id: 22, zh: "当你需要做重要决定时，你更倾向于独自思考而非找人商量。", en: "When facing an important decision, you prefer to think it through alone rather than discuss it with others.", dimension: "EI", yesType: "I" },
  { id: 23, zh: "你对自己的内心世界有丰富而细腻的感受，但很少向外人分享。", en: "You have a rich and nuanced inner life, but rarely share it with others.", dimension: "EI", yesType: "I" },
  { id: 24, zh: "在一群人中，你常常感觉自己像个旁观者。", en: "In a group of people, you often feel like an outsider looking in.", dimension: "EI", yesType: "I" },
  { id: 25, zh: "你可以长时间沉浸在一项独自完成的活动中而不觉得寂寞。", en: "You can spend long periods absorbed in a solo activity without feeling lonely.", dimension: "EI", yesType: "I" },
  { id: 26, zh: "收到聚会邀请时，你的第一反应往往是犹豫而不是兴奋。", en: "When you receive a party invitation, your first reaction is usually hesitation rather than excitement.", dimension: "EI", yesType: "I" },

  // ── S/N  (26 questions: 13 S + 13 N) ──────────────────────────────────────────
  // — S (Sensing) —
  { id: 27, zh: "你更关注具体的事实和细节，而不是抽象的概念。", en: "You focus more on concrete facts and details rather than abstract concepts.", dimension: "SN", yesType: "S" },
  { id: 28, zh: "在学习新技能时，你更喜欢动手实操而不是先看理论。", en: "When learning a new skill, you prefer hands-on practice over reading theory first.", dimension: "SN", yesType: "S" },
  { id: 29, zh: "你更信赖亲眼所见和亲身经历，而不是推测和假设。", en: "You trust what you've seen and experienced firsthand more than speculation or assumptions.", dimension: "SN", yesType: "S" },
  { id: 30, zh: "你擅长记住具体的日期、数字和事件细节。", en: "You are good at remembering specific dates, numbers, and event details.", dimension: "SN", yesType: "S" },
  { id: 31, zh: "你更喜欢按照已经被证明有效的方法做事。", en: "You prefer doing things using methods that have already been proven to work.", dimension: "SN", yesType: "S" },
  { id: 32, zh: "在讨论问题时，你更倾向于用具体的例子来说明观点。", en: "When discussing issues, you prefer to illustrate your points with concrete examples.", dimension: "SN", yesType: "S" },
  { id: 33, zh: "比起想象未来的可能性，你更关心当下需要解决的实际问题。", en: "You care more about practical problems that need solving now than imagining future possibilities.", dimension: "SN", yesType: "S" },
  { id: 34, zh: "你觉得做事最重要的是脚踏实地，一步一步来。", en: "You believe the most important thing in getting work done is being grounded and taking it step by step.", dimension: "SN", yesType: "S" },
  { id: 35, zh: "你更喜欢有清晰指引的任务，而不是需要自己摸索方向的任务。", en: "You prefer tasks with clear instructions over those where you have to figure out the direction yourself.", dimension: "SN", yesType: "S" },
  { id: 36, zh: "你在描述事物时倾向于准确和具体，而不是使用隐喻和比喻。", en: "When describing things, you tend to be precise and specific rather than using metaphors.", dimension: "SN", yesType: "S" },
  { id: 37, zh: "你更关注眼前能触碰到的现实，而不是脑海中浮现的各种可能性。", en: "You focus more on tangible reality in front of you than the possibilities forming in your mind.", dimension: "SN", yesType: "S" },
  { id: 38, zh: "你更关注事物的实际应用和效果，而不是它背后的深层含义。", en: "You focus more on the practical applications and effects of things rather than their deeper meaning.", dimension: "SN", yesType: "S" },
  { id: 39, zh: "你阅读时更喜欢实用类的内容（指南、教程），而不是哲学或科幻。", en: "You prefer reading practical content (guides, tutorials) over philosophy or science fiction.", dimension: "SN", yesType: "S" },
  // — N (Intuition) —
  { id: 40, zh: "你更喜欢探索新的想法和可能性，而不是遵循传统的方法。", en: "You prefer exploring new ideas and possibilities over following traditional methods.", dimension: "SN", yesType: "N" },
  { id: 41, zh: "你经常在脑海中构想各种未来的场景和可能性。", en: "You often envision various future scenarios and possibilities in your mind.", dimension: "SN", yesType: "N" },
  { id: 42, zh: "你更关注事物的潜在含义和深层联系，而不是表面的特征。", en: "You focus more on the underlying meaning and deeper connections of things rather than surface features.", dimension: "SN", yesType: "N" },
  { id: 43, zh: "你常常能在看似无关的事物之间发现意想不到的联系。", en: "You often discover unexpected connections between seemingly unrelated things.", dimension: "SN", yesType: "N" },
  { id: 44, zh: "比起已有的解决方案，你更喜欢寻找全新的思路。", en: "Rather than using existing solutions, you prefer to find entirely new approaches.", dimension: "SN", yesType: "N" },
  { id: 45, zh: "你更喜欢通过阅读和思考来获取知识，而不是通过动手实操。", en: "You prefer acquiring knowledge through reading and thinking rather than hands-on practice.", dimension: "SN", yesType: "N" },
  { id: 46, zh: "你倾向于先把握事物的整体方向，再去关注具体的细节。", en: "You tend to grasp the big picture first, then attend to the specifics.", dimension: "SN", yesType: "N" },
  { id: 47, zh: "你对抽象的理论和概念有天然的兴趣和理解力。", en: "You have a natural interest in and aptitude for abstract theories and concepts.", dimension: "SN", yesType: "N" },
  { id: 48, zh: "你经常觉得现实世界的限制让你感到束缚。", en: "You often feel constrained by the limitations of the real world.", dimension: "SN", yesType: "N" },
  { id: 49, zh: "你更关注事物的发展趋势和未来走向，而不是眼下的现状。", en: "You focus more on trends and future directions than on the present situation.", dimension: "SN", yesType: "N" },
  { id: 50, zh: "你在对话中常常进行类比和联想，思维跳跃性较强。", en: "In conversations, you frequently make analogies and associations — your thinking is quite leaps-and-bounds.", dimension: "SN", yesType: "N" },
  { id: 51, zh: "你喜欢探讨哲学、心理学或其他关于人类本质的话题。", en: "You enjoy discussing philosophy, psychology, or other topics about the nature of humanity.", dimension: "SN", yesType: "N" },
  { id: 52, zh: "你更容易被一个创新但未经验证的方案所吸引，而不是成熟稳妥的方案。", en: "You're more attracted to an innovative but unproven approach than a tried-and-true one.", dimension: "SN", yesType: "N" },

  // ── T/F  (26 questions: 13 T + 13 F) ──────────────────────────────────────────
  // — T (Thinking) —
  { id: 53, zh: "在解决问题时，你更倾向于依赖逻辑和分析，而不是个人感受。", en: "When solving problems, you rely more on logic and analysis than on personal feelings.", dimension: "TF", yesType: "T" },
  { id: 54, zh: "你认为做决定时，事实和数据比感受更重要。", en: "You believe facts and data matter more than feelings when making decisions.", dimension: "TF", yesType: "T" },
  { id: 55, zh: "别人向你倾诉烦恼时，你的第一反应是帮他们分析问题而不是安慰。", en: "When others share their troubles, your first instinct is to analyze the problem rather than offer comfort.", dimension: "TF", yesType: "T" },
  { id: 56, zh: "你更看重一个方案的效率和可行性，而不是它对人们情绪的影响。", en: "You value a plan's efficiency and feasibility over its emotional impact on people.", dimension: "TF", yesType: "T" },
  { id: 57, zh: "你倾向于直接指出问题所在，即使这可能让对方感到不舒服。", en: "You tend to point out problems directly, even if it might make someone uncomfortable.", dimension: "TF", yesType: "T" },
  { id: 58, zh: "在争论中，你更在乎谁的观点逻辑上更站得住脚。", en: "In an argument, you care more about whose position is logically stronger.", dimension: "TF", yesType: "T" },
  { id: 59, zh: "你觉得公平意味着每个人遵守相同的规则，而不是考虑个人特殊情况。", en: "You think fairness means everyone follows the same rules, not accommodating individual circumstances.", dimension: "TF", yesType: "T" },
  { id: 60, zh: "在评价别人的工作时，你更关注成果质量而不是他们付出了多少努力。", en: "When evaluating someone's work, you focus on output quality rather than how much effort they put in.", dimension: "TF", yesType: "T" },
  { id: 61, zh: "你不太容易因为别人的情绪而改变自己已经做出的理性判断。", en: "You're not easily swayed by others' emotions once you've reached a rational conclusion.", dimension: "TF", yesType: "T" },
  { id: 62, zh: "在面对争议时，你更倾向于坚持自己的原则，而不是为了和谐而妥协。", en: "In the face of disputes, you prefer to uphold your principles rather than compromise for the sake of harmony.", dimension: "TF", yesType: "T" },
  { id: 63, zh: "你更欣赏头脑清晰、逻辑严密的人，而不是感性且善于表达情感的人。", en: "You admire people who are clear-headed and logically rigorous more than those who are emotional and expressive.", dimension: "TF", yesType: "T" },
  { id: 64, zh: "你觉得做事应该就事论事，不应该掺杂个人好恶。", en: "You believe work should be handled objectively, without mixing in personal likes or dislikes.", dimension: "TF", yesType: "T" },
  { id: 65, zh: "你更倾向于用客观的标准来衡量成功，而不是主观的满意度。", en: "You prefer measuring success by objective standards rather than subjective satisfaction.", dimension: "TF", yesType: "T" },
  // — F (Feeling) —
  { id: 66, zh: "你在做决定时会优先考虑这个决定对相关人员情感的影响。", en: "When making decisions, you prioritize how the decision will affect the feelings of those involved.", dimension: "TF", yesType: "F" },
  { id: 67, zh: "你很容易感受到周围人的情绪变化，哪怕他们没有表达出来。", en: "You easily pick up on the emotional changes of people around you, even when they don't express them.", dimension: "TF", yesType: "F" },
  { id: 68, zh: "你更倾向于通过协商和妥协来解决冲突，而不是分出对错。", en: "You prefer resolving conflicts through negotiation and compromise rather than determining who is right or wrong.", dimension: "TF", yesType: "F" },
  { id: 69, zh: "你认为在团队中维持和谐的氛围比追求最优方案更重要。", en: "You believe maintaining a harmonious team atmosphere is more important than pursuing the optimal solution.", dimension: "TF", yesType: "F" },
  { id: 70, zh: "当你需要给别人提意见时，你会花很多心思在措辞上以免伤到对方。", en: "When you need to give someone feedback, you spend a lot of thought on wording to avoid hurting them.", dimension: "TF", yesType: "F" },
  { id: 71, zh: "你更看重一个人的善意和真心，而不是他们的能力和成就。", en: "You value a person's kindness and sincerity more than their ability and achievements.", dimension: "TF", yesType: "F" },
  { id: 72, zh: "看到别人遇到不幸的事情，你会不由自主地产生强烈的共情。", en: "When you see others going through hardship, you can't help but feel strong empathy.", dimension: "TF", yesType: "F" },
  { id: 73, zh: "你根据个人的价值观和信念来做重要决定，而不是纯粹的利弊分析。", en: "You make important decisions based on personal values and beliefs rather than pure cost-benefit analysis.", dimension: "TF", yesType: "F" },
  { id: 74, zh: "你更愿意帮助他人解决情感问题，而不是纯技术性的问题。", en: "You'd rather help others with emotional issues than purely technical ones.", dimension: "TF", yesType: "F" },
  { id: 75, zh: "当批评显得太过直接时，即使内容正确，你也会觉得不舒服。", en: "When criticism is too blunt, even if it's accurate, it makes you uncomfortable.", dimension: "TF", yesType: "F" },
  { id: 76, zh: "你认为一个决定如果伤害了人际关系，就不能算是好决定。", en: "You believe a decision that damages relationships cannot be considered a good one.", dimension: "TF", yesType: "F" },
  { id: 77, zh: "你更倾向于考虑每个人的特殊情况，而不是一刀切地执行规则。", en: "You tend to consider each person's special circumstances rather than applying rules uniformly.", dimension: "TF", yesType: "F" },
  { id: 78, zh: "在评价他人时，你更看重他们的出发点和用心程度，而不是最终结果。", en: "When evaluating others, you weigh their intentions and effort more than the final outcome.", dimension: "TF", yesType: "F" },

  // ── J/P  (26 questions: 13 J + 13 P) ──────────────────────────────────────────
  // — J (Judging) —
  { id: 79,  zh: "你更喜欢有计划和安排的活动，而不是即兴的活动。", en: "You prefer planned and scheduled activities over spontaneous ones.", dimension: "JP", yesType: "J" },
  { id: 80,  zh: "在开始工作之前，你习惯先列出详细的待办事项清单。", en: "Before starting work, you habitually create a detailed to-do list.", dimension: "JP", yesType: "J" },
  { id: 81,  zh: "你喜欢在截止日期之前就提前完成任务，留出缓冲时间。", en: "You like to finish tasks well before the deadline, leaving a buffer.", dimension: "JP", yesType: "J" },
  { id: 82,  zh: "你觉得东西放在固定的位置让你感到安心和高效。", en: "Having things in their designated place makes you feel secure and efficient.", dimension: "JP", yesType: "J" },
  { id: 83,  zh: "当计划被突然改变时，你会感到明显的不适或焦虑。", en: "When plans are suddenly changed, you feel noticeably uncomfortable or anxious.", dimension: "JP", yesType: "J" },
  { id: 84,  zh: "你更喜欢有明确截止日期的任务，而不是没有期限的任务。", en: "You prefer tasks with clear deadlines over open-ended ones.", dimension: "JP", yesType: "J" },
  { id: 85,  zh: "你倾向于尽早做出决定，而不是一直犹豫不决。", en: "You tend to make decisions early rather than staying undecided.", dimension: "JP", yesType: "J" },
  { id: 86,  zh: "你的桌面和文件夹通常井然有序，分类清晰。", en: "Your desktop and folders are usually well organized with clear categories.", dimension: "JP", yesType: "J" },
  { id: 87,  zh: "你觉得遵守规则和流程是保证效率的基本前提。", en: "You believe following rules and processes is a fundamental prerequisite for efficiency.", dimension: "JP", yesType: "J" },
  { id: 88,  zh: "你在出行前会做好详细的行程规划。", en: "Before traveling, you make detailed itinerary plans.", dimension: "JP", yesType: "J" },
  { id: 89,  zh: "你认为每天都应该有明确的目标和安排，不喜欢虚度时间。", en: "You believe every day should have clear goals and plans — you dislike wasting time.", dimension: "JP", yesType: "J" },
  { id: 90,  zh: "在与他人合作时，你更喜欢明确分工，各司其职。", en: "When collaborating with others, you prefer clear division of labor with defined roles.", dimension: "JP", yesType: "J" },
  { id: 91,  zh: "完成所有待办事项会给你带来极大的满足感。", en: "Checking off all your to-do items gives you immense satisfaction.", dimension: "JP", yesType: "J" },
  // — P (Perceiving) —
  { id: 92,  zh: "你更喜欢保持灵活和开放，而不是被严格的计划约束。", en: "You prefer staying flexible and open rather than being bound by rigid plans.", dimension: "JP", yesType: "P" },
  { id: 93,  zh: "你经常在截止日期临近时爆发出惊人的效率。", en: "You often produce astonishing efficiency as a deadline approaches.", dimension: "JP", yesType: "P" },
  { id: 94,  zh: "你觉得太多规则和框架会扼杀创造力。", en: "You feel that too many rules and frameworks stifle creativity.", dimension: "JP", yesType: "P" },
  { id: 95,  zh: "你更愿意在项目进行中根据新情况调整方向，而不是死守原计划。", en: "You prefer to adjust direction as new situations arise during a project rather than stick rigidly to the original plan.", dimension: "JP", yesType: "P" },
  { id: 96,  zh: "你的工作台面可能看起来很乱，但你知道所有东西在哪里。", en: "Your workspace might look messy, but you know where everything is.", dimension: "JP", yesType: "P" },
  { id: 97,  zh: "你更喜欢能够自由掌控自己时间节奏的工作方式。", en: "You prefer a work style where you can freely control your own pace and schedule.", dimension: "JP", yesType: "P" },
  { id: 98,  zh: "做决定对你来说是件困难的事情，因为你总觉得可能还有更好的选择。", en: "Making decisions is hard for you because you always feel there might be a better option.", dimension: "JP", yesType: "P" },
  { id: 99,  zh: "你更享受探索和开始新事物的过程，而不是把事情收尾。", en: "You enjoy the process of exploring and starting new things more than finishing them.", dimension: "JP", yesType: "P" },
  { id: 100, zh: "你觉得旅行最好不要做太详细的计划，随性走走更有趣。", en: "You think traveling is more fun without a detailed plan — spontaneous wandering is better.", dimension: "JP", yesType: "P" },
  { id: 101, zh: "你同时进行多个任务时不会觉得焦虑，反而觉得很刺激。", en: "Juggling multiple tasks at once doesn't stress you — it actually excites you.", dimension: "JP", yesType: "P" },
  { id: 102, zh: "你更喜欢在项目开始时有一个大致的方向，而不是详细的计划。", en: "You prefer having a general direction at the start of a project rather than a detailed plan.", dimension: "JP", yesType: "P" },
  { id: 103, zh: "你经常因为发现了更有趣的事情而中途改变原来的计划。", en: "You often change your original plans midway because you discovered something more interesting.", dimension: "JP", yesType: "P" },
  { id: 104, zh: "你觉得生活中最好的体验往往来自计划之外的意外惊喜。", en: "You believe the best experiences in life often come from unexpected surprises outside your plans.", dimension: "JP", yesType: "P" },
];

// ─── Office MBTI (牛马 MBTI, 20 Questions) ──────────────────────────────────
export interface OfficeQuestion {
  id: number;
  dimension: Dimension;
  question: string;
  questionEn: string;
  options: Array<{ text: string; textEn: string; type: Pole }>;
}

export const officeQuestions: OfficeQuestion[] = [
  // E/I dimension
  {
    id: 1, dimension: "EI",
    question: '领导在全员群 @ 所有人："谁有空帮我处理件事？"你的第一反应是：',
    questionEn: 'Your boss sends an @everyone: "Anyone free to help me out with something?" You:',
    options: [
      { text: '秒回「我来！」——反正先抢到再说，大不了加班搞。', textEn: 'Reply instantly "On it!" — grab it first, figure it out later.', type: "E" },
      { text: '私聊领导"我有时间"，主动请缨但不在群里抢，显得稳重。', textEn: 'DM the boss "I have bandwidth" — proactive but not flashy.', type: "E" },
      { text: '把手机扣过去，默默数到60，祈祷有人比我更闲。', textEn: 'Flip your phone face-down and count to 60, hoping someone else grabs it.', type: "I" },
      { text: '已读不回，开始装作刷新页面，四十分钟后若无其事出现。', textEn: 'Mark it read, pretend to refresh a page, reappear casually 40 minutes later.', type: "I" },
    ]
  },
  {
    id: 2, dimension: "EI",
    question: '公司团建，领导提议大家围成一圈玩"真心话大冒险"，你的状态是：',
    questionEn: 'Team building: your boss suggests a round of "Truth or Dare." Your reaction:',
    options: [
      { text: '立刻兴奋，甚至已经想好怎么用大冒险敬老板一杯酒了。', textEn: 'Instantly pumped — already planning how to use a dare to toast the boss.', type: "E" },
      { text: '主动设计规则升级版，当起了主持人，把所有人都带动起来了。', textEn: "Volunteer to host, upgrade the rules, and get everyone hyped.", type: "E" },
      { text: '天塌了，借口去上厕所，在马桶上坐了整整半个小时。', textEn: "The sky falls. You excuse yourself to the bathroom and sit there for 30 minutes.", type: "I" },
      { text: '全程参与但内心独白能写五千字，回家躺到凌晨才缓过来。', textEn: "Participate the whole time, but your internal monologue fills a novel. Decompress until 2am.", type: "I" },
    ]
  },
  {
    id: 3, dimension: "EI",
    question: '新员工入职，HR 要求每人在全员大会上自我介绍 3 分钟，你：',
    questionEn: 'HR requires a 3-minute self-introduction at the all-hands meeting. You:',
    options: [
      { text: '提前准备好 PPT，顺便把自己的业绩亮点和专业技能全植入进去了。', textEn: 'Build a slide deck. Embed your highlights, skills, and contact info while you\'re at it.', type: "E" },
      { text: '发现自己挺享受被关注的感觉，讲超时了 5 分钟，HR 两次示意才停。', textEn: 'Realize you enjoy the spotlight. Go 5 minutes over. HR signals you twice to stop.', type: "E" },
      { text: '稿子写了删删了写，背了三十遍，上台还是忘了后半段，靠即兴硬撑过去。', textEn: 'Rewrite your speech repeatedly, memorize it 30 times, still blank on stage halfway through.', type: "I" },
      { text: '失眠了整整两天，认真评估过是否辞职来规避这件事。', textEn: "Can't sleep for two days. Seriously consider quitting just to avoid it.", type: "I" },
    ]
  },
  {
    id: 4, dimension: "EI",
    question: '下班碰到领导，TA 说："正好，咱们走一段，聊聊你最近的情况。"你：',
    questionEn: 'Leaving work, your boss says: "Perfect timing — walk with me, catch me up on things." You:',
    options: [
      { text: '内心窃喜，这是建立单独链接的黄金机会，把近期成果默默整理了一遍再开口。', textEn: "Internally thrilled — golden one-on-one time. Mentally organize your wins before speaking.", type: "E" },
      { text: '一路聊下来意犹未尽，话题从工作扩展到行业判断，聊了四十分钟。', textEn: "End up chatting 40 minutes, from project updates to industry takes. Still want more.", type: "E" },
      { text: '掏出手机假装突然接到紧急电话，对视一秒，快步逃走。', textEn: "Pull out your phone, fake an urgent call, make eye contact for one second, and speed-walk away.", type: "I" },
      { text: '硬撑着聊完了，回家瘫倒在沙发上，充电两小时才恢复。', textEn: "Survive the whole walk on autopilot. Collapse on the sofa at home and recharge for two hours.", type: "I" },
    ]
  },
  {
    id: 5, dimension: "EI",
    question: '公司群已经沉寂了三天，你会：',
    questionEn: 'The company group chat has been silent for three days. You:',
    options: [
      { text: '发个行业热点链接，@几个人问问看法，把气氛带起来。', textEn: "Drop an industry article, @a few people for their take, restart the energy.", type: "E" },
      { text: '觉得群太安静不正常，找个理由发个通知，顺带刷一下存在感。', textEn: "Feel uneasy with the silence. Find an excuse to post and remind people you exist.", type: "E" },
      { text: '庆幸终于安静了，默默设置了免打扰，并希望这个状态持续一个月。', textEn: "Celebrate internally. Mute the chat and hope this peace lasts a month.", type: "I" },
      { text: '以为公司倒了，点开确认了一下，发现大家只是都在摸鱼，放心地继续沉默。', textEn: "Briefly suspect the company collapsed. Check, confirm everyone's just slacking. Return to silence.", type: "I" },
    ]
  },
  // S/N dimension
  {
    id: 6, dimension: "SN",
    question: '年终大会上，CEO 慷慨激昂地谈"出海战略"和"底层架构重组"，你在想：',
    questionEn: 'At the year-end all-hands, the CEO is passionately discussing "global expansion" and "architectural overhaul." You\'re thinking:',
    options: [
      { text: '年终奖到底多少，什么时候打到卡上，具体数字是多少。', textEn: "One thing: how much is my bonus, and exactly when does it hit my account.", type: "S" },
      { text: '这个战略对我部门的 KPI 影响有多大，能不能争到更多资源。', textEn: "How this strategy affects my team's KPIs and whether you can argue for more headcount.", type: "S" },
      { text: '听得热血沸腾，已经在脑子里把公司业务扩展到了十二个国家。', textEn: "Eyes glazing with excitement — already mentally expanding the business to twelve countries.", type: "N" },
      { text: '开始想象公司上市那天敲锣的画面，顺便算了一下期权大概值多少钱。', textEn: "Picturing the IPO bell-ringing ceremony and roughly calculating what your options would be worth.", type: "N" },
    ]
  },
  {
    id: 7, dimension: "SN",
    question: '老板问你："这件事大概多久能搞定？"你：',
    questionEn: 'Your manager asks: "How long do you think this will take?" You:',
    options: [
      { text: '细细拆解：资料准备1天，执行推进3天，修改收尾1天，报上去就是5天，不含风险冗余。', textEn: "Break it down: prep 1d, execution 3d, revisions 1d — 5 days total, excluding risk buffer.", type: "S" },
      { text: '对照历史类似任务，给出靠谱估算，顺带把风险点也列出来了。', textEn: "Reference a similar past task, give a solid estimate, and flag the risks too.", type: "S" },
      { text: '「说不好，要看整体思路——如果换个角度重新梳理，说不定效率更高？」', textEn: '"Hard to say — but if we rethink the approach here, we might actually go faster overall?"', type: "N" },
      { text: '思路已经飘到一个更优化的方案上了，忘了回答这个问题。', textEn: "Your mind drifts to a more elegant approach. You forget to actually answer.", type: "N" },
    ]
  },
  {
    id: 8, dimension: "SN",
    question: '领导随口一句："这件事应该挺简单吧？"你：',
    questionEn: 'Your manager casually says: "This should be pretty simple, right?" You:',
    options: [
      { text: '掰手指列出涉及的每个环节，报出一个让领导眼神瞬间变复杂的工作量。', textEn: "Count off every step involved and quote a workload that makes your manager's expression change.", type: "S" },
      { text: '把实际流程整理出来，现场拆解为什么"简单"二字用错了地方，有理有据。', textEn: 'Map out the actual process on the spot and explain why "simple" is the wrong word. With receipts.', type: "S" },
      { text: '陷入深深的沉思：如果从头优化整个流程，其实有个更高效的方案……会议结束了。', textEn: "Fall into deep thought: if we redesigned the whole process there's actually a more efficient solution… the meeting ends.", type: "N" },
      { text: '「这背后的问题值得深挖，我感觉我们可以设计一个更系统化的解决方案……」', textEn: '"The deeper issue here is worth exploring — I think we could design something more systemic…"', type: "N" },
    ]
  },
  {
    id: 9, dimension: "SN",
    question: '季度 OKR 制定，你写出来的目标是：',
    questionEn: "It's OKR season. The goals you write look like:",
    options: [
      { text: '每条精准可量化：出错率降低 X%，完成任务 X 项，客户满意度提升 X 分。', textEn: "Fully measurable: reduce error rate X%, complete X tasks, raise satisfaction score by X points.", type: "S" },
      { text: '逐条对照上季度完成情况修订，确保可执行、可追踪、能打分。', textEn: "Carefully revised from last quarter's actuals. Trackable and scoreable at the end.", type: "S" },
      { text: '充满格局：「探索 AI 赋能业务的可能性」「推动团队文化跃迁」「引领行业认知升级」。', textEn: 'Visionary: "Explore AI\'s role in empowering the business." "Drive a cultural leap in the team."', type: "N" },
      { text: '写了一半，被自己的一个想法打岔，去查了两小时资料，OKR 没写完。', textEn: "Half-written — got distracted by an idea, went down a research rabbit hole. OKR: unfinished.", type: "N" },
    ]
  },
  {
    id: 10, dimension: "SN",
    question: '同事找你说："我有个能改变行业的想法，想听你意见。"你的第一反应是：',
    questionEn: 'A coworker says: "I have an idea that could disrupt the industry. Want to hear it?" You:',
    options: [
      { text: '先问：竞品是谁？用户在哪？收入模型是什么？启动资金从哪来？', textEn: "First question: who are the competitors? Where are the users? What's the revenue model? Where does funding come from?", type: "S" },
      { text: '听完给出五个具体的市场调研建议和落地步骤。', textEn: "Hear them out and give five concrete market research steps and an execution plan.", type: "S" },
      { text: '眼神亮了，帮 TA 联想出了十二个衍生可能性，聊了三小时还没说完。', textEn: "Eyes light up. Help them spin out twelve possibilities. Three hours in, still going.", type: "N" },
      { text: '已经在脑子里把这个想法改造成了一个自己更兴奋的版本，并开始推销新版本。', textEn: "Mentally rework their idea into a version you find more exciting, and start pitching that instead.", type: "N" },
    ]
  },
  // T/F dimension
  {
    id: 11, dimension: "TF",
    question: '别的部门拖延导致你项目延期，领导在群里问责，你怎么回：',
    questionEn: "Another team's delay causes your project to slip. Your manager asks publicly in the group chat. You reply:",
    options: [
      { text: '迅速甩出满屏截图，证据链完整，逻辑严密，全程零情绪：「时间线在这里。」', textEn: 'Fire off a stack of screenshots. Evidence complete, logic airtight, zero emotion: "Timeline is here."', type: "T" },
      { text: '发了一份详细时间线分析，用数据说明问题根源，不带任何感情色彩。', textEn: "Share a clean timeline analysis, lay out the root cause with data, no personal feelings.", type: "T" },
      { text: '发了句「中间沟通出了点小偏差，正在加紧对齐🙏」，帮所有人都找了个台阶。', textEn: 'Post: "There was a small communication gap — we\'re syncing urgently to resolve it 🙏" and give everyone a face-saving exit.', type: "F" },
      { text: '会后悄悄联系对方部门，商量好口径再统一回复，避免双方当众撕破脸。', textEn: "Reach out to the other team privately afterward, align on a shared narrative, avoid a public blame game.", type: "F" },
    ]
  },
  {
    id: 12, dimension: "TF",
    question: '绩效面谈，领导说你今年表现"有待提升"，你的内心活动是：',
    questionEn: 'Performance review. Your manager says you "need improvement." Internally:',
    options: [
      { text: '当场追问：具体哪些指标？对比基准是什么？改进方向在哪？复盘清单已经在脑子里了。', textEn: "Immediately ask: which metrics? What's the benchmark? The improvement checklist is already forming in your head.", type: "T" },
      { text: '面谈结束立刻开了个自我复盘文档，逐条拆解根因和解法。', textEn: "Open a self-review doc right after the meeting. Break down root causes and solutions line by line.", type: "T" },
      { text: '那天晚上失眠，翻来覆去回想过去一年哪里做错了，难过了整整一个星期。', textEn: "Can't sleep that night, replaying the whole year. Upset for a full week.", type: "F" },
      { text: '表面点头称是，出了会议室眼眶有点红，找了个没人的地方待了一会儿。', textEn: "Hold it together in the room. Back outside, eyes a little red. Find somewhere quiet for a few minutes.", type: "F" },
    ]
  },
  {
    id: 13, dimension: "TF",
    question: '花了整整一个月做的方案，临提交前被告知直接取消了，你：',
    questionEn: "You spend a month on a plan. Right before submission, it's cancelled. You:",
    options: [
      { text: '淡定问：原因是什么？有什么内容还能复用吗？下一项任务排到哪了？', textEn: "Calmly ask: why? Is anything salvageable? What's the next task?", type: "T" },
      { text: '第一反应是快速梳理一遍，看看有没有能保留再利用的内容，把损失降到最低。', textEn: "First move: quickly scan for anything reusable before it all goes cold.", type: "T" },
      { text: '心里像压了块石头，找了个没人的地方发了五分钟呆，才缓过来继续搬砖。', textEn: "A weight lands on your chest. Find a quiet corner, stare at nothing for five minutes, then carry on.", type: "F" },
      { text: '暗暗替那些一直等待的人感到遗憾……算了，叹口气，继续下一件事吧。', textEn: "Feel quietly sorry for everyone who was waiting… Oh well. Sigh. Next thing.", type: "F" },
    ]
  },
  {
    id: 14, dimension: "TF",
    question: '同事突然在工作群发来一个「在吗」，你的第一反应是：',
    questionEn: 'A coworker messages you out of nowhere with just "hey." Your first reaction:',
    options: [
      { text: '直接回「有事说」，节省双方时间，世界上最浪费时间的三个字就是「在吗」。', textEn: '"Say what you need — I\'m not a customer service bot." Time is valuable.', type: "T" },
      { text: '没有多余反应，等对方说事，时间是宝贵的，不搞情绪铺垫。', textEn: "No extra reaction. Wait for them to get to the point. Time is valuable.", type: "T" },
      { text: '开始脑补：TA最近好像有些奇怪，是不是上次的事情还没过去？', textEn: "Start spiraling: they've seemed a bit off lately. Is it about that thing from last week?", type: "F" },
      { text: '回了个「在」，然后盯着对话框越看越焦虑，已经脑补了三个不同的灾难剧情。', textEn: 'Reply "hey," then stare at the chat window getting increasingly anxious. Three disaster scenarios already drafted.', type: "F" },
    ]
  },
  {
    id: 15, dimension: "TF",
    question: '甲方提出了一个明显不合理的要求，会议室里大家都沉默了，你会：',
    questionEn: 'A client makes a clearly unreasonable demand. The whole meeting room goes quiet. You:',
    options: [
      { text: '直接开口，用数据和逻辑指出问题，说明为什么这个方向走不通。', textEn: "Speak up, lay out the data, and explain logically why this direction won't work.", type: "T" },
      { text: '当场提出一个替代方案，逻辑清晰，快速推动决策，让大家尽快散会。', textEn: "Immediately propose a concrete alternative and steer everyone toward a decision.", type: "T" },
      { text: '先顺着肯定了一句，再温和地引导到一个双方都能接受的折中方案。', textEn: "Affirm their intent first, then gently steer toward a compromise both sides can accept.", type: "F" },
      { text: '会后单独找甲方负责人私聊，委婉解释，避免在大会上让他下不了台。', textEn: "Pull the client contact aside afterward for a private, face-saving conversation.", type: "F" },
    ]
  },
  // J/P dimension
  {
    id: 16, dimension: "JP",
    question: '周五 19:00，本来可以下班，但下周一有个不紧急的汇报，你会：',
    questionEn: "It's 7pm Friday. You could leave, but there's a non-urgent presentation Monday. You:",
    options: [
      { text: '加一小时班今天搞完，绝不让工作恶心到我宝贵的双休，心里才踏实。', textEn: "Stay an extra hour and finish it now. Not letting work ruin my weekend.", type: "J" },
      { text: '今天把框架搭好、材料整理完，周一只需要填充，提前完成留有余量。', textEn: "Get the structure and materials done tonight. Monday is just a quick fill-in. Buffer included.", type: "J" },
      { text: '果断关机走人！周日晚上 11 点的我会创造奇迹的，这是经验之谈。', textEn: "Shut everything down and leave. Sunday-night-me will create a miracle. This is a documented fact.", type: "P" },
      { text: '周一早上 9 点，开会前 15 分钟，颤抖着打开 PPT，边开会边即兴填内容。', textEn: "Monday morning, 15 minutes before the meeting, open the deck for the first time and improvise live.", type: "P" },
    ]
  },
  {
    id: 17, dimension: "JP",
    question: '月初收到新的月度工作任务，你的第一件事是：',
    questionEn: "You receive next month's tasks on the first. First thing you do:",
    options: [
      { text: '打开 Excel，拆解任务，排好优先级，在日历上标好每个里程碑。', textEn: "Open a spreadsheet, break down tasks by priority, mark every milestone on the calendar.", type: "J" },
      { text: '当天下午就推进第一项，早启动早结束，绝不把压力堆到月底。', textEn: "Start pushing on the first task that same afternoon. Early start, early finish, no month-end crunch.", type: "J" },
      { text: '任务清单截图存手机，心想"月底前应该能搞完"，然后关掉继续刷视频。', textEn: 'Screenshot the task list, think "I\'ll finish by month-end," close it, and keep scrolling.', type: "P" },
      { text: '看了一眼没啥紧迫感，先处理今天有的事，之后的事到时候再说。', textEn: "Skim it, feel no urgency, deal with today's fire first. That stuff is future-me's problem.", type: "P" },
    ]
  },
  {
    id: 18, dimension: "JP",
    question: '手头同时压了 5 个任务，你的处理方式是：',
    questionEn: "Five tasks land on your plate at once. How you handle it:",
    options: [
      { text: '立刻整理优先级和 deadline，制定时间分配表，按计划逐一击破，一丝不苟。', textEn: "Rank by priority and deadline immediately. Build a time-allocation table. Execute one by one. No mercy.", type: "J" },
      { text: '把所有任务写到便利贴上贴满显示器，每完成一个撕一个，非常解压。', textEn: "Write all tasks on sticky notes and plaster them on your monitor. Tear one off each time you finish. Deeply satisfying.", type: "J" },
      { text: '被最紧急的任务先逼着跑起来，其他的先不管，反正最后都能完成。', textEn: "The most urgent task sprints you into action. The rest wait. They'll all get done. Somehow.", type: "P" },
      { text: '在五个任务之间横跳，每个都做了一点，全都在进行中，无一完成，感觉很忙。', textEn: "Bounce between all five. A little progress on each. Everything is 'in progress.' Nothing is done. You feel very busy.", type: "P" },
    ]
  },
  {
    id: 19, dimension: "JP",
    question: '重要项目 deadline 还有三天，你现在的状态是：',
    questionEn: "Important project deadline in 3 days. Current status:",
    options: [
      { text: '已经完成了 80%，正在按计划收尾，留了 buffer 应对突发情况。', textEn: "80% done. Executing the final sprint. Buffer built in for anything unexpected.", type: "J" },
      { text: '提前完成交给领导 review 了，现在在帮同事推进其他任务。', textEn: "Already handed to your manager for review. Now helping a teammate with their work.", type: "J" },
      { text: '刚开始正式动工，但进入了高强度 deadline 模式，效率奇高，局面完全可控。', textEn: "Just started, but peak deadline mode has kicked in — efficiency off the charts. Totally under control.", type: "P" },
      { text: '完全不慌，deadline 前最后一天永远是我最高效的时候，这是科学规律。', textEn: "Completely calm. The last day before a deadline is always your most productive. This is a documented personal fact.", type: "P" },
    ]
  },
  {
    id: 20, dimension: "JP",
    question: '周五下午 5 点，周报时间到了，你：',
    questionEn: "Friday 5pm. Weekly report time. You:",
    options: [
      { text: '周四就写好了，今天直接复制粘贴，顺便优化了一下措辞，完美。', textEn: "Wrote a draft Thursday. Today is copy-paste with light polish. Flawless.", type: "J" },
      { text: '每天记了工作日志，周报就是 CV 一下再润色，两分钟搞定，游刃有余。', textEn: "Kept a daily log all week. Weekly report takes two minutes. Nothing to stress about.", type: "J" },
      { text: '翻这周的聊天记录和提交记录，即兴发挥凑出一篇，数据是真的，逻辑么……差不多。', textEn: "Scroll through the week's chats and commits, improvise a report, send without proofreading. Numbers are real. Narrative is… roughly accurate.", type: "P" },
      { text: '发现这周周报和上周重了 70%，想了想，改了个日期就发出去了。', textEn: "Notice 70% of this week's report matches last week's. Think about it for a moment. Change the date. Send.", type: "P" },
    ]
  },
];

// ─── MBTI Type Descriptions ──────────────────────────────────────────────────
export interface TypeInfo {
  name: string;
  title: string;       titleEn: string;
  tagline: string;     taglineEn: string;
  emoji: string;
  desc: string;        descEn: string;
  strengths: string[]; strengthsEn: string[];
  weaknesses: string[]; weaknessesEn: string[];
  famous: string[];
  officeTitle: string; officeTitleEn: string;
  officeDesc: string;  officeDescEn: string;
}

export const mbtiTypes: Record<string, TypeInfo> = {
  INTJ: {
    name: "INTJ", title: "战略家", titleEn: "Architect",
    tagline: "独立思考，战略布局，只对卓越负责", taglineEn: "Independent thinker, master strategist — accountable only to excellence",
    emoji: "🧠",
    desc: "独立、理性、有远见。你的思维超前于时代，做事有条不紊，目标明确。对无能和低效率深恶痛绝，不喜欢废话，更喜欢用实际成果说话。你的内心有一套精密而完整的世界观，外界很少有人能真正理解你，但这并不影响你按自己的方式改变世界。",
    descEn: "Independent, rational, and visionary. Your thinking is ahead of its time, methodical in execution, unwavering in goals. You despise incompetence and inefficiency, hate small talk, and prefer to let results speak. Inside you lives a precise worldview that few truly understand — but that never stops you from reshaping the world your way.",
    strengths: ["战略思维", "意志坚定", "高度自律"],
    strengthsEn: ["Strategic thinking", "Iron willpower", "Extreme self-discipline"],
    weaknesses: ["可能过于固执己见", "情感表达不够主动"],
    weaknessesEn: ["Can be overly inflexible", "Slow to express emotions"],
    famous: ["伊隆·马斯克", "斯坦利·库布里克", "尼采"],
    officeTitle: "孤胆战略家", officeTitleEn: "The Solo Strategist",
    officeDesc: "在开放办公室的格子间里独自运筹帷幄，活儿干得飞起，会议发言只有三句，但句句戳中要害。最烦没有自知之明的甲方和废话连篇的会议，最怕被拉进无意义的讨论群。",
    officeDescEn: "Running mental war-games from a cubicle. Output: exceptional. Meeting contributions: exactly three sentences, each a direct hit. Allergic to clients with no self-awareness and meetings with no agenda. Most feared: being added to a pointless discussion group.",
  },
  INTP: {
    name: "INTP", title: "逻辑学家", titleEn: "Logician",
    tagline: "用逻辑解构一切，用好奇拥抱宇宙", taglineEn: "Deconstructs the world with logic, embraces the universe with curiosity",
    emoji: "🔬",
    desc: "思维缜密，对一切事物充满无限好奇，总是在寻找万物背后的原理和规律。话不多，但每句话都经过深思熟虑。对不一致性和逻辑漏洞有天生的敏感，能发现大多数人看不到的问题所在。你的大脑永远在运转，即使在休息时也不例外。",
    descEn: "Precise thinker with infinite curiosity, always hunting for the principles behind everything. Words are rare but carefully chosen. Naturally allergic to inconsistencies and logical gaps, catching what most miss. Your brain never truly powers off — not even on vacation.",
    strengths: ["逻辑分析", "创新思维", "客观公正"],
    strengthsEn: ["Logical analysis", "Innovative thinking", "Objective fairness"],
    weaknesses: ["过于沉浸理论不善落地", "可能忽视情感因素"],
    weaknessesEn: ["Lost in theory, weak on delivery", "Can overlook emotional factors"],
    famous: ["爱因斯坦", "达尔文", "比尔·盖茨"],
    officeTitle: "问题终结者", officeTitleEn: "The Problem Terminator",
    officeDesc: '能把一个问题研究到忘记吃饭。开会发言总是以"其实这里有个逻辑问题"开头。写的方案自己三个月后也要重新看，但执行效果极好。分析报告写了 30 页没人看完，但那 30 页全是对的。',
    officeDescEn: 'Can research a single problem straight through lunch. Every meeting comment starts with "actually, there\'s a logical issue here." Plans unreadable three months later but work flawlessly. Analysis report: 30 pages, read by nobody. All 30 pages are correct.',
  },
  ENTJ: {
    name: "ENTJ", title: "指挥官", titleEn: "Commander",
    tagline: "生来就是为了统领全局、推动改变", taglineEn: "Born to lead, born to drive change",
    emoji: "⚡",
    desc: "天生领袖，执行力极强。你目标明确，行事果断，不喜欢拖泥带水。擅长整合资源、调配人才、推动事情落地。遇到挑战不退缩，在压力下反而更能发挥出色。有时候显得过于强势，但结果通常证明你是对的。",
    descEn: "Natural-born leader with relentless execution. Clear goals, decisive action, zero tolerance for wasted motion. Expert at integrating resources, mobilizing people, and making things happen. Thrives under pressure. Sometimes reads as overbearing — but the results usually prove you right.",
    strengths: ["领导力", "决断力", "战略执行"],
    strengthsEn: ["Leadership", "Decisiveness", "Strategic execution"],
    weaknesses: ["可能过于强势", "对他人要求过高"],
    weaknessesEn: ["Can come on too strong", "Sets very high standards for others"],
    famous: ["史蒂夫·乔布斯", "拿破仑·波拿巴", "杰克·韦尔奇"],
    officeTitle: "天生卷王", officeTitleEn: "The Overachiever",
    officeDesc: '六点半发邮件，七点要看到回复。OKR 写了整整五页，其中四页半都是别人的任务。开会时的口头禅是"这个我来推动"，然后真的推动了，还推动得别人有点累。',
    officeDescEn: "Emails at 6:30am, expects replies by 7. OKR: five pages, four and a half belonging to other people's tasks. Catchphrase: 'I'll drive this one' — and then actually does, to the point where everyone else is slightly tired.",
  },
  ENTP: {
    name: "ENTP", title: "辩论家", titleEn: "Debater",
    tagline: "打破规则，挑战边界，点燃思想的火花", taglineEn: "Break the rules, challenge the limits, ignite the spark of ideas",
    emoji: "💡",
    desc: "思维敏捷，创意无限，喜欢挑战一切既有观念和规则。总能从别人没想到的角度看待问题，擅长辩论，有时候更享受辩论本身而不是找到答案。对重复性工作极不感兴趣，但对新想法和新领域永远着迷。你的大脑是一台永动的创意机器。",
    descEn: "Quick-minded, overflowing with creativity, always challenging established norms. Sees angles nobody else considers, loves debate — sometimes more than finding the answer. Bored by routine, endlessly fascinated by new ideas. Your brain is a perpetual-motion creativity engine.",
    strengths: ["创意思维", "快速学习", "口才出众"],
    strengthsEn: ["Creative thinking", "Fast learning", "Exceptional verbal skills"],
    weaknesses: ["难以长期坚持", "执行力不够稳定"],
    weaknessesEn: ["Struggles with long-term follow-through", "Inconsistent execution"],
    famous: ["托马斯·爱迪生", "马克·吐温", "理查德·费曼"],
    officeTitle: "会议搅局王", officeTitleEn: "The Meeting Derailment Machine",
    officeDesc: '每次头脑风暴都能提出十个想法，但执行的是零。最喜欢在方案定了之后说"但是你们有没有想过……"。提问永远比解决方案多，已被直属领导列为"需要重点引导"的对象。',
    officeDescEn: 'Generates ten ideas every brainstorm, executes zero. Loves to say "but have you considered…" right after a decision is finalized. Questions always outnumber solutions. Officially flagged as "needs guidance" by at least one manager.',
  },
  INFJ: {
    name: "INFJ", title: "提倡者", titleEn: "Advocate",
    tagline: "16型中最稀有，洞见深邃，使命感极强", taglineEn: "Rarest of 16 types — deep insight, powerful sense of mission",
    emoji: "🌟",
    desc: "洞察力极强，有着改变世界的强烈使命感。你不仅能感受到他人深层的情绪，还能看穿表象背后的本质。理想主义者，但也知道如何脚踏实地推动真正的变化。内心世界极为丰富，外表却往往平静如水，是一个神秘而深刻的存在。",
    descEn: "Extraordinary intuition paired with a burning desire to change the world. Feels others' emotions at a deep level and sees through appearances to core truth. An idealist who also knows how to create real change. Richly complex inside, serene on the outside — mysterious and profound.",
    strengths: ["深度洞察", "强烈同理心", "使命感驱动"],
    strengthsEn: ["Deep insight", "Strong empathy", "Mission-driven"],
    weaknesses: ["完美主义易导致精力耗尽", "难以向外界倾诉内心"],
    weaknessesEn: ["Perfectionism leads to burnout", "Rarely shows their inner world to others"],
    famous: ["甘地", "马丁·路德·金", "尼古拉·特斯拉"],
    officeTitle: "公司良心", officeTitleEn: "The Company Conscience",
    officeDesc: "默默记录着每一次不公正，内心 OS 已经能写一本书。说话极少，但当 TA 开口，整个会议室都会安静下来。离职时让 HR 陷入了深深的自我反思。",
    officeDescEn: "Silently cataloguing every injustice — internal commentary enough for a memoir. Speaks rarely, but when they do, the whole room goes quiet. Their resignation letter gave HR an existential crisis.",
  },
  INFP: {
    name: "INFP", title: "调停者", titleEn: "Mediator",
    tagline: "永远的理想主义者，世界需要你的温柔", taglineEn: "The eternal idealist — the world needs your gentle touch",
    emoji: "🌸",
    desc: "富有同情心，深度重视内在价值观，渴望让世界变得更美好。感情细腻，对不公正有强烈的情感反应。有时候活在自己的世界里，但那个世界美得惊人，充满了创意和意义。你用心感受生活中每一个微小的美好，这是很多人一生都无法习得的能力。",
    descEn: "Compassionate, deeply value-driven, yearning to make the world better. Emotionally sensitive with a fierce reaction to injustice. Sometimes inhabits an inner world of breathtaking creativity and beauty. You feel every small wonder life offers — a gift many people never develop.",
    strengths: ["创造力", "深度同理心", "真诚纯粹"],
    strengthsEn: ["Creativity", "Deep empathy", "Sincerity and authenticity"],
    weaknesses: ["容易过度理想化", "难以应对严厉批评"],
    weaknessesEn: ["Prone to over-idealization", "Struggles with harsh criticism"],
    famous: ["J.R.R.托尔金", "约翰·列侬", "梵高"],
    officeTitle: "格子间诗人", officeTitleEn: "The Cubicle Poet",
    officeDesc: '在流水线工作中保持着对世界的好奇。写周报时会不自觉地变成散文诗。想法很多，但大部分停留在便利贴阶段。最不喜欢被催，最讨厌"快速拉齐一下"这种话。',
    officeDescEn: 'Maintaining wonder about the world from inside an assembly-line job. Weekly reports drift toward prose poetry without warning. Many ideas, most living on sticky notes. Hates being rushed. Hates "let\'s do a quick sync" with a burning passion.',
  },
  ENFJ: {
    name: "ENFJ", title: "主角", titleEn: "Protagonist",
    tagline: "感化人心，激发潜能，你是天生的精神领袖", taglineEn: "Inspire hearts, unlock potential — you're a natural spiritual leader",
    emoji: "🎭",
    desc: "充满感染力，天生的激励者和引导者。你关心他人，善于发现别人身上尚未被发掘的潜能，并帮助他们成长。在人群中能量充沛，擅长调动情绪、协调各方关系。有时候过于在意别人的看法，以至于忘了照顾自己的需求。",
    descEn: "Contagiously inspiring, a natural motivator and guide. You care deeply, spot untapped potential in others, and help people grow. Energized in groups, skilled at rallying emotions and harmonizing people. Sometimes too focused on others' needs to attend to your own.",
    strengths: ["领导魅力", "同理心", "激励他人"],
    strengthsEn: ["Charismatic leadership", "Empathy", "Inspiring others"],
    weaknesses: ["过度牺牲自我", "过于在意他人评价"],
    weaknessesEn: ["Sacrifices self too readily", "Over-concerned with others' opinions"],
    famous: ["奥巴马", "奥普拉·温弗瑞", "넬슨·曼德拉"],
    officeTitle: "团队精神领袖", officeTitleEn: "The Team Spirit Leader",
    officeDesc: '一个人的能量可以撑起整个部门士气。记得所有人的生日，自费买蛋糕。开会总结永远是"大家加油！"但偶尔会因为过度在乎他人感受而忘了为自己要求加薪。',
    officeDescEn: "One person's energy holds up an entire department's morale. Remembers every birthday, buys cake out of pocket. Meeting summaries always end with 'let's go team!' Occasionally forgets to negotiate their own raise.",
  },
  ENFP: {
    name: "ENFP", title: "竞选者", titleEn: "Campaigner",
    tagline: "热情无限，可能性无限，人生永远有惊喜", taglineEn: "Boundless passion, boundless possibilities — life is always surprising",
    emoji: "🚀",
    desc: "热情洋溢，充满创意，总能在每一件事中找到令人振奋的角度。你有强大而真诚的社交能量，对身边的人充满好奇。创意如泉涌，有时执行跟不上想法，但你的热情往往能感染他人一起投入。你相信世界充满无限可能，这种信念本身就是一种力量。",
    descEn: "Bursting with enthusiasm and creativity, always finding something exciting in everything. Genuinely curious about the people around you. Ideas flow like a fountain — execution sometimes lags, but your energy pulls others in. You believe the world holds infinite possibility, and that belief itself is a force.",
    strengths: ["创造力", "社交能量", "鼓舞他人"],
    strengthsEn: ["Creativity", "Social energy", "Inspiring others"],
    weaknesses: ["注意力容易分散", "执行力时有不稳"],
    weaknessesEn: ["Easily distracted", "Execution can be inconsistent"],
    famous: ["罗宾·威廉姆斯", "威尔·史密斯", "安妮·弗兰克"],
    officeTitle: "想法爆炸机", officeTitleEn: "The Idea Explosion",
    officeDesc: '每周都有一个改变世界的想法，上周的还没落地。开会迟到但进来之后立刻成为焦点。最害怕的四个字是"就按流程来"，最爱的四个字是"你们看这样行不行"。',
    officeDescEn: 'New world-changing idea every week, last week\'s still not shipped. Late to meetings but instantly becomes the center of attention. Most feared phrase: "just follow the process." Most loved: "what if we tried this instead?"',
  },
  ISTJ: {
    name: "ISTJ", title: "物流师", titleEn: "Logistician",
    tagline: "社会的基石，言出必行，绝不食言", taglineEn: "The foundation of society — says what they'll do, does what they say",
    emoji: "📋",
    desc: "务实可靠，是整个团队中最值得信赖的那个人，说到做到，从不食言。你重视传统、规则和流程，用严谨的方式维持团队和社会的稳定运转。不喜欢不确定性，偏好稳定和可预期的环境。你的可靠性是周围所有人的安全感来源。",
    descEn: "Dependable and practical, the most reliable person on any team. Says what they'll do and does it without exception. Values tradition, rules, and process, maintaining stability through rigor. Dislikes uncertainty, prefers predictable environments. Your reliability is everyone else's safety net.",
    strengths: ["可靠自律", "执行力强", "责任感极高"],
    strengthsEn: ["Reliability and discipline", "Strong execution", "Extreme sense of responsibility"],
    weaknesses: ["难以接受突发变化", "有时过于守旧保守"],
    weaknessesEn: ["Difficulty with sudden changes", "Can be overly conservative"],
    famous: ["沃伦·巴菲特", "乔治·华盛顿", "安吉拉·默克尔"],
    officeTitle: "人形打卡机", officeTitleEn: "The Human Timeclock",
    officeDesc: "九点整到，六点整走，中间不差一分钟。做事有 checklist，checklist 有备份，备份也有备份。从不拖延，也从不理解为什么别人会拖延。五年全勤奖拿了五次。",
    officeDescEn: "Arrives at 9 sharp. Leaves at 6 sharp. Not one minute off. Has a checklist for everything. Checklist has a backup. Backup has a backup. Has never procrastinated. Cannot comprehend why other people do. 5-year perfect attendance award: five times.",
  },
  ISFJ: {
    name: "ISFJ", title: "守护者", titleEn: "Defender",
    tagline: "默默照料每一个人，你是最温暖的守护天使", taglineEn: "Quietly caring for everyone — the warmest guardian angel",
    emoji: "🛡️",
    desc: "温和、细心、默默付出。你总是关注他人的需求，记得每个人的喜好和细节，在背后做了大量别人看不到的工作。不求表扬，但当付出被忽视时会默默难过。具有高度的责任感和忠诚心，是让任何集体都能运转下去的真正基石。",
    descEn: "Gentle, attentive, and quietly giving. Always aware of others' needs, remembering preferences and details, doing vast invisible work in the background. Doesn't need praise but quietly hurts when overlooked. Deeply responsible and loyal — the true backbone keeping any group running.",
    strengths: ["细心体贴", "忠诚可靠", "责任心强"],
    strengthsEn: ["Attentiveness and care", "Loyalty and reliability", "Strong sense of duty"],
    weaknesses: ["不善拒绝他人", "常常忽视自身需求"],
    weaknessesEn: ["Difficulty saying no", "Often neglects own needs"],
    famous: ["特蕾莎修女", "碧昂斯", "凯特·米德尔顿"],
    officeTitle: "默默奉献型", officeTitleEn: "The Silent Backbone",
    officeDesc: "做了三倍的工作，但功劳全在年终述职里变成了领导的成果。帮所有人订过外卖，记得所有人的忌口。离职那天，整个部门才意识到少了根顶梁柱。",
    officeDescEn: "Does three times the work but the credit ends up in the manager's year-end review. Has ordered lunch for the whole team. Remembers everyone's dietary restrictions. The day they leave, the department realizes they were holding everything together.",
  },
  ESTJ: {
    name: "ESTJ", title: "总裁", titleEn: "Executive",
    tagline: "把混乱变成秩序，把计划变成现实", taglineEn: "Turns chaos into order, turns plans into reality",
    emoji: "💼",
    desc: "务实、果断、注重效率，是天生的组织者和执行者。你相信秩序和规则的力量，善于将混乱局面整理为井然有序的系统。对混乱和拖延深恶痛绝，确保每件事都按时完成、按标准执行。你不仅对自己要求高，对周围人的标准也同样严格。",
    descEn: "Practical, decisive, efficiency-obsessed — a natural organizer and executor. Believes in the power of order and rules, turning messy situations into clean, running systems. Hates chaos and delays. Ensures everything is delivered on time and to standard. Holds others to the same high bar.",
    strengths: ["组织能力", "决断力", "高效执行"],
    strengthsEn: ["Organization", "Decisiveness", "High-efficiency execution"],
    weaknesses: ["有时过于刻板", "不易接受非常规方案"],
    weaknessesEn: ["Can be inflexible", "Resistant to unconventional approaches"],
    famous: ["亨利·福特", "约翰·D·洛克菲勒", "德怀特·艾森豪威尔"],
    officeTitle: "背锅侠鉴定师", officeTitleEn: "The Receipt Keeper",
    officeDesc: '所有邮件都有抄送，所有决定都有文件留存。开会最爱说"这个我们之前讨论过，结论是"，然后翻出三个月前的会议纪要。邮件归档严谨，可随时调取任何历史记录。',
    officeDescEn: 'Every email has a CC. Every decision has a paper trail. Loves to open meetings with "as we discussed, the conclusion was—" and pull out notes from three months ago. Email archive: impeccable. Any record: retrievable on demand.',
  },
  ESFJ: {
    name: "ESFJ", title: "执政官", titleEn: "Consul",
    tagline: "温暖每一个人，让集体充满凝聚力", taglineEn: "Warms every heart, holds the team together",
    emoji: "🤝",
    desc: "热情、善良，从服务和关心他人中获得能量。你天生关注每个人的感受和需求，善于营造温暖和谐的氛围，是任何团队和家庭中的粘合力量。记得每个人的细节，让身边的人都感到被看见、被照顾。非常在意他人的评价，渴望被认可和接受。",
    descEn: "Warm, kind, energized by caring for others. Naturally attuned to everyone's feelings, gifted at creating harmony. Remembers the details that make people feel seen. Deeply invested in others' approval, yearning to be valued and accepted.",
    strengths: ["人际能力", "热情忠诚", "协调组织"],
    strengthsEn: ["People skills", "Warm loyalty", "Coordination and organization"],
    weaknesses: ["过度在乎他人评价", "难以接受人际冲突"],
    weaknessesEn: ["Over-reliant on others' validation", "Struggles with interpersonal conflict"],
    famous: ["泰勒·斯威夫特", "比尔·克林顿", "詹妮弗·加纳"],
    officeTitle: "办公室开心果", officeTitleEn: "The Office Social Director",
    officeDesc: "知道每个人的老家、对象、父母身体情况。能把部门聚餐变成家庭聚会。领导最爱让 TA 组织活动，因为百分之百不会冷场。公司任何不开心的时刻，TA 一出现就散了。",
    officeDescEn: "Knows everyone's hometown, relationship status, and how their parents are doing. Can turn a team lunch into a family reunion. Always chosen to organize events — guaranteed not to flop. Whatever bad mood hit the office, one appearance from them fixes it.",
  },
  ISTP: {
    name: "ISTP", title: "鉴赏家", titleEn: "Virtuoso",
    tagline: "危机中最冷静的那个人，问题的终结者", taglineEn: "The calmest person in a crisis — the one who ends the problem",
    emoji: "🔧",
    desc: "冷静、实际，擅长用最直接高效的方式解决实际问题。你喜欢动手操作，能在危机和压力中保持异常冷静的头脑。不喜欢理论，偏向直接下手解决问题。独立性极强，不喜欢被过多约束，话少但关键时刻能量惊人。",
    descEn: "Cool-headed and practical, resolves real problems with maximum efficiency. Loves hands-on work and stays eerily calm under pressure. Prefers action over theory. Fiercely independent. Quiet, but with staggering impact when the moment calls for it.",
    strengths: ["动手能力", "危机处理", "逻辑清晰"],
    strengthsEn: ["Hands-on ability", "Crisis management", "Clear logical thinking"],
    weaknesses: ["情感表达比较困难", "对长期承诺较谨慎"],
    weaknessesEn: ["Emotionally guarded", "Cautious about long-term commitments"],
    famous: ["布鲁斯·李", "迈克尔·乔丹", "克林特·伊斯特伍德"],
    officeTitle: "沉默实干家", officeTitleEn: "The Silent Fixer",
    officeDesc: '三点能搞定的事，今天不一定动，但一动就解决了。从不写说明文档，因为"做出来就是最好的解释"。被人催急了会在消息里发一个"好"，然后真的就好了。',
    officeDescEn: 'A 30-minute task that takes 3 days to start, but once started — done in minutes. Never writes documentation: "the work speaks for itself." When pushed, sends one word: "done." And then it actually is.',
  },
  ISFP: {
    name: "ISFP", title: "探险家", titleEn: "Adventurer",
    tagline: "活在当下，感受美好，用行动诠释真实", taglineEn: "Live in the moment, feel the beauty, express your truth through action",
    emoji: "🎨",
    desc: "敏感、温和，有艺术家的灵魂。你对美有独特而细腻的感知力，喜欢用行动而不是语言表达自己。不喜欢冲突，总是选择温和的方式处理问题。喜欢以自己的节奏生活，充分享受当下的每一刻，不愿被过多的计划和规则约束。",
    descEn: "Sensitive, gentle, with an artist's soul. A unique and delicate perception of beauty, expressing through action rather than words. Avoids conflict, always choosing the soft path. Prefers life at their own pace, savoring each moment, unwilling to be boxed in by too many rules.",
    strengths: ["艺术感知", "适应能力", "感同身受"],
    strengthsEn: ["Artistic sensibility", "Adaptability", "Deep empathy"],
    weaknesses: ["难以规划长远未来", "倾向于回避正面冲突"],
    weaknessesEn: ["Difficulty with long-term planning", "Tends to avoid direct conflict"],
    famous: ["迈克尔·杰克逊", "鲍勃·迪伦", "奥黛丽·赫本"],
    officeTitle: "低调实力派", officeTitleEn: "The Quiet Powerhouse",
    officeDesc: "不爱说话，但做出来的东西让人惊艳。悄悄把遗留了三年的问题解决了，也不告诉任何人。需要被发现，而不是被安排。离职时，同事们才意识到TA一直在默默扛着多少事。",
    officeDescEn: "Doesn't talk much, but the work is stunning. Quietly resolved a 3-year-old problem and told nobody. Needs to be discovered, not assigned. On the day they leave, teammates realize how much they'd been carrying all along.",
  },
  ESTP: {
    name: "ESTP", title: "企业家", titleEn: "Entrepreneur",
    tagline: "行动派先锋，机会来了就抓，没机会就创造", taglineEn: "Action-first pioneer — seize opportunities, or create them",
    emoji: "🔥",
    desc: "精力充沛，善于把握一切机会，活在当下。你擅长处理突发情况，在真实的行动中思考和成长。社交能力极强，能快速读懂任何房间里的气氛。有强烈的冒险精神，喜欢刺激，不喜欢墨守成规。你相信机会是留给敢于行动的人的。",
    descEn: "High-energy, always ready to jump on every opportunity, fully present in the moment. Thrives in unexpected situations, thinking and growing through real-world action. Socially sharp, reads a room instantly. Strong appetite for adventure and risk. Opportunities belong to those bold enough to move.",
    strengths: ["行动力", "社交能力", "危机应对"],
    strengthsEn: ["Action drive", "Social intelligence", "Crisis response"],
    weaknesses: ["容易冲动决策", "不善长期系统规划"],
    weaknessesEn: ["Prone to impulsive decisions", "Weak on long-term systematic planning"],
    famous: ["唐纳德·特朗普", "麦当娜", "杰克·尼科尔森"],
    officeTitle: "销售之魂", officeTitleEn: "The Sales Soul",
    officeDesc: '能把面包卖给减肥的人，能把加班说成"成长机会"。永远在跑动，永远在社交，永远在成交。最怕一件事：坐下来写文档。PPT 一般做得很好，内容有时候有点虚。',
    officeDescEn: 'Can sell bread to someone on a diet. Can pitch overtime as a "growth opportunity." Always moving, always networking, always closing. One weakness: sitting down to write documentation. Slide decks: excellent. Content: occasionally aspirational.',
  },
  ESFP: {
    name: "ESFP", title: "表演者", titleEn: "Entertainer",
    tagline: "让每个瞬间都充满光彩，生活就是舞台", taglineEn: "Every moment shines — life is your stage",
    emoji: "🎉",
    desc: "活泼开朗，感染力极强，是人群中天然的开心果。你能让身边所有人都感到振奋和快乐，享受每一个当下的瞬间。不喜欢计划，相信事情会自然而然地安排好。你的存在本身就是一种礼物，让生活变得更加有趣和有色彩。",
    descEn: "Lively, magnetic, the natural life-of-the-party. Can lift everyone around them and make ordinary moments feel special. Lives in the now, trusts that things will work out. Your very presence is a gift — you make life more colorful and fun for everyone.",
    strengths: ["感染力", "适应能力", "人际亲和力"],
    strengthsEn: ["Infectious energy", "Adaptability", "Natural warmth"],
    weaknesses: ["有时过于冲动", "难以处理长期复杂问题"],
    weaknessesEn: ["Can be impulsive", "Struggles with long, complex challenges"],
    famous: ["玛丽莲·梦露", "埃尔顿·约翰", "史蒂维·旺德"],
    officeTitle: "社交媒体部长", officeTitleEn: "The Social Director",
    officeDesc: "公司任何活动都有 TA 的份，且一定出现在最显眼的位置。开心的时候会在公司群发有趣的内容。工作做得还行，让大家开心这件事做得特别好。是办公室不可或缺的氛围担当。",
    officeDescEn: "Present at every company event, always in the most visible spot. Posts fun things in the group chat when they're feeling good. Work quality: solid. Making everyone's day: exceptional. The irreplaceable vibe officer of the office.",
  },
};
