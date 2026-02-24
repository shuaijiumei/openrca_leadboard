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
  rcF1: string;
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
  'Llama 3.1 Instruct': { color: '#e65100', backgroundColor: '#ffe0b2' },
  'GLM-4.7': { color: '#1565c0', backgroundColor: '#bbdefb' },
  'Claude 4.5 Sonnet': { color: '#1a237e', backgroundColor: '#e8eaf6' },
  'GPT-5.1': { color: '#004d40', backgroundColor: '#e0f2f1' },
  'Kimi K2': { color: '#4e342e', backgroundColor: '#d7ccc8' },
  'Qwen3-32B': { color: '#6a1b9a', backgroundColor: '#e1bee7' },
  'Qwen3-Next-80B': { color: '#7b1fa2', backgroundColor: '#f3e5f5' },
  'Seed 1.6': { color: '#33691e', backgroundColor: '#dcedc8' }
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
  {date: '2026/2/23', content: "OpenRCA 2.0 preview evaluation results are released."},
  {date: '2026/2/10', content: "New model baselines with RCA-Agent scaffolds are released."},
  // {date: '2026/1/17', content: "Anthropic's Claude 4.5 Opus + Claude Agent SDK & SRE Tool MCP achieves SOTA"},
  { date: '2025/12/22', content: 'Our AIOps dataset study paper has been accepted by FSE 2026.' },
  { date: '2025/1/23', content: 'Our OpenRCA benchmark paper has been accepted by ICLR 2025.' }
];

// 模型数据
export const modelDataOpenRCA: Data[] = [
  // { name: 'Claude Agent SDK & SRE Tool MCP', model: 'Claude 4.6 Opus', org: 'Anthropic', correct: '87.46%', date: '2026/2/10', frameworkOpen: false, modelOpen: false, trajUrl: 'https://example.com/traj/claude-agent-sdk' },
  // { name: 'Claude Agent SDK & SRE Tool MCP', model: 'Claude 4.5 Opus', org: 'Anthropic', correct: '86.57%', date: '2026/1/17', frameworkOpen: false, modelOpen: false, trajUrl: 'https://example.com/traj/claude-agent-sdk' },
  
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
  { name: 'DeepResearch', model: 'GLM-4.7', org: 'OpenRCA', accuracy: '60.3%', rcF1: "46.6/60/40", nodeF1: "64.6/75/61", edgeF1:"28.7/40/26", date: '2026/2/23', frameworkOpen: true, modelOpen: true},
  { name: 'DeepResearch', model: 'Claude 4.5 Sonnet', org: 'OpenRCA', accuracy: '76.6%', rcF1: "60.3/75/53", nodeF1: "69.0/83/63", edgeF1:"53.0/75/46", date: '2026/2/23', frameworkOpen: true, modelOpen: false },
  { name: 'DeepResearch', model: 'GPT-5.1', org: 'OpenRCA', accuracy: '62.8%', rcF1: "47.3/61/41", nodeF1: "70.4/72/78", edgeF1:"46.2/54/49", date: '2026/2/23', frameworkOpen: true, modelOpen: false },
  { name: 'DeepResearch', model: 'Kimi K2', org: 'OpenRCA', accuracy: '58.4%', rcF1: "44.6/57/39", nodeF1: "65.6/78/61", edgeF1:"45.0/65/39", date: '2026/2/23', frameworkOpen: true, modelOpen: false },
  { name: 'DeepResearch', model: 'Qwen3-32B', org: 'OpenRCA', accuracy: '31.4%', rcF1: "23.0/31/19", nodeF1: "50.2/77/40", edgeF1:"17.7/32/13", date: '2026/2/23', frameworkOpen: true, modelOpen: true },
  { name: 'DeepResearch', model: 'Qwen3-Next-80B', org: 'OpenRCA', accuracy: '39.2%', rcF1: "29.6/39/25", nodeF1: "57.8/76/50", edgeF1:"28.3/48/23", date: '2026/2/23', frameworkOpen: true, modelOpen: true },
  { name: 'DeepResearch', model: 'Seed 1.6', org: 'OpenRCA', accuracy: '42.2%', rcF1: "31.7/41/28", nodeF1: "60.4/76/55", edgeF1:"40.4/62/34", date: '2026/2/23', frameworkOpen: true, modelOpen: false },
];
