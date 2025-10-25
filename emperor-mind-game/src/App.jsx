\
import React, { useMemo, useState } from "react"

const STORY = {
  start: "s1",
  vars: { observe: 10, control: 10, stance: 10, flags: {} },
  nodes: {
    // 第一章
    s1: {
      npc: "旁白",
      text: "【第一章】你刚入职一家新公司，一位热情的同事主动请你喝咖啡。你微笑回应。接下来你——",
      choices: [
        { label: "热情回应，夸对方为人实在", go: "s2", delta: { observe: -1, control: -1, stance: -1 } },
        { label: "微笑接受，但少说话观察", go: "s3", delta: { observe: 2, control: 1, stance: 1 } },
        { label: "委婉拒绝，推托时间紧", go: "s4", delta: { observe: 1, control: 1, stance: 2 } },
      ],
    },
    s2: {
      npc: "旁白",
      text: "你热情回应，对方更主动地与你分享内部信息，还顺势打探你过往经历。",
      choices: [
        { label: "继续寒暄，表现友好", go: "end_affable", delta: { control: -1 } },
        { label: "找借口结束对话", go: "s5", delta: { control: 1, stance: 1 } },
      ],
    },
    s3: {
      npc: "旁白",
      text: "你保持礼貌微笑，让对方先说。对方开始聊八卦与派系，言辞中隐含‘拉你入局’的信号。",
      choices: [
        { label: "点到为止，换话题到工作", go: "end_observer", delta: { observe: 2, control: 1 } },
        { label: "追问细节，想了解更多", go: "s5", delta: { observe: 1, control: -1 } },
      ],
    },
    s4: {
      npc: "旁白",
      text: "你婉拒邀约，对方愣了一下，但对你形成初步判断：不好拿捏。",
      choices: [
        { label: "转身离开，不多言", go: "end_refuse_clear", delta: { stance: 1 } },
        { label: "补一句‘下次吧’，维持面子", go: "s5", delta: { control: -1, observe: 1 } },
      ],
    },
    s5: {
      npc: "旁白",
      text: "下班后，你隐约听到有人在讨论你：‘新同事性格如何？能不能拉进来？’这是一场典型的试探。",
      choices: [
        { label: "直接表态立场，划清边界", go: "end_cut", delta: { stance: 2, control: 1 } },
        { label: "先顺势周旋，保留后手", go: "end_probe", delta: { control: 2, observe: 1 } },
      ],
    },

    // 第一章结局（均可进入第二章）
    end_affable: {
      npc: "复盘·识人术",
      text: "你的选择偏向‘讨好型亲近’，容易被快速纳入别人的叙事框架。短期获好感，长期易失控局。",
      analysis: "维度画像：察言↓ 控局↓↓ 立势↓。风险点：过早表露立场与信息，给了对方定义你的机会。",
      tips: [
        "延迟赞美：先问后评，不先下结论。",
        "反向设问：‘你怎么看这个项目的风险？’把话题从八卦拉回任务。",
        "轻边界句式：‘私事我们线下再聊，先把今日任务卡点对齐。’",
      ],
      choices: [{ label: "→ 进入第二章：从一次合作，看穿控制欲", go: "c2_s1", delta: {} }],
    },
    end_observer: {
      npc: "复盘·识人术",
      text: "你采取‘观察优先’策略，避免被对方叙事裹挟，保留了控局权。",
      analysis: "维度画像：察言↑↑ 控局↑ 立势↑。优势：信息先行、立场慢显。改进：适时抛出小任务测试对方。",
      tips: [
        "话术：‘这个点我们先按流程推进，我拉个清单，今晚同步下一步。’",
        "测试：‘你能帮我把X资料整理下吗？’观察执行度与反馈速度。",
        "关门句：‘暂不讨论人事评价，先聚焦交付。’",
      ],
      choices: [{ label: "→ 进入第二章：从一次合作，看穿控制欲", go: "c2_s1", delta: {} }],
    },
    end_refuse_clear: {
      npc: "复盘·识人术",
      text: "你用礼貌拒绝建立了初步边界，减少了被动卷入。",
      analysis: "维度画像：察言→ 控局→ 立势↑↑。优势：立场清晰。风险：可能被贴上‘难接近’标签。",
      tips: [
        "补偿性友好：‘这周忙，下周我请你喝杯咖啡，聊项目。’",
        "框定议题：‘我们聚焦项目本身，私事改天。’",
        "短闭环：‘今天先把A完成，明早我给你看版本。’",
      ],
      choices: [{ label: "→ 进入第二章：从一次合作，看穿控制欲", go: "c2_s1", delta: {} }],
    },
    end_cut: {
      npc: "复盘·识人术",
      text: "你选择直接表态，明确边界，短期止损，长期立势更稳。",
      analysis: "维度画像：察言→ 控局↑ 立势↑↑。建议：强势后需补一次‘人情修复’，防止被边缘化。",
      tips: [
        "强硬后柔化：‘刚才语气直了点，项目节点紧，感谢理解。’",
        "转移战场：‘把大家拉进共用文档，一起透明推进。’",
        "对事不对人：‘我反对的是做法，不是否定你。’",
      ],
      choices: [{ label: "→ 进入第二章：从一次合作，看穿控制欲", go: "c2_s1", delta: {} }],
    },
    end_probe: {
      npc: "复盘·识人术",
      text: "你选择顺势周旋，继续取数，保留后手，是典型的‘以退为进’。",
      analysis: "维度画像：察言↑ 控局↑↑ 立势→。优势：情报收集充分；风险：易被误判成同盟。",
      tips: [
        "模糊承诺：‘这个方向我先记下，等任务对齐再看是否配合。’",
        "双轨沟通：公开场合只谈任务，私下保留记录。",
        "退出预案：‘若与规范冲突，我会以流程为准。’",
      ],
      choices: [{ label: "→ 进入第二章：从一次合作，看穿控制欲", go: "c2_s1", delta: {} }],
    },

    // 第二章（微笑控制者）
    c2_s1: {
      npc: "旁白",
      text: "【第二章】项目启动会后，你与一位‘温和能干’的同事要合作推进。TA微笑建议：‘你先负责产出，我来整合资源。’",
      choices: [
        { label: "点头同意：我产出，你整合资源", go: "c2_s2a", delta: { control: -1 } },
        { label: "提出共用文档：所有资源透明共享", go: "c2_s2b", delta: { control: 2, observe: 1 } },
        { label: "先定里程碑和职责边界再分工", go: "c2_s2c", delta: { stance: 2, control: 1 } },
      ],
    },
    c2_s2a: {
      npc: "旁白",
      text: "对方开始‘帮你对接’资源，但文件与关键联系人都握在他手中。TA轻声说：‘你把原始文件先发我，我帮你润色。’",
      choices: [
        { label: "直接发源文件（以帮为控）", go: "end2_comply", delta: { control: -2, stance: -1 } },
        { label: "仅发导出稿，并列出修改点共同完善", go: "c2_s3b", delta: { control: 2, observe: 1 } },
      ],
    },
    c2_s2b: {
      npc: "旁白",
      text: "你提出共用文档，设置共同编辑权限与版本记录。对方微笑点头：‘可以啊，就按你说的来。’",
      choices: [
        { label: "在共用文档开‘变更说明’栏目", go: "c2_s3b", delta: { control: 1, observe: 1 } },
        { label: "把会议改成站会，限定每次5分钟任务对齐", go: "c2_s3a", delta: { stance: 1, control: 1 } },
      ],
    },
    c2_s2c: {
      npc: "旁白",
      text: "你先拉了里程碑：样稿→评审→定稿→上线。对方略一迟疑，但仍笑着同意。",
      choices: [
        { label: "明确审核口径：决策只在评审会上做出", go: "c2_s3a", delta: { stance: 1, control: 1 } },
        { label: "设定DOR/DOD（进入/完成定义）", go: "c2_s3b", delta: { observe: 1, stance: 1 } },
      ],
    },
    c2_s3a: {
      npc: "旁白",
      text: "例会中，对方‘总结’你的工作进展，但把关键思路归功于‘团队’——你察觉到温柔的抢功迹象。",
      choices: [
        { label: "现场补充你负责的要点与下一步计划", go: "end2_public_credit", delta: { stance: 1, control: 2 } },
        { label: "不在会上争，改为会后发纪要标注职责", go: "c2_s4b", delta: { observe: 1, control: 1 } },
      ],
    },
    c2_s3b: {
      npc: "旁白",
      text: "共用文档逐步完善，你设置了‘变更说明’与‘责任人’字段。对方每次修改都要填原因。",
      choices: [
        { label: "启用‘修改记录’+‘版本号’，周五统一评审", go: "c2_s4a", delta: { control: 2, stance: 1 } },
        { label: "在评论区只留‘疑问’，避免直接改动", go: "c2_s4a", delta: { observe: 1 } },
      ],
    },
    c2_s4a: {
      npc: "旁白",
      text: "评审前夜，对方提出‘为了效率我先改好了’，并把文档设置成‘仅可查看’。温柔，但实质剥夺你的决策权。",
      choices: [
        { label: "用版本记录对齐：仅以评审会决策为准", go: "end2_trace", delta: { control: 2, stance: 1 } },
        { label: "设置提交门槛与时间窗，超期不入评审", go: "end2_boundary", delta: { stance: 2, control: 1 } },
      ],
    },
    c2_s4b: {
      npc: "旁白",
      text: "你会后发出会议纪要，按里程碑标注‘责任人-产出物-时间’。对方回复‘没问题’，但保持资源在手。",
      choices: [
        { label: "同步到共用文档并@相关方确认", go: "end2_coedit", delta: { control: 2, observe: 1 } },
      ],
    },

    // 第二章结局
    end2_comply: {
      npc: "复盘·合作识局",
      text: "你把源文件交出后，决策权与节奏权被‘温柔’地集中到对方手里。",
      analysis: "识局画像：察言→ 控局↓↓ 立势↓。策略风险：以‘帮你润色’为名的‘以帮为控’。",
      tips: [
        "话术：‘我发导出稿+问题清单，我们在共用文档协同。’",
        "流程：设置版本号与修改记录，评审会决策。",
        "边界：源文件只在必要时共享，并保留备份与追踪。",
      ],
      choices: [{ label: "返回目录（重玩第二章）", go: "c2_s1", delta: {} }],
    },
    end2_coedit: {
      npc: "复盘·合作识局",
      text: "你用公开纪要+共用文档把权力从‘个人握有’转到‘流程承载’，温柔而有效的控局。",
      analysis: "识局画像：察言↑ 控局↑↑ 立势→。优势：公开透明让‘温柔控制’失效。",
      tips: [
        "话术：‘所有变更请在文档“变更说明”区填写原因。’",
        "节奏：每周固定评审，决策只在会上产生。",
        "护城河：在纪要中标注‘责任-产出-时间’，减少模糊空间。",
      ],
      choices: [{ label: "继续修炼（回到章节开头）", go: "c2_s1", delta: {} }],
    },
    end2_trace: {
      npc: "复盘·合作识局",
      text: "你以‘版本记录+评审会’的制度控局，温柔地把对方的‘先改后告知’化为‘先告后改’。",
      analysis: "识局画像：察言↑ 控局↑ 立势↑。要点：用制度代替情绪，用流程代替人情。",
      tips: [
        "话术：‘变更先走评审，避免多头版本。’",
        "工具：版本号、修改记录、评审议程。",
        "对齐：‘评审产出的决定即为唯一真相。’",
      ],
      choices: [{ label: "继续修炼（回到章节开头）", go: "c2_s1", delta: {} }],
    },
    end2_public_credit: {
      npc: "复盘·合作识局",
      text: "你选择在会上‘就事补充’自己的贡献与下一步，既不拆台也不被抢功。",
      analysis: "识局画像：察言→ 控局↑ 立势↑。提示：公开场合陈述事实+下一步，避免卷入人际拉扯。",
      tips: [
        "话术：‘这一块由我负责，当前完成到B，下一步我在DOD内补C。’",
        "结构：事实-贡献-下一步-协作需求。",
        "礼仪：不评价对方意图，只说客观节点。",
      ],
      choices: [{ label: "继续修炼（回到章节开头）", go: "c2_s1", delta: {} }],
    },
    end2_boundary: {
      npc: "复盘·合作识局",
      text: "你设置‘提交门槛与时间窗’，让流程成为门卫。对方若越界，自动被流程挡回。",
      analysis: "识局画像：察言→ 控局↑↑ 立势↑↑。优势：边界与节奏兼备，长期稳定控局。",
      tips: [
        "话术：‘超出时间窗的变更进入下轮评审。’",
        "制度：DOR/DOD、SLA时间窗、评审白名单。",
        "复盘：事后复盘仅对流程，不对人。",
      ],
      choices: [{ label: "继续修炼（回到章节开头）", go: "c2_s1", delta: {} }],
    },
  },
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  )
}

