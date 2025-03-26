import { Box, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Button, IconButton, Snackbar, Chip, Menu, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import GitHubIcon from '@mui/icons-material/GitHub';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FilterListIcon from '@mui/icons-material/FilterList';

interface Data {
  name: string;
  model: string,
  correct: string,
  partial: string,
  date: string
}

type Order = 'asc' | 'desc';

// 模型颜色映射
const modelColorMap: { [key: string]: { color: string, backgroundColor: string } } = {
  'Claude 3.5 Sonnet': { color: '#1a237e', backgroundColor: '#e8eaf6' },
  'GPT-4o': { color: '#004d40', backgroundColor: '#e0f2f1' },
  'Gemini 1.5 Pro': { color: '#b71c1c', backgroundColor: '#ffebee' },
  'Mistral Large 2': { color: '#0d47a1', backgroundColor: '#bbdefb' },
  'Command R+': { color: '#4a148c', backgroundColor: '#e1bee7' },
  'Llama 3.1 Instruct': { color: '#e65100', backgroundColor: '#ffe0b2' }
};

// 比较函数
function getComparator(order: Order, orderBy: keyof Data) {
  return (a: Data, b: Data) => {
    // 处理百分比字符串和日期
    const getValue = (value: string) => {
      if (value.endsWith('%')) {
        return parseFloat(value.slice(0, -1)); // 移除%并转换为数字
      }
      if (orderBy === 'date') {
        return new Date(value).getTime();
      }
      return value;
    };

    const valueA = getValue(a[orderBy]);
    const valueB = getValue(b[orderBy]);

    // 数字比较（包括百分比和日期）
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return order === 'desc' ? valueB - valueA : valueA - valueB;
    }

    // 字符串比较
    return order === 'desc' 
      ? String(valueB).localeCompare(String(valueA))
      : String(valueA).localeCompare(String(valueB));
  };
}

