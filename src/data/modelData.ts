export interface Data {
  name: string;
  model: string;
  org: string;
  correct: string;
  date: string;
  frameworkOpen: boolean;
  modelOpen: boolean;
  trajUrl?: string;
}

export interface DataOpenRCA2 {
  name: string;
  model: string;
  org: string;
  accuracy: string;
  nodeF1: string;
  edgeF1: string;
  date: string;
  frameworkOpen: boolean;
  modelOpen: boolean;
  trajUrl?: string;
}

const prefix = import.meta.env.BASE_URL.replace(/\/$/, '')

// 模型颜色映射
export const modelColorMap: { [key: string]: { color: string, backgroundColor: string } } = {
  'Claude 4.6 Opus': { color: '#0d1b4d', backgroundColor: '#9fa8da' },
  'Claude 4.5 Opus': { color: '#283593', backgroundColor: '#c5cae9' },
  'Claude 3.5 Sonnet': { color: '#1a237e', backgroundColor: '#e8eaf6' },
  'GPT-4o': { color: '#004d40', backgroundColor: '#e0f2f1' },
  'GPT-5.2': { color: '#00695c', backgroundColor: '#b2dfdb' },
  'Gemini 1.5 Pro': { color: '#b71c1c', backgroundColor: '#ffebee' },
  'Gemini 3 Pro': { color: '#c62828', backgroundColor: '#ffcdd2' },
  'Mistral Large 2': { color: '#0d47a1', backgroundColor: '#bbdefb' },
  'Command R+': { color: '#4a148c', backgroundColor: '#e1bee7' },
  'Llama 3.1 Instruct': { color: '#e65100', backgroundColor: '#ffe0b2' }
};

// 组织图标映射
export const orgLogoMap: { [key: string]: string } = {
  'Microsoft': `${prefix}/ms_logo.svg`,
  'Google': `${prefix}/gemini_logo.png`,
  'OpenAI': `${prefix}/openai_logo.svg`,
  'Anthropic': `${prefix}/anthropic-1.svg`,
  'Meta': `${prefix}/meta_logo.svg`,
  'OpenRCA': `${prefix}/openrca_logo_white.png`,
  'None': '-'
};

// 新闻数据
export const news = [
  {
    date: '2026/1/17',
    content: "🎉🎉🎉 Anthropic's Claude 4.5 Opus + Claude Agent SDK & SRE Tool MCP achieves SOTA"
  },
  { date: '2025/12/22', content: 'Our AIOps dataset study paper has been accepted by FSE 2026.' },
  { date: '2025/1/23', content: 'Our OpenRCA benchmark paper has been accepted by ICLR 2025.' }
];

// 模型数据
export const modelDataOpenRCA: Data[] = [
  { name: 'Claude Agent SDK & SRE Tool MCP', model: 'Claude 4.6 Opus', org: 'Anthropic', correct: '87.46%', date: '2026/2/10', frameworkOpen: false, modelOpen: false, trajUrl: 'https://example.com/traj/claude-agent-sdk' },
  { name: 'Claude Agent SDK & SRE Tool MCP', model: 'Claude 4.5 Opus', org: 'Anthropic', correct: '86.57%', date: '2026/1/17', frameworkOpen: false, modelOpen: false, trajUrl: 'https://example.com/traj/claude-agent-sdk' },
  
  // New baselines - RCA-Agent
  { name: 'RCA-Agent', model: 'Claude 4.6 Opus', org: 'OpenRCA', correct: '36.42%', date: '2026/2/10', frameworkOpen: true, modelOpen: false, trajUrl: 'https://example.com/traj/rca-agent-claude' },
  { name: 'RCA-Agent', model: 'Claude 4.5 Opus', org: 'OpenRCA', correct: '28.36%', date: '2026/2/10', frameworkOpen: true, modelOpen: false, trajUrl: 'https://example.com/traj/rca-agent-claude' },
  { name: 'RCA-Agent', model: 'GPT-5.2', org: 'OpenRCA', correct: '19.40%', date: '2026/2/10', frameworkOpen: true, modelOpen: false, trajUrl: 'https://example.com/traj/rca-agent-gpt4o' },
  { name: 'RCA-Agent', model: 'Gemini 3 Pro', org: 'OpenRCA', correct: '12.54%', date: '2026/2/10', frameworkOpen: true, modelOpen: false, trajUrl: 'https://example.com/traj/rca-agent-gemini' },
  
  // Closed Models - RCA-Agent
  { name: 'RCA-Agent', model: 'Claude 3.5 Sonnet', org: 'OpenRCA', correct: '11.34%', date: '2025/1/23', frameworkOpen: true, modelOpen: false, trajUrl: 'https://example.com/traj/rca-agent-claude' },
  { name: 'RCA-Agent', model: 'GPT-4o', org: 'OpenRCA', correct: '8.96%', date: '2025/1/23', frameworkOpen: true, modelOpen: false, trajUrl: 'https://example.com/traj/rca-agent-gpt4o' },
  { name: 'RCA-Agent', model: 'Gemini 1.5 Pro', org: 'OpenRCA', correct: '2.69%', date: '2025/1/23', frameworkOpen: true, modelOpen: false, trajUrl: 'https://example.com/traj/rca-agent-gemini' },
  
  // Closed Models - Balanced
  { name: 'Prompting (Balanced)', model: 'Claude 3.5 Sonnet', org: 'None', correct: '3.88%', date: '2025/1/23', frameworkOpen: true, modelOpen: false },
  { name: 'Prompting (Balanced)', model: 'GPT-4o', org: 'None', correct: '3.28%', date: '2025/1/23', frameworkOpen: true, modelOpen: false },
  { name: 'Prompting (Balanced)', model: 'Gemini 1.5 Pro', org: 'None', correct: '6.27%', date: '2025/1/23', frameworkOpen: true, modelOpen: false },
  
  // Closed Models - Oracle
  { name: 'Prompting (Oracle)', model: 'Claude 3.5 Sonnet', org: 'None', correct: '5.37%', date: '2025/1/23', frameworkOpen: true, modelOpen: false },
  { name: 'Prompting (Oracle)', model: 'GPT-4o', org: 'None', correct: '6.27%', date: '2025/1/23', frameworkOpen: true, modelOpen: false },
  { name: 'Prompting (Oracle)', model: 'Gemini 1.5 Pro', org: 'None', correct: '7.16%', date: '2025/1/23', frameworkOpen: true, modelOpen: false },
  
  // Open Source Models - Balanced
  { name: 'Prompting (Balanced)', model: 'Mistral Large 2', org: 'None', correct: '3.58%', date: '2025/1/23', frameworkOpen: true, modelOpen: true, trajUrl: '' },
  { name: 'Prompting (Balanced)', model: 'Command R+', org: 'None', correct: '4.18%', date: '2025/1/23', frameworkOpen: true, modelOpen: true },
  { name: 'Prompting (Balanced)', model: 'Llama 3.1 Instruct', org: 'None', correct: '2.99%', date: '2025/1/23', frameworkOpen: true, modelOpen: true },
  
  // Open Source Models - Oracle
  { name: 'Prompting (Oracle)', model: 'Mistral Large 2', org: 'None', correct: '4.48%', date: '2025/1/23', frameworkOpen: true, modelOpen: true },
  { name: 'Prompting (Oracle)', model: 'Command R+', org: 'None', correct: '4.78%', date: '2025/1/23', frameworkOpen: true, modelOpen: true },
  { name: 'Prompting (Oracle)', model: 'Llama 3.1 Instruct', org: 'None', correct: '3.88%', date: '2025/1/23', frameworkOpen: true, modelOpen: true },
  
  // Open Source Models - RCA-Agent
  { name: 'RCA-Agent', model: 'Llama 3.1 Instruct', org: 'None', correct: '3.28%', date: '2025/1/23', frameworkOpen: true, modelOpen: true }
];

