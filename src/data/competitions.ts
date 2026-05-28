export const competitionTabs = ['新生刚需', '学校官网', '考试考证', 'A类赛事', 'B类赛事', 'C类赛事']

export interface NavEntry {
  name: string
  url: string
  note?: string
  emoji?: string
}

export const navData: Record<string, NavEntry[]> = {
  '新生刚需': [
    { name: '学习通网页版', url: 'https://v8.chaoxing.com/', emoji: '📚' },
    { name: '河南师范大学教务管理系统', url: 'https://jwc.htu.edu.cn/', emoji: '📋' },
    { name: '什么是学分、学时、绩点、综测', url: 'https://mp.weixin.qq.com/s?__biz=MzA3NDAzMTg3NA==&mid=2656994351&idx=1&sn=14da46d814ab90da219ef81c79dd0bd0&chksm=84afd242b3d85b54f928de5b3b584bf819e35a611fee60912aaf8646adf6eda6dbab195fc95b&scene=27', note: '微信推文', emoji: '📖' },
    { name: '河南师范大学第二课堂', url: 'http://dekt.htu.edu.cn/syslogin', emoji: '🎯' },
  ],
  '学校官网': [
    { name: '河南师范大学官网', url: 'https://www.htu.edu.cn/', emoji: '🏛️' },
    { name: '河南师范大学团委', url: 'https://www.htu.edu.cn/xtw/', emoji: '👥' },
    { name: '河南师范大学缴费平台', url: 'http://wsjf.htu.edu.cn/payment/', emoji: '💰' },
    { name: '河南师范大学教务处', url: 'https://www.htu.edu.cn/teaching/', emoji: '📖' },
  ],
  '考试考证': [
    { name: '全国大学生英语考试', url: 'http://cet-bm.neea.edu.cn/', emoji: '🇬🇧' },
    { name: '普通话水平测试', url: 'https://jwc.htu.edu.cn/', note: '跳转教务系统', emoji: '🗣️' },
    { name: '全国计算机等级考试', url: 'http://ncre-bm.neea.cn/', emoji: '💻' },
    { name: '教师资格证考试', url: 'http://ntce.neea.edu.cn/', emoji: '📝' },
    { name: '计算机软考', url: 'https://www.ruankao.org.cn/', emoji: '🖥️' },
  ],
}

export interface CompEntry {
  id: string
  name: string
  url: string
  class: 'A' | 'B' | 'C'
  stars: number
  description: string
  emoji: string
  note?: string
  hasDetail?: boolean
}

export const aClassCompetitions: CompEntry[] = [
  { id: 'a1', name: '中国国际大学生创新大赛(互联网+)', url: 'https://cy.ncss.cn/', class: 'A', stars: 5, description: '教育部主办的全国性创新创业大赛，覆盖全国高校，是目前国内影响力最大的大学生创新创业赛事。', emoji: '💡', hasDetail: true },
  { id: 'a2', name: '全国大学生节能减排社会实践与科技竞赛', url: 'http://www.jienengjianpai.org/', class: 'A', stars: 4, description: '教育部高等教育司主办的全国性大学生竞赛，以"节能减排、绿色能源"为主题。', emoji: '🌱' },
  { id: 'a3', name: '中国大学生工程实践与创新能力大赛', url: 'http://www.gcxl.edu.cn/new/index.html', class: 'A', stars: 4, description: '教育部高等教育司主办，培养大学生工程实践和创新能力的全国性赛事。', emoji: '⚙️' },
  { id: 'a4', name: '全国大学生创新创业训练计划年会展示', url: 'https://www.gjcxcy.cn/', class: 'A', stars: 4, description: '国家级大学生创新创业训练计划项目的年度成果展示与交流平台。', emoji: '🎪' },
  { id: 'a5', name: '中国大学生服务外包创新创业大赛', url: 'http://www.fwwb.org.cn/', class: 'A', stars: 4, description: '面向全国高校的服务外包领域创新创业竞赛，推动服务外包产业发展。', emoji: '📊' },
  { id: 'a6', name: '中美青年创客大赛', url: 'https://chinaus-maker.cscse.edu.cn/', class: 'A', stars: 4, description: '中美两国青年创客的科技交流赛事，促进中美人文交流。', emoji: '🤝' },
  { id: 'a7', name: '全国大学生电子设计竞赛', url: 'https://nuedc.xjtu.edu.cn/', class: 'A', stars: 4, description: '教育部高等教育司主办的电子信息类学科竞赛，是全国规模最大的电子设计赛事。', emoji: '🔌' },
  { id: 'a8', name: '全国大学生地质技能竞赛', url: 'https://yuanxi.cugb.edu.cn/competition/', class: 'A', stars: 3, description: '面向地学类大学生的专业技能竞赛，由中国地质大学主办。', emoji: '⛰️' },
  { id: 'a9', name: '"中国软件杯"大学生软件设计大赛', url: 'https://www.cnsoftbei.com/', class: 'A', stars: 4, description: '工业和信息化部主办的软件设计竞赛，以企业真实需求为赛题。', emoji: '🖥️' },
  { id: 'a10', name: '"挑战杯"全国大学生课外学术科技作品竞赛', url: 'https://www.tiaozhanbei.net/', class: 'A', stars: 5, description: '被誉为中国大学生学术科技的"奥林匹克"，是最具影响力的全国性大学生课外学术科技竞赛。', emoji: '🏆', hasDetail: true },
]