const Home = () => {
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof Data>('correct');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedModels, setSelectedModels] = useState<string[]>(Object.keys(modelColorMap));
  const [modelFilterAnchor, setModelFilterAnchor] = useState<null | HTMLElement>(null);

  const news = [
    { date: '2025/2/28', content: 'Our paper has been accepted by ICLR 2025.' },
    { date: '2025/2/15', content: 'Released OpenRCA dataset with 335 failure cases.' }
  ]

  const modelData: Data[] = [
    { name: 'RCA-Agent', model: 'Claude 3.5 Sonnet', correct: '11.34%', partial: '17.31%', date: '2025/2/17' },
    { name: 'RCA-Agent', model: 'GPT-4o', correct: '8.96%', partial: '17.91%', date: '2025/2/17' },
    { name: 'RCA-Agent', model: 'Gemini 1.5 Pro', correct: '2.69%', partial: '6.87%', date: '2025/2/17' },
    { name: 'Balanced', model: 'Claude 3.5 Sonnet', correct: '3.88%', partial: '18.81%', date: '2025/2/17' },
    { name: 'Balanced', model: 'GPT-4o', correct: '3.28%', partial: '14.33%', date: '2025/2/17' },
    { name: 'Balanced', model: 'Gemini 1.5 Pro', correct: '6.27%', partial: '24.18%', date: '2025/2/17' },
    { name: 'Oracle', model: 'Claude 3.5 Sonnet', correct: '5.37%', partial: '17.61%', date: '2025/2/15' },
    { name: 'Oracle', model: 'GPT-4o', correct: '6.27%', partial: '15.82%', date: '2025/2/15' },
    { name: 'Oracle', model: 'Gemini 1.5 Pro', correct: '7.16%', partial: '23.58%', date: '2025/2/15' },
    { name: 'Balanced', model: 'Mistral Large 2', correct: '3.58%', partial: '6.40%', date: '2025/2/17' },
    { name: 'Oracle', model: 'Mistral Large 2', correct: '4.48%', partial: '10.45%', date: '2025/2/15' },
    { name: 'Balanced', model: 'Command R+', correct: '4.18%', partial: '8.96%', date: '2025/2/17' },
    { name: 'Oracle', model: 'Command R+', correct: '4.78%', partial: '7.46%', date: '2025/2/15' },
    { name: 'Balanced', model: 'Llama 3.1 Instruct', correct: '2.99%', partial: '14.63%', date: '2025/2/17' },
    { name: 'Oracle', model: 'Llama 3.1 Instruct', correct: '3.88%', partial: '14.93%', date: '2025/2/15' },
    { name: 'RCA-Agent', model: 'Llama 3.1 Instruct', correct: '3.28%', partial: '5.67%', date: '2025/2/17' },
  ];

  const handleRequestSort = (property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleModelFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setModelFilterAnchor(event.currentTarget);
  };

  const handleModelFilterClose = () => {
    setModelFilterAnchor(null);
  };

  const handleModelToggle = (model: string) => {
    setSelectedModels(prev => {
      if (prev.includes(model)) {
        return prev.filter(m => m !== model);
      } else {
        return [...prev, model];
      }
    });
  };

  const handleSelectAllModels = () => {
    if (selectedModels.length === Object.keys(modelColorMap).length) {
      setSelectedModels([]);
    } else {
      setSelectedModels(Object.keys(modelColorMap));
    }
  };

  // 过滤数据
  const filteredAndSortedData = [...modelData]
    .filter(row => selectedModels.includes(row.model))
    .sort(getComparator(order, orderBy));

  const headCells = [
    { id: 'name' as keyof Data, label: 'Method Name', width: '30%', sortable: false },
    { 
      id: 'model' as keyof Data, 
      label: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          Model
          <IconButton 
            size="small" 
            onClick={handleModelFilterClick}
            sx={{ 
              color: 'inherit',
              padding: '2px',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <FilterListIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={modelFilterAnchor}
            open={Boolean(modelFilterAnchor)}
            onClose={handleModelFilterClose}
            PaperProps={{
              sx: {
                maxHeight: 300,
                width: 200,
                backgroundColor: '#ffffff'
              }
            }}
          >
            <MenuItem onClick={handleSelectAllModels}>
              <Checkbox 
                checked={selectedModels.length === Object.keys(modelColorMap).length}
                indeterminate={selectedModels.length > 0 && selectedModels.length < Object.keys(modelColorMap).length}
              />
              <ListItemText primary="Select All" />
            </MenuItem>
            {Object.keys(modelColorMap).map((model) => (
              <MenuItem key={model} onClick={() => handleModelToggle(model)}>
                <Checkbox checked={selectedModels.includes(model)} />
                <ListItemText 
                  primary={
                    <Chip 
                      label={model}
                      size="small"
                      sx={{
                        color: modelColorMap[model].color,
                        backgroundColor: modelColorMap[model].backgroundColor,
                        fontWeight: 500,
                        border: `1px solid ${modelColorMap[model].color}`
                      }}
                    />
                  }
                />
              </MenuItem>
            ))}
          </Menu>
        </Box>
      ),
      width: '25%', 
      sortable: false 
    },
    { id: 'correct' as keyof Data, label: 'Correct', width: '15%', sortable: true },
    { id: 'partial' as keyof Data, label: 'Partial', width: '15%', sortable: true },
    { id: 'date' as keyof Data, label: 'Date', width: '15%', sortable: true },
  ];

  const handleCopyClick = () => {
    const citationText = `@inproceedings{
xu2025openrca,
title={Open{RCA}: Can Large Language Models Locate the Root Cause of Software Failures?},
author={Junjielong Xu and Qinan Zhang and Zhiqing Zhong and Shilin He and Chaoyun Zhang and Qingwei Lin and Dan Pei and Pinjia He and Dongmei Zhang and Qi Zhang},
booktitle={The Thirteenth International Conference on Learning Representations},
year={2025},
url={https://openreview.net/forum?id=M4qNIzQYpd}
}`;
    navigator.clipboard.writeText(citationText);
    setOpenSnackbar(true);
  };

  return (
    <Box sx={{ 
      background: '#ffffff',
      minHeight: '100vh',
      pt: 4
    }}>
      <Container maxWidth="lg" sx={{ maxWidth: '1080px !important' }}>
        <Box sx={{ my: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #1565C0 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600,
              mb: 3,
              textAlign: 'center'
            }}
          >
            OPENRCA: CAN LARGE LANGUAGE MODELS LOCATE THE ROOT CAUSE OF SOFTWARE FAILURES?
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              mb: 4,
              color: '#424242',
              lineHeight: 1.8,
              textAlign: 'center'
            }}
          >
            OpenRCA includes 335 failures from three enterprise software systems, along with over 68 GB of telemetry data (logs, metrics, and traces). Given a failure case and its associated telemetry, the LLM is tasked to identify the root cause that triggered the failure, requiring comprehension of software dependencies and reasoning over heterogeneous, long-context telemetry data.
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: 2,
            mt: -1,
            mb: 1 
          }}>
            <Box
              component="img"
              src="/microsoft.jpg"
              alt="Microsoft Logo"
              onClick={() => window.open('https://www.microsoft.com', '_blank')}
              sx={{
                height: 100,
                objectFit: 'contain',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            />
            {/* <Box
              component="img" 
              src="/public/cuhksz.png"
              alt="CUHK-SZ Logo"
              onClick={() => window.open('https://www.cuhk.edu.cn/', '_blank')}
              sx={{
                height: 30,
                objectFit: 'contain',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            />
            <Box
              component="img"
              src="/public/thu.jpg"
              alt="Tsinghua Logo"
              onClick={() => window.open('https://www.tsinghua.edu.cn', '_blank')}
              sx={{
                height: 70,
                objectFit: 'contain',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            /> */}
          </Box>
          </Typography>

          <Box sx={{ mt: 6 }}>
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #1565C0 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600,
                mb: 3,
                textAlign: 'center'
              }}
            >
              News
            </Typography>
            <Paper sx={{ 
              p: 3, 
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              '& .MuiTypography-paragraph': {
                color: '#424242',
                position: 'relative',
                pl: 3,
                mb: 2,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #2196F3 30%, #1565C0 90%)'
                }
              }
            }}>
              {news.map((news, index) => (
                <Typography key={index} variant="body1" paragraph>
                  {news.date} {news.content}
                </Typography>
              ))}
            </Paper>
          </Box>

          <Box sx={{ 
            mt: 6,
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            p: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3, 
                background: 'linear-gradient(45deg, #2196F3 30%, #1565C0 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600,
                textAlign: 'center'
              }}
            >
              Leaderboard
            </Typography>
            
            <TableContainer 
              component={Paper} 
              sx={{ 
                boxShadow: 'none',
                backgroundColor: 'transparent',
                maxHeight: 400,
                overflow: 'overlay',
                '&::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'transparent'
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                  borderRadius: '4px'
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(33, 150, 243, 0.6)',
                  borderRadius: '4px',
                  '&:hover': {
                    background: 'rgba(21, 101, 192, 0.8)'
                  }
                },
                '@media (hover: hover)': {
                  '&::-webkit-scrollbar-thumb': {
                    visibility: 'hidden'
                  },
                  '&:hover::-webkit-scrollbar-thumb': {
                    visibility: 'visible'
                  }
                },
                '& .MuiTableCell-head': {
                  backgroundColor: '#1565C0',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  whiteSpace: 'nowrap',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1
                },
                '& .MuiTableRow-root:nth-of-type(even)': {
                  backgroundColor: '#ffffff'
                },
                '& .MuiTableRow-root:nth-of-type(odd)': {
                  backgroundColor: '#f8fafc'
                },
                '& .MuiTableRow-root:hover': {
                  backgroundColor: '#e3f2fd'
                },
                '& .MuiTableCell-root': {
                  padding: '16px 24px',
                  borderBottom: '1px solid #e2e8f0'
                },
                '& .MuiTableSortLabel-root.Mui-active': {
                  color: '#ffffff'
                },
                '& .MuiTableSortLabel-icon': {
                  color: '#ffffff !important'
                }
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {headCells.map((headCell) => (
                      <TableCell 
                        key={headCell.id}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{ width: headCell.width }}
                      >
                        {headCell.sortable ? (
                          <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={() => handleRequestSort(headCell.id)}
                          >
                            {headCell.label}
                          </TableSortLabel>
                        ) : (
                          headCell.label
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAndSortedData.map((row, index) => (
                    <TableRow 
                      key={row.name + row.model}
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        ...(index === 0 && {
                          '& td': { 
                            fontWeight: 600,
                            color: '#1565C0'
                          }
                        })
                      }}
                    >
                      <TableCell sx={{ width: '15%', textAlign: 'left', fontWeight: 600 }}>{row.name}</TableCell>
                      <TableCell sx={{ width: '20%', textAlign: 'left' }}>
                        <Chip 
                          label={row.model}
                          size="small"
                          sx={{
                            color: modelColorMap[row.model]?.color || '#000',
                            backgroundColor: modelColorMap[row.model]?.backgroundColor || '#f5f5f5',
                            fontWeight: 500,
                            '&:hover': {
                              backgroundColor: modelColorMap[row.model]?.backgroundColor || '#f5f5f5',
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ width: '15%', textAlign: 'left' }}>{row.correct}</TableCell>
                      <TableCell sx={{ width: '15%', textAlign: 'left' }}>{row.partial}</TableCell>
                      <TableCell sx={{ width: '15%', textAlign: 'left' }}>{row.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box sx={{ 
            mt: 4, 
            p: 3,
            backgroundColor: '#E65100',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'white',
            boxShadow: '0 4px 20px rgba(230, 81, 0, 0.2)'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Is your model or agent up to the challenge? Submit your results here!
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<EmailIcon />}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                Contact
              </Button>
              <Button
                variant="contained"
                startIcon={<FileUploadIcon />}
                sx={{
                  backgroundColor: '#000000',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  }
                }}
              >
                Submit
              </Button>
            </Box>
          </Box>


          <Box sx={{ mt: 6 }}>
            <Typography 
              variant="h5" 
              sx={{
                color: '#2c3e50',
                fontWeight: 600,
                mb: 3,
                textAlign: 'left'
              }}
            >
              What is the task in OpenRCA?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#2c3e50',
                fontWeight: 500,
                mb: 2,
                textAlign: 'left'
              }}
            >
              Identify the root cause that triggered the failure!
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#424242',
                mb: 4,
                lineHeight: 1.8,
                textAlign: 'left'
              }}
            >
              Each OpenRCA task is based on a real-world failure case from a software system and its associated telemetry data. Given the failure case and its associated telemetry, the task is to identify the root cause that triggered the failure, requiring comprehension of software dependencies and reasoning over heterogeneous, long-context telemetry data.
            </Typography>

            <Typography 
              variant="h5" 
              sx={{
                color: '#2c3e50',
                fontWeight: 600,
                mb: 3,
                mt: 6,
                textAlign: 'left'
              }}
            >
              What metrics do you measure?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#2c3e50',
                fontWeight: 500,
                mb: 2,
                textAlign: 'left'
              }}
            >
              We measure whether the LLM can identify the root cause that triggered the failure.
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#424242',
                mb: 4,
                lineHeight: 1.8,
                textAlign: 'left'
              }}
            >
              For a instance, if the LLM can identify the root cause that triggered the failure, we call it a successful RCA.
            </Typography>

            <Typography 
              variant="h5" 
              sx={{
                color: '#2c3e50',
                fontWeight: 600,
                mb: 3,
                mt: 6,
                textAlign: 'left',
                marginTop: '15vh'
              }}
            >
              Check out our paper for more details!
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#2c3e50',
                fontWeight: 500,
                mb: 2,
                textAlign: 'center'
              }}
            >
              OPENRCA: CAN LARGE LANGUAGE MODELS LOCATE THE ROOT CAUSE OF SOFTWARE FAILURES?
            </Typography>

            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: '#424242' }}>
              Junjielong Xu<sup>1,2*</sup>, Qinan Zhang<sup>1</sup>, Zhiqing Zhong<sup>1</sup>, Shilin He<sup>2†</sup>, Chaoyun Zhang<sup>2</sup>, Qingwei Lin<sup>2</sup>, Dan Pei<sup>3</sup>, Pinjia He<sup>1†</sup>, Dongmei Zhang<sup>2</sup>, Qi Zhang<sup>2</sup>
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                <sup>1</sup>School of Data Science, The Chinese University of Hong Kong, Shenzhen <sup>2</sup>Microsoft <sup>3</sup>Tsinghua University
                <br></br>
                <sup>*</sup> Work was done when Junjielong Xu was interning at Microsoft DKI.
                <br></br>
                 <sup>†</sup> Shilin He and Pinjia He are the corresponding authors.

              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<DescriptionIcon />}
                href="https://iclr.cc/virtual/2025/poster/32093"
                sx={{
                  backgroundColor: '#1565C0',
                  '&:hover': {
                    backgroundColor: '#1976D2',
                  }
                }}
              >
                Paper
              </Button>
              <Button
                variant="contained"
                startIcon={<GitHubIcon />}
                href="https://github.com/microsoft/OpenRCA"
                sx={{
                  backgroundColor: '#2c3e50',
                  '&:hover': {
                    backgroundColor: '#34495e',
                  }
                }}
              >
                Code
              </Button>
            </Box>

            <Typography 
              variant="body2" 
              sx={{ 
                color: '#666',
                mb: 2,
                textAlign: 'center'
              }}
            >
              If you have any remaining questions, please feel free to contact us at contact@openrca.com
            </Typography>

            <Typography 
              variant="h5" 
              sx={{
                color: '#2c3e50',
                fontWeight: 600,
                mb: 3,
                mt: 6
              }}
            >
              Citing this work
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#424242',
                mb: 2
              }}
            >
              If you use this benchmark, please cite:
            </Typography>
            <Paper 
              sx={{ 
                p: 3,
                backgroundColor: '#fdf6e3',
                borderRadius: '8px',
                position: 'relative',
                '& pre': {
                  margin: 0,
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  lineHeight: 1.8,
                  color: '#2c3e50',
                  whiteSpace: 'pre-wrap'
                },
                '& .bibtex': {
                  color: '#a0522d'
                },
                '& .identifier': {
                  color: '#8b4513'
                },
                '& .field': {
                  color: '#0086b3'
                },
                '& .value': {
                  color: '#22863a'
                }
              }}
            >
              <IconButton
                onClick={handleCopyClick}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  backgroundColor: 'rgba(0, 0, 0, 0.03)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)'
                  }
                }}
              >
                <ContentCopyIcon />
              </IconButton>
              <pre>