// Mock data for OpenRCA 2.0 (placeholder)
export const modelDataOpenRCA2: DataOpenRCA2[] = [
  // {
  //   name: 'Claude Agent SDK & SRE Tool MCP',
  //   model: 'Claude 4.5 Opus',
  //   org: 'Anthropic',
  //   accuracy: '84.2%',
  //   nodeF1: '84.7/87.4/82.1',
  //   edgeF1: '77.1/79.0/75.3',
  //   date: '2026/1/17',
  //   frameworkOpen: false,
  //   modelOpen: false,
  //   reproduced: false,
  //   trajUrl: 'https://example.com/traj/openrca2-claude-agent'
  // },
  // {
  //   name: 'RCA-Agent',
  //   model: 'GPT-4o',
  //   org: 'None',
  //   accuracy: '71.6%',
  //   nodeF1: '72.3/74.9/69.8',
  //   edgeF1: '63.8/66.3/61.5',
  //   date: '2026/1/20',
  //   frameworkOpen: true,
  //   modelOpen: false,
  //   reproduced: true,
  //   trajUrl: 'https://example.com/traj/openrca2-gpt4o'
  // },
  // {
  //   name: 'RCA-Agent',
  //   model: 'Gemini 1.5 Pro',
  //   org: 'Google',
  //   accuracy: '67.8%',
  //   nodeF1: '68.8/71.0/66.7',
  //   edgeF1: '60.2/62.4/58.1',
  //   date: '2026/1/20',
  //   frameworkOpen: true,
  //   modelOpen: false,
  //   reproduced: true
  // },
  // {
  //   name: 'Prompting (Oracle)',
  //   model: 'Claude 3.5 Sonnet',
  //   org: 'None',
  //   accuracy: '63.5%',
  //   nodeF1: '66.4/68.8/64.1',
  //   edgeF1: '57.3/59.6/55.2',
  //   date: '2026/1/18',
  //   frameworkOpen: true,
  //   modelOpen: false,
  //   reproduced: true
  // },
  // {
  //   name: 'Prompting (Balanced)',
  //   model: 'Mistral Large 2',
  //   org: 'None',
  //   accuracy: '55.9%',
  //   nodeF1: '58.1/60.4/56.0',
  //   edgeF1: '49.8/52.1/47.6',
  //   date: '2026/1/18',
  //   frameworkOpen: true,
  //   modelOpen: true,
  //   reproduced: true
  // },
  // {
  //   name: 'Prompting (Balanced)',
  //   model: 'Llama 3.1 Instruct',
  //   org: 'Meta',
  //   accuracy: '52.7%',
  //   nodeF1: '55.6/57.8/53.5',
  //   edgeF1: '47.6/49.7/45.8',
  //   date: '2026/1/19',
  //   frameworkOpen: true,
  //   modelOpen: true,
  //   reproduced: true
  // }
];