export const bClassCompetitions: CompEntry[] = [
  { id: 'b1', name: '"挑战杯"中国大学生创业计划大赛', url: 'https://www.tiaozhanbei.net/', class: 'B', stars: 5, description: '全国性的大学生创业计划竞赛，激励大学生的创业热情。', emoji: '🚀' },
  { id: 'b2', name: '全国大学生机器人大赛CURC(RoboMaster/RoboCon)', url: 'https://www.robotac.cn/', class: 'B', stars: 4, description: '全国最具影响力的机器人竞赛之一，包含RoboMaster和RoboCon两个赛项。', emoji: '🤖' },
  { id: 'b3', name: 'ACM-ICPC国际大学生程序设计竞赛', url: 'https://icpc.pku.edu.cn/jj/index.htm', class: 'B', stars: 5, description: '全球最具影响力的大学生程序设计竞赛，考验算法与编程能力。', emoji: '⌨️' },
  { id: 'b4', name: '中国高校智能机器人创意大赛', url: 'https://www.robotcontest.cn/home/homepage', class: 'B', stars: 4, description: '面向全国高校的智能机器人创意设计与竞赛平台。', emoji: '🧠' },
  { id: 'b5', name: '全国大学生嵌入式芯片与系统设计大赛', url: 'http://devise.socchina.net/home', class: 'B', stars: 4, description: '面向嵌入式系统设计领域的全国性大学生竞赛。', emoji: '🔧' },
  { id: 'b6', name: '中国机器人大赛暨RoboCup世界杯中国赛', url: 'https://rcccaa.drct-caa.org.cn/', class: 'B', stars: 4, description: 'RoboCup中国赛区选拔赛，优胜队伍将代表中国参加RoboCup世界杯。', emoji: '⚽' },
  { id: 'b7', name: '全国大学生光电设计竞赛', url: 'https://gd.moocollege.com/home', class: 'B', stars: 4, description: '面向光电信息科学与工程领域的全国性大学生竞赛。', emoji: '💡' },
  { id: 'b8', name: '中国机器人及人工智能大赛', url: 'https://www.caairobot.com/', class: 'B', stars: 4, description: '中国人工智能学会主办的机器人及人工智能领域竞赛。', emoji: '🤖' },
  { id: 'b9', name: '全国大学生数学建模竞赛', url: 'https://www.mcm.edu.cn/', class: 'B', stars: 5, description: '全国规模最大的数学建模竞赛，要求72小时内解决实际问题并撰写论文。', emoji: '📐' },
  { id: 'b10', name: '全国大学生机械创新设计大赛', url: 'https://umic2024.moocollege.com/', class: 'B', stars: 4, description: '面向机械工程领域的全国性大学生创新设计竞赛。', emoji: '🔩' },
  { id: 'b11', name: '全国大学生结构设计大赛', url: 'http://www.structurecontest.com/', class: 'B', stars: 4, description: '土木工程领域最具影响力的大学生学科竞赛。', emoji: '🏗️' },
  { id: 'b12', name: '全国大学生广告艺术大赛', url: 'https://www.sun-ada.net/', class: 'B', stars: 4, description: '全国最大的高校广告艺术设计竞赛平台。', emoji: '🎨' },
  { id: 'b13', name: '全国大学生智能汽车竞赛', url: 'https://www.smartcar.zone/index.html', class: 'B', stars: 4, description: '面向全国大学生的智能汽车设计与竞赛。', emoji: '🚗' },
  { id: 'b14', name: '全国大学生交通科技大赛', url: 'http://www.nactrans.com.cn/', class: 'B', stars: 4, description: '交通运输工程领域的全国性大学生科技竞赛。', emoji: '🚄' },
  { id: 'b15', name: '全国大学生电子商务三创赛', url: 'http://new.3chuang.net/', class: 'B', stars: 4, description: '电子商务领域的全国性创新、创意及创业竞赛。', emoji: '🛒' },
  { id: 'b16', name: '全国大学生物流设计大赛', url: 'https://wlsjds.clpp.org.cn/login', class: 'B', stars: 4, description: '物流管理领域的全国性大学生设计竞赛。', emoji: '📦' },
  { id: 'b17', name: '全国大学生化工设计竞赛', url: 'http://iche.zju.edu.cn/', class: 'B', stars: 4, description: '化工领域的全国性大学生设计竞赛。', emoji: '🧪' },
  { id: 'b18', name: '中国大学生计算机设计大赛', url: 'https://jsjds.blcu.edu.cn/', class: 'B', stars: 4, description: '计算机设计领域的全国性大学生竞赛。', emoji: '💻' },
  { id: 'b19', name: '全国大学生市场调查与分析大赛', url: 'http://www.china-cssc.org/', class: 'B', stars: 4, description: '市场调研与数据分析领域的全国性竞赛。', emoji: '📊' },
  { id: 'b20', name: '全国大学生生命科学竞赛', url: 'https://www.educulsc.com/', class: 'B', stars: 4, description: '生命科学领域的全国性大学生研究竞赛。', emoji: '🧬' },
  { id: 'b21', name: '全国大学生信息安全竞赛', url: 'http://www.ciscn.cn/', class: 'B', stars: 4, description: '网络安全领域的全国性大学生竞赛。', emoji: '🔐' },
]