<span className="bibtex">@inproceedings</span>&#123;<span className="identifier">xu2025openrca</span>,
<br></br>
<span>     </span>
  <span className="field">title</span>=&#123;<span className="value">OpenRCA: Can Large Language Models Locate the Root Cause of Software Failures?</span>&#125;,
  <br></br>
  <span>     </span>
  <span className="field">author</span>=&#123;<span className="value">Junjielong Xu and Qinan Zhang and Zhiqing Zhong and Shilin He and Chaoyun Zhang and Qingwei Lin and</span>
  <br></br>
  <span>             </span>
  <span className="value">Dan Pei and Pinjia He and Dongmei Zhang and Qi Zhang</span>&#125;,
  <br></br>
  <span>     </span>
  <span className="field">booktitle</span>=&#123;<span className="value">The Thirteenth International Conference on Learning Representations</span>&#125;,
  <br></br>
  <span>     </span>
  <span className="field">year</span>=&#123;<span className="value">2025</span>&#125;,
  <br></br>
  <span>     </span>
  <span className="field">url</span>=&#123;<span className="value">https://openreview.net/forum?id=M4qNIzQYpd</span>&#125;
  <br></br>
&#125;</pre>
            </Paper>
            <Snackbar
              open={openSnackbar}
              autoHideDuration={2000}
              onClose={() => setOpenSnackbar(false)}
              message="Citation copied to clipboard"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 