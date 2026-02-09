export interface Data {
  name: string;
  model: string;
  org: string;
  correct: string;
  date: string;
  frameworkOpen: boolean;
  modelOpen: boolean;
  reproduced: boolean;
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
  reproduced: boolean;
  trajUrl?: string;
}

const prefix = import.meta.env.BASE_URL.replace(/\/$/, '')

// 模型颜色映射
export const modelColorMap: { [key: string]: { color: string, backgroundColor: string } } = {
  'Claude 4.5 Opus': { color: '#283593', backgroundColor: '#c5cae9' },
  'Claude 3.5 Sonnet': { color: '#1a237e', backgroundColor: '#e8eaf6' },
  'GPT-4o': { color: '#004d40', backgroundColor: '#e0f2f1' },
  'Gemini 1.5 Pro': { color: '#b71c1c', backgroundColor: '#ffebee' },
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
  'OpenRCA': `${prefix}/openrca_logo_white.png`
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
  { name: 'Claude Agent SDK & SRE Tool MCP', model: 'Claude 4.5 Opus', org: 'Anthropic', correct: '91.5%', date: '2026/1/17', frameworkOpen: false, modelOpen: false, reproduced: false, trajUrl: 'https://example.com/traj/claude-agent-sdk' },
  // Closed Models - RCA-Agent
  { name: 'RCA-Agent', model: 'Claude 3.5 Sonnet', org: 'Microsoft', correct: '11.34%', date: '2025/1/23', frameworkOpen: true, modelOpen: false, reproduced: true, trajUrl: 'https://example.com/traj/rca-agent-claude' },
  { name: 'RCA-Agent', model: 'GPT-4o', org: 'OpenRCA', correct: '8.96%', date: '2025/1/23', frameworkOpen: true, modelOpen: false, reproduced: true, trajUrl: 'https://example.com/traj/rca-agent-gpt4o' },
  { name: 'RCA-Agent', model: 'Gemini 1.5 Pro', org: 'OpenRCA', correct: '2.69%', date: '2025/1/23', frameworkOpen: true, modelOpen: false, reproduced: true, trajUrl: 'https://example.com/traj/rca-agent-gemini' },
  
  // Closed Models - Balanced
  { name: 'Prompting (Balanced)', model: 'Claude 3.5 Sonnet', org: 'OpenRCA', correct: '3.88%', date: '2025/1/23', frameworkOpen: true, modelOpen: false, reproduced: true },
  { name: 'Prompting (Balanced)', model: 'GPT-4o', org: 'OpenRCA', correct: '3.28%', date: '2025/1/23', frameworkOpen: true, modelOpen: false, reproduced: true },
  { name: 'Prompting (Balanced)', model: 'Gemini 1.5 Pro', org: 'OpenRCA', correct: '6.27%', date: '2025/1/23', frameworkOpen: true, modelOpen: false, reproduced: true },
  
  // Closed Models - Oracle
  { name: 'Prompting (Oracle)', model: 'Claude 3.5 Sonnet', org: 'OpenRCA', correct: '5.37%', date: '2025/1/23', frameworkOpen: true, modelOpen: false, reproduced: true },
  { name: 'Prompting (Oracle)', model: 'GPT-4o', org: 'OpenRCA', correct: '6.27%', date: '2025/1/23', frameworkOpen: true, modelOpen: false, reproduced: true },
  { name: 'Prompting (Oracle)', model: 'Gemini 1.5 Pro', org: 'OpenRCA', correct: '7.16%', date: '2025/1/23', frameworkOpen: true, modelOpen: false, reproduced: true },
  
  // Open Source Models - Balanced
  { name: 'Prompting (Balanced)', model: 'Mistral Large 2', org: 'OpenRCA', correct: '3.58%', date: '2025/1/23', frameworkOpen: true, modelOpen: true, reproduced: true, trajUrl: 'https://example.com/traj/prompting-balanced-mistral' },
  { name: 'Prompting (Balanced)', model: 'Command R+', org: 'OpenRCA', correct: '4.18%', date: '2025/1/23', frameworkOpen: true, modelOpen: true, reproduced: true },
  { name: 'Prompting (Balanced)', model: 'Llama 3.1 Instruct', org: 'OpenRCA', correct: '2.99%', date: '2025/1/23', frameworkOpen: true, modelOpen: true, reproduced: true },
  
  // Open Source Models - Oracle
  { name: 'Prompting (Oracle)', model: 'Mistral Large 2', org: 'OpenRCA', correct: '4.48%', date: '2025/1/23', frameworkOpen: true, modelOpen: true, reproduced: true },
  { name: 'Prompting (Oracle)', model: 'Command R+', org: 'OpenRCA', correct: '4.78%', date: '2025/1/23', frameworkOpen: true, modelOpen: true, reproduced: true },
  { name: 'Prompting (Oracle)', model: 'Llama 3.1 Instruct', org: 'OpenRCA', correct: '3.88%', date: '2025/1/23', frameworkOpen: true, modelOpen: true, reproduced: true },
  
  // Open Source Models - RCA-Agent
  { name: 'RCA-Agent', model: 'Llama 3.1 Instruct', org: 'OpenRCA', correct: '3.28%', date: '2025/1/23', frameworkOpen: true, modelOpen: true, reproduced: true }
];