function SceneBox({ npc, text, analysis, tips }) {
  return (
    <div className="scene">
      <div className="npc">{npc ? `【${npc}】` : ""}</div>
      <div className="text">{text}</div>
      {analysis && (
        <div className="panel" style={{marginTop:12, background:"#fff7ed", borderColor:"#fde68a"}}>
          <div className="alert-title" style={{color:"#92400e"}}>结局复盘</div>
          <div style={{marginTop:6, whiteSpace:"pre-wrap"}}>{analysis}</div>
        </div>
      )}
      {Array.isArray(tips) && tips.length>0 && (
        <div className="panel" style={{marginTop:12}}>
          <div className="alert-title">优化话术（可直接复制）</div>
          <ul>
            {tips.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function App(){
  const [story] = useState(STORY)
  const [nodeKey, setNodeKey] = useState(story.start)
  const [vars, setVars] = useState(structuredClone(story.vars))
  const [history, setHistory] = useState([])

  const node = story.nodes[nodeKey]

  const startNew = () => {
    setNodeKey(story.start)
    setVars(structuredClone(story.vars))
    setHistory([])
  }

  const applyDelta = (delta) => {
    const next = { ...vars }
    for (const k in delta || {}) next[k] = (next[k] ?? 0) + delta[k]
    setVars(next)
  }

  const onChoose = (ch) => {
    applyDelta(ch.delta)
    setHistory(h => [...h, { node: nodeKey, choice: ch.label }])
    setNodeKey(ch.go)
  }

  const progress = useMemo(()=>{
    const visited = new Set(history.map(h=>h.node))
    visited.add(nodeKey)
    return Math.min(100, Math.round((visited.size / Object.keys(story.nodes).length) * 100))
  }, [history, nodeKey, story.nodes])

  const chapter = nodeKey.startsWith("c2_") ? "第二章 · 合作识局" : "第一章 · 寒暄识心"

  return (
    <div className="container">
      <header>
        <h1>👑 帝王识人术·互动修炼场 <span className="chip">无AI结局解析版</span></h1>
        <div className="row">
          <span className="chip">{chapter}</span>
          <button className="btn" onClick={startNew}>重开从第一章</button>
        </div>
      </header>

      <div className="alert" style={{marginBottom:12}}>
        <div className="alert-title">{chapter}</div>
        <div className="muted">所有分支都通往内置结局卡片：含识人复盘与“可直接复制”的优化话术。第一章结局可进入第二章，三维属性承接：察言｜控局｜立势。</div>
      </div>

      <div className="grid">
        <div className="card">
          <div className="card-body">
            <div className="row" style={{marginBottom:8}}>
              <div className="muted">场景：<b>{nodeKey}</b></div>
              <div className="progress"><div style={{width: `${progress}%`}}></div></div>
            </div>

            <div className="stats" style={{marginBottom:12}}>
              <Stat label="察言" value={vars.observe} />
              <Stat label="控局" value={vars.control} />
              <Stat label="立势" value={vars.stance} />
            </div>

            <SceneBox npc={node?.npc} text={node?.text} analysis={node?.analysis} tips={node?.tips} />

            <div className="choices" style={{marginTop:12}}>
              {node?.choices?.length ? node.choices.map((ch, i)=>(
                <button key={i} className="btn choice" onClick={()=>onChoose(ch)}>
                  <span>{ch.label}</span><span>→</span>
                </button>
              )) : <div className="muted" style={{textAlign:"center"}}>已达结局。可复制“优化话术”，或点上方按钮重新修炼。</div>}
            </div>

            <div className="muted" style={{marginTop:10}}>轨迹：{history.map((h,i)=>`${h.node}→${h.choice}`).join(" / ")}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="alert">
              <div className="alert-title">如何用于短视频/直播</div>
              <div className="muted">1）录屏游玩+结局话术即教学；2）评论区引导观众说出自己的情境；3）后续可无缝升级为AI实况分析版。</div>
            </div>
            <div className="panel" style={{marginTop:12}}>
              <div className="pill">（只读）剧情 JSON</div>
              <pre style={{whiteSpace:'pre-wrap', marginTop:8, fontSize:12}}>{JSON.stringify(story, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
