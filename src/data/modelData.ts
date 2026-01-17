export interface Data {
  name: string;
  model: string;
  org: string;
  correct: string;
  date: string;
}

const prefix = '/openrca_leadboard'

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
  'Google': `${prefix}/google_logo.svg`,
  'OpenAI': `${prefix}/openai_logo.svg`,
  'Anthropic': `${prefix}/anthropic-1.svg`,
  'Meta': `${prefix}/meta_logo.svg`
};

// 新闻数据
export const news = [
  {
    date: '2026/1/217',
    content: "🎉🎉🎉 Anthropic's Claude 4.5 Opus + Claude Agent SDK & SRE Tool MCP achieves SOTA"
  },
  { date: '2025/1/23', content: 'Our paper has been accepted by ICLR 2025.' },
  { date: '2025/1/23', content: 'Released OpenRCA dataset with 335 failure cases.' }
];

// 模型数据
export const modelData: Data[] = [
  { name: 'Claude Agent SDK & SRE Tool MCP', model: 'Claude 4.5 Opus', org: 'Anthropic', correct: '91.5%', date: '2026/1/17' },
  // Closed Models - RCA-Agent
  { name: 'RCA-Agent', model: 'Claude 3.5 Sonnet', org: 'Microsoft', correct: '11.34%', date: '2025/1/23' },
  { name: 'RCA-Agent', model: 'GPT-4o', org: 'Microsoft', correct: '8.96%', date: '2025/1/23' },
  { name: 'RCA-Agent', model: 'Gemini 1.5 Pro', org: 'Microsoft', correct: '2.69%', date: '2025/1/23' },
  
  // Closed Models - Balanced
  { name: 'Prompting (Balanced)', model: 'Claude 3.5 Sonnet', org: 'Microsoft', correct: '3.88%', date: '2025/1/23' },
  { name: 'Prompting (Balanced)', model: 'GPT-4o', org: 'Microsoft', correct: '3.28%', date: '2025/1/23' },
  { name: 'Prompting (Balanced)', model: 'Gemini 1.5 Pro', org: 'Microsoft', correct: '6.27%', date: '2025/1/23' },
  
  // Closed Models - Oracle
  { name: 'Prompting (Oracle)', model: 'Claude 3.5 Sonnet', org: 'Microsoft', correct: '5.37%', date: '2025/1/23' },
  { name: 'Prompting (Oracle)', model: 'GPT-4o', org: 'Microsoft', correct: '6.27%', date: '2025/1/23' },
  { name: 'Prompting (Oracle)', model: 'Gemini 1.5 Pro', org: 'Microsoft', correct: '7.16%', date: '2025/1/23' },
  
  // Open Source Models - Balanced
  { name: 'Prompting (Balanced)', model: 'Mistral Large 2', org: 'Microsoft', correct: '3.58%', date: '2025/1/23' },
  { name: 'Prompting (Balanced)', model: 'Command R+', org: 'Microsoft', correct: '4.18%', date: '2025/1/23' },
  { name: 'Prompting (Balanced)', model: 'Llama 3.1 Instruct', org: 'Microsoft', correct: '2.99%', date: '2025/1/23' },
  
  // Open Source Models - Oracle
  { name: 'Prompting (Oracle)', model: 'Mistral Large 2', org: 'Microsoft', correct: '4.48%', date: '2025/1/23' },
  { name: 'Prompting (Oracle)', model: 'Command R+', org: 'Microsoft', correct: '4.78%', date: '2025/1/23' },
  { name: 'Prompting (Oracle)', model: 'Llama 3.1 Instruct', org: 'Microsoft', correct: '3.88%', date: '2025/1/23' },
  
  // Open Source Models - RCA-Agent
  { name: 'RCA-Agent', model: 'Llama 3.1 Instruct', org: 'Microsoft', correct: '3.28%', date: '2025/1/23' }
]; 