export const cClassCompetitions: CompEntry[] = [
  { id: 'c1', name: '中国高校计算机大赛', url: 'https://www.c4best.cn/', class: 'C', stars: 3, description: '教育部高等学校计算机类专业教学指导委员会主办的全国性计算机竞赛。', emoji: '💻' },
  { id: 'c2', name: '全国大学生先进成图技术与产品信息建模创新大赛', url: 'https://www.chengtusai.com/', class: 'C', stars: 3, description: '图学领域的全国性大学生竞赛。', emoji: '📐' },
  { id: 'c3', name: '全国大学生物理实验竞赛', url: 'https://www.njuphy.com/', class: 'C', stars: 3, description: '物理实验领域的全国性大学生竞赛。', emoji: '🔬' },
  { id: 'c4', name: '周培源大学生力学竞赛', url: 'https://zpy.cstam.org.cn/', class: 'C', stars: 3, description: '以著名力学家周培源命名的全国性力学竞赛。', emoji: '📏' },
  { id: 'c5', name: '全国大学生金相技能大赛', url: 'http://www.mse-cn.com/', class: 'C', stars: 3, description: '材料科学领域的金相制备与观察技能竞赛。', emoji: '🔍' },
  { id: 'c6', name: '中国大学生机械工程创新创意大赛', url: 'https://cmeic.moocollege.com/', class: 'C', stars: 3, description: '机械工程领域的创新创意竞赛。', emoji: '⚙️' },
  { id: 'c7', name: 'iCAN创新创业大赛', url: 'http://www.ican-contest.org/', class: 'C', stars: 3, description: '面向全球大学生的创新创业竞赛，以微纳器件和物联网为核心。', emoji: '💡' },
  { id: 'c8', name: '"西门子杯"中国智能制造挑战赛', url: 'http://www.siemenscup-cimc.org.cn/', class: 'C', stars: 3, description: '西门子公司主办的智能制造领域大学生竞赛。', emoji: '🏭' },
  { id: 'c9', name: '"蓝桥杯"全国软件和信息技术专业人才大赛', url: 'https://dasai.lanqiao.cn/', class: 'C', stars: 4, description: '全国规模最大的IT类学科竞赛之一，覆盖软件和电子两大领域。', emoji: '🖥️' },
  { id: 'c10', name: '未来设计师·全国高校数字艺术设计大赛(NCDA)', url: 'https://www.ncda.org.cn/', class: 'C', stars: 3, description: '面向全国高校的数字艺术设计竞赛。', emoji: '🎨' },
  { id: 'c11', name: '全国大学生集成电路创新创业大赛', url: 'http://www.nuicdc.org/', class: 'C', stars: 3, description: '集成电路设计领域的全国性大学生竞赛。', emoji: '🔌' },
  { id: 'c12', name: '"大唐杯"全国大学生新一代信息通信技术大赛', url: 'https://www.dtangbei.com/', class: 'C', stars: 3, description: '信息通信技术领域的全国性大学生竞赛。', emoji: '📡' },
  { id: 'c13', name: '睿抗机器人开发者大赛(RAICOM)', url: 'https://www.raicom.com.cn/', class: 'C', stars: 3, description: '面向机器人开发者的大赛，涵盖编程、设计等多方面。', emoji: '🤖' },
  { id: 'c14', name: '米兰设计周-中国高校设计学科师生优秀作品展', url: 'https://www.milan-aap.org.cn/', class: 'C', stars: 3, description: '米兰设计周框架下的中国高校设计作品展示与竞赛。', emoji: '🏛️' },
  { id: 'c15', name: '外研社·国才杯全国大学生外语能力大赛', url: 'https://uchallenge.unipus.cn/', class: 'C', stars: 4, description: '全国规模最大的外语类竞赛，涵盖演讲、写作、阅读、翻译等赛项。', emoji: '🌍' },
  { id: 'c16', name: '华灿奖', url: 'https://www.huacanjiang.com/', class: 'C', stars: 3, description: '面向两岸高校的文化创意设计竞赛。', emoji: '🌟' },
  { id: 'c17', name: '全国高校商业精英挑战赛', url: 'http://www.cubec.org.cn/', class: 'C', stars: 3, description: '商业领域的全国性高校竞赛。', emoji: '💼' },
  { id: 'c18', name: '中国好创意暨全国数字艺术设计大赛', url: 'http://www.chinacy8.com/', class: 'C', stars: 3, description: '数字艺术设计领域的全国性创意竞赛。', emoji: '✨' },
  { id: 'c19', name: '全国大学生化学实验邀请赛', url: 'http://chemec.bnu.edu.cn/', class: 'C', stars: 3, description: '化学实验领域的全国性邀请赛。', emoji: '🧪' },
  { id: 'c20', name: '全国3D数字化创新设计大赛', url: 'https://3dds.3ddl.net/', class: 'C', stars: 3, description: '3D数字化设计与创新领域的全国性竞赛。', emoji: '🎲' },
  { id: 'c21', name: '"学创杯"全国大学生创业综合模拟大赛', url: 'http://www.xcb-biz.com/', class: 'C', stars: 3, description: '创业综合模拟领域的全国性竞赛。', emoji: '📈' },
  { id: 'c22', name: '全国高校BIM毕业设计创新大赛', url: 'https://gxbsxs.glodonedu.com/', class: 'C', stars: 3, description: 'BIM技术在毕业设计中的应用创新大赛。', emoji: '🏗️' },
  { id: 'c23', name: '华为ICT大赛', url: 'https://e.huawei.com/cn/talent/ict-academy/competition', class: 'C', stars: 3, description: '华为公司主办的信息通信技术竞赛。', emoji: '📶' },
  { id: 'c24', name: '"先导杯"并行计算应用大奖赛', url: 'https://www.xdxcl.com/', class: 'C', stars: 3, description: '并行计算应用领域的全国性竞赛。', emoji: '⚡' },
  { id: 'c25', name: '"21世纪杯"全国英语演讲比赛', url: 'https://contest.21stcentury.com.cn/', class: 'C', stars: 3, description: '全国性英语演讲比赛，由中国日报社主办。', emoji: '🎤' },
  { id: 'c26', name: '"工行杯"全国大学生金融科技创新大赛', url: 'https://icbc.sc.zhichizhijia.com/', class: 'C', stars: 3, description: '金融科技领域的全国性大学生创新竞赛。', emoji: '🏦' },
  { id: 'c27', name: '中华经典诵写讲大赛', url: 'https://www.jingdiansxj.cn/', class: 'C', stars: 3, description: '弘扬中华优秀传统文化的诵读、书写、讲解大赛。', emoji: '📜' },
  { id: 'c28', name: '"外教社杯"全国高校学生跨文化能力大赛', url: 'https://www.sflep.com/', class: 'C', stars: 3, description: '培养大学生跨文化交流能力的全国性竞赛。', emoji: '🌐' },
  { id: 'c29', name: '百度之星程序设计大赛', url: 'https://star.baidu.com/', class: 'C', stars: 3, description: '百度主办的全国性算法编程竞赛。', emoji: '⭐' },
  { id: 'c30', name: '全国大学生工业设计大赛', url: 'http://www.cuid.org.cn/', class: 'C', stars: 3, description: '工业设计领域的全国性大学生竞赛。', emoji: '🎯' },
  { id: 'c31', name: '全国大学生水利创新设计大赛', url: 'http://www.slxscx.com/', class: 'C', stars: 3, description: '水利工程领域的创新设计竞赛。', emoji: '🌊' },
  { id: 'c32', name: '全国大学生化工实验大赛', url: 'http://www.ctect.net/', class: 'C', stars: 3, description: '化工实验技能竞赛，提高化工专业学生的实践能力。', emoji: '🧪' },
  { id: 'c33', name: '全国大学生化学实验创新设计大赛', url: 'http://www.chemdiy.com/', class: 'C', stars: 3, description: '化学实验创新设计领域的全国性竞赛。', emoji: '🔬' },
  { id: 'c34', name: '全国大学生计算机系统能力大赛', url: 'https://compiler.educg.net/', class: 'C', stars: 3, description: '计算机系统能力培养为导向的全国性竞赛。', emoji: '🖥️' },
  { id: 'c35', name: '全国大学生物联网设计竞赛', url: 'https://iot.sjtu.edu.cn/', class: 'C', stars: 3, description: '物联网技术应用与创新设计的全国性竞赛。', emoji: '🌐' },
  { id: 'c36', name: '全国大学生信息安全与对抗技术竞赛', url: 'https://www.isclab.org.cn/', class: 'C', stars: 3, description: '信息安全技术与对抗领域的竞赛。', emoji: '🛡️' },
  { id: 'c37', name: '全国大学生测绘学科创新创业智能大赛', url: 'http://www.cehuijingsai.com/', class: 'C', stars: 3, description: '测绘领域的创新创业与智能技术竞赛。', emoji: '🗺️' },
  { id: 'c38', name: '全国大学生统计建模大赛', url: 'http://www.tjjmds.cn/', class: 'C', stars: 3, description: '统计建模领域的全国性大学生竞赛。', emoji: '📊' },
  { id: 'c39', name: '全国大学生能源经济学术创意大赛', url: 'http://energy.ctbu.edu.cn/', class: 'C', stars: 3, description: '能源经济领域的学术创意竞赛。', emoji: '⚡' },
  { id: 'c40', name: '全国大学生基础医学创新研究论坛', url: 'http://www.jcyxds.com/', class: 'C', stars: 3, description: '基础医学领域的创新研究交流论坛。', emoji: '🏥' },
  { id: 'c41', name: '全国大学生数字媒体科技作品及创意竞赛', url: 'http://www.digitalmediacontest.cn/', class: 'C', stars: 3, description: '数字媒体科技领域的作品与创意竞赛。', emoji: '🎮' },
  { id: 'c42', name: '全国本科院校税收风险管控案例大赛', url: 'http://www.ssrcc.net/', class: 'C', stars: 3, description: '税收风险管控领域的案例分析竞赛。', emoji: '📋' },
  { id: 'c43', name: '全国企业竞争模拟大赛', url: 'http://www.ibizsim.cn/', class: 'C', stars: 3, description: '企业经营管理模拟的全国性竞赛。', emoji: '🏢' },
  { id: 'c44', name: '全国大学生数智化企业经营沙盘大赛', url: 'http://www.erp-edu.cn/', class: 'C', stars: 3, description: '企业经营沙盘模拟竞赛，培养管理决策能力。', emoji: '🏖️' },
  { id: 'c45', name: '全国大学生数字建筑创新应用大赛', url: 'https://www.ccsw.org.cn/', class: 'C', stars: 3, description: '数字建筑技术应用创新大赛。', emoji: '🏗️' },
  { id: 'c46', name: '全球校园人工智能算法精英大赛', url: 'https://ai.caai.cn/', class: 'C', stars: 3, description: '人工智能算法领域的全球校园竞赛。', emoji: '🧠' },
  { id: 'c47', name: '国际智能农业装备创新大赛', url: 'http://www.agri-intelligence.com/', class: 'C', stars: 3, description: '智能农业装备领域的创新竞赛。', emoji: '🌾' },
  { id: 'c48', name: '"科云杯"全国大学生财会职业能力大赛', url: 'https://www.kyc.com.cn/', class: 'C', stars: 3, description: '财会职业能力培养的全国性竞赛。', emoji: '💰' },
]

export const allCompetitions = [...aClassCompetitions, ...bClassCompetitions, ...cClassCompetitions]