// Mock data for OpenRCA 2.0 (placeholder)
export const modelDataOpenRCA2: DataOpenRCA2[] = [
  { name: 'Claude Agent SDK & SRE Tool MCP', model: 'Claude 4.5 Opus', org: 'Anthropic', accuracy: '82.4/79.1/80.7', nodeF1: '85.6/82.8/84.2', edgeF1: '76.9/73.8/75.3', date: '2026/1/17', frameworkOpen: false, modelOpen: false, reproduced: false, trajUrl: 'https://example.com/traj/openrca2-claude-agent' },
  { name: 'RCA-Agent', model: 'GPT-4o', org: 'OpenRCA', accuracy: '69.8/64.2/66.9', nodeF1: '74.9/70.3/72.5', edgeF1: '63.5/59.1/61.2', date: '2026/1/20', frameworkOpen: true, modelOpen: false, reproduced: true, trajUrl: 'https://example.com/traj/openrca2-gpt4o-rca-agent' },
  { name: 'RCA-Agent', model: 'Gemini 1.5 Pro', org: 'Google', accuracy: '65.1/60.5/62.7', nodeF1: '71.2/67.4/69.3', edgeF1: '60.3/54.8/57.4', date: '2026/1/20', frameworkOpen: true, modelOpen: false, reproduced: true },
  { name: 'RCA-Agent', model: 'Claude 3.5 Sonnet', org: 'Microsoft', accuracy: '66.4/62.1/64.2', nodeF1: '72.9/68.1/70.4', edgeF1: '61.7/58.0/59.8', date: '2026/1/20', frameworkOpen: true, modelOpen: false, reproduced: true },
  { name: 'Prompting (Balanced)', model: 'Mistral Large 2', org: 'OpenRCA', accuracy: '52.0/46.0/48.9', nodeF1: '58.2/52.3/55.1', edgeF1: '45.9/40.5/43.0', date: '2026/1/18', frameworkOpen: true, modelOpen: true, reproduced: true },
  { name: 'Prompting (Balanced)', model: 'Command R+', org: 'OpenRCA', accuracy: '49.8/43.5/46.5', nodeF1: '56.7/50.8/53.4', edgeF1: '43.6/37.4/40.2', date: '2026/1/18', frameworkOpen: true, modelOpen: true, reproduced: true },
  { name: 'Prompting (Oracle)', model: 'Llama 3.1 Instruct', org: 'Meta', accuracy: '55.4/49.1/52.1', nodeF1: '61.2/56.3/58.7', edgeF1: '49.8/44.1/46.8', date: '2026/1/19', frameworkOpen: true, modelOpen: true, reproduced: true, trajUrl: 'https://example.com/traj/openrca2-llama-oracle' },
  { name: 'Prompting (Oracle)', model: 'GPT-4o', org: 'OpenAI', accuracy: '64.3/58.6/61.3', nodeF1: '70.2/65.9/68.1', edgeF1: '58.6/51.8/55.0', date: '2026/1/19', frameworkOpen: true, modelOpen: false, reproduced: true },
];
