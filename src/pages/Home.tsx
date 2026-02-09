import { Box, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, IconButton, Snackbar, Chip, Menu, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { Button as AntButton, Space } from 'antd';
import { useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import GitHubIcon from '@mui/icons-material/GitHub';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FilterListIcon from '@mui/icons-material/FilterList';
import LinkIcon from '@mui/icons-material/Link';
import { Data, DataOpenRCA2, modelColorMap, orgLogoMap, news, modelDataOpenRCA, modelDataOpenRCA2 } from '../data/modelData';

type Order = 'asc' | 'desc';
type OrderByOpenRCA = keyof Data;
type OrderByOpenRCA2 = keyof DataOpenRCA2;

const prefix = import.meta.env.BASE_URL.replace(/\/$/, '')

// 比较函数
function getComparator<T extends Record<string, unknown>>(order: Order, orderBy: keyof T) {
  return (a: T, b: T) => {
    const getValue = (value: unknown) => {
      if (typeof value === 'string') {
        if (value.endsWith('%')) {
          return parseFloat(value.slice(0, -1));
        }
        if (orderBy === 'date') {
          return new Date(value).getTime();
        }
        return value;
      }
      if (typeof value === 'boolean') {
        return value ? 1 : 0;
      }
      return String(value ?? '');
    };

    const valueA = getValue(a[orderBy]);
    const valueB = getValue(b[orderBy]);

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return order === 'desc' ? valueB - valueA : valueA - valueB;
    }

    return order === 'desc'
      ? String(valueB).localeCompare(String(valueA))
      : String(valueA).localeCompare(String(valueB));
  };
}

const Home = () => {
  const [orderOpenRCA, setOrderOpenRCA] = useState<Order>('desc');
  const [orderByOpenRCA, setOrderByOpenRCA] = useState<OrderByOpenRCA>('correct');
  const [orderOpenRCA2, setOrderOpenRCA2] = useState<Order>('desc');
  const [orderByOpenRCA2, setOrderByOpenRCA2] = useState<OrderByOpenRCA2>('accuracy');
  const [openSnackbarCite, setOpenSnackbarCite] = useState(false);
  const [openSnackbarMail, setOpenSnackbarMail] = useState(false);
  const [selectedModels, setSelectedModels] = useState<string[]>(Object.keys(modelColorMap));
  const [modelFilterAnchor, setModelFilterAnchor] = useState<null | HTMLElement>(null);
  const [filterAll, setFilterAll] = useState(true);
  const [filterRcaAgent, setFilterRcaAgent] = useState(false);
  const [filterFrameworkOpen, setFilterFrameworkOpen] = useState(false);
  const [filterModelOpen, setFilterModelOpen] = useState(false);
  const [activeDataset, setActiveDataset] = useState<'OpenRCA' | 'OpenRCA 2.0'>('OpenRCA');

  const handleRequestSortOpenRCA = (property: OrderByOpenRCA) => {
    const isAsc = orderByOpenRCA === property && orderOpenRCA === 'asc';
    setOrderOpenRCA(isAsc ? 'desc' : 'asc');
    setOrderByOpenRCA(property);
  };

  const handleRequestSortOpenRCA2 = (property: OrderByOpenRCA2) => {
    const isAsc = orderByOpenRCA2 === property && orderOpenRCA2 === 'asc';
    setOrderOpenRCA2(isAsc ? 'desc' : 'asc');
    setOrderByOpenRCA2(property);
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

  const isSpecificTagActive = filterRcaAgent || filterFrameworkOpen || filterModelOpen;

  const applyFilters = <T extends { model: string; name: string; frameworkOpen: boolean; modelOpen: boolean }>(rows: T[]) => (
    rows
      .filter(row => selectedModels.includes(row.model))
      .filter(row => {
      if (!filterAll && isSpecificTagActive) {
        if (filterRcaAgent && row.name !== 'RCA-Agent') return false;
        if (filterFrameworkOpen && !row.frameworkOpen) return false;
        if (filterModelOpen && !row.modelOpen) return false;
      }
      return true;
      })
  );

  const filteredAndSortedDataOpenRCA = [...applyFilters(modelDataOpenRCA)]
    .sort(getComparator(orderOpenRCA, orderByOpenRCA));

  const filteredAndSortedDataOpenRCA2 = [...applyFilters(modelDataOpenRCA2)]
    .sort(getComparator(orderOpenRCA2, orderByOpenRCA2));

  // 找出最高值
  const maxCorrect = filteredAndSortedDataOpenRCA.length > 0
    ? Math.max(...filteredAndSortedDataOpenRCA.map(row => parseFloat(row.correct)))
    : 0;

  const maxAccuracy = filteredAndSortedDataOpenRCA2.length > 0
    ? Math.max(...filteredAndSortedDataOpenRCA2.map(row => parseFloat(row.accuracy)))
    : 0;
  const maxNodeF1 = filteredAndSortedDataOpenRCA2.length > 0
    ? Math.max(...filteredAndSortedDataOpenRCA2.map(row => parseFloat(row.nodeF1)))
    : 0;
  const maxEdgeF1 = filteredAndSortedDataOpenRCA2.length > 0
    ? Math.max(...filteredAndSortedDataOpenRCA2.map(row => parseFloat(row.edgeF1)))
    : 0;

  const modelHeaderLabel = (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
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
  );

  const statusHeaderLabel = (
    <Box sx={{ textAlign: 'center', lineHeight: 1.1, minWidth: 180 }}>
      <Box component="span" sx={{ display: 'block', fontWeight: 700 }}>Transparency</Box>
      <Box component="span" sx={{ display: 'block', mt: 0.35, fontSize: '0.65rem', opacity: 0.92, whiteSpace: 'nowrap' }}>
        Scaffold / Model
      </Box>
    </Box>
  );

  const headCellsOpenRCA: Array<{
    id: OrderByOpenRCA;
    label: string | JSX.Element;
    width: string;
    sortable: boolean;
  }> = [
    { id: 'name', label: 'Method Name', width: '28%', sortable: false },
    {
      id: 'model',
      label: modelHeaderLabel,
      width: '12%',
      sortable: false
    },
    { id: 'org', label: 'Org.', width: '4%', sortable: false },
    { id: 'trajUrl', label: 'Traj.', width: '4%', sortable: false },
    { id: 'frameworkOpen', label: statusHeaderLabel, width: '24%', sortable: false },
    { id: 'correct', label: 'Acc.', width: '9%', sortable: true },
    { id: 'date', label: 'Date', width: '10%', sortable: true },
  ];

  const headCellsOpenRCA2: Array<{
    id: OrderByOpenRCA2;
    label: string | JSX.Element;
    width: string;
    sortable: boolean;
  }> = [
    { id: 'name', label: 'Method Name', width: '26%', sortable: false },
    { id: 'model', label: modelHeaderLabel, width: '13%', sortable: false },
    { id: 'org', label: 'Org.', width: '7%', sortable: false },
    { id: 'trajUrl', label: 'Traj.', width: '5%', sortable: false },
    { id: 'frameworkOpen', label: statusHeaderLabel, width: '22%', sortable: false },
    { id: 'accuracy', label: 'Acc.', width: '8%', sortable: true },
    {
      id: 'nodeF1',
      label: (
        <Box sx={{ lineHeight: 1.05 }}>
          <Box component="span" sx={{ display: 'block', fontWeight: 700, letterSpacing: '0.06em' }}>Node</Box>
          <Box component="span" sx={{ display: 'block', opacity: 0.9, mt: 0.35 }}>F1 / P / R</Box>
        </Box>
      ),
      width: '8%',
      sortable: true
    },
    {
      id: 'edgeF1',
      label: (
        <Box sx={{ lineHeight: 1.05 }}>
          <Box component="span" sx={{ display: 'block', fontWeight: 700, letterSpacing: '0.06em' }}>Edge</Box>
          <Box component="span" sx={{ display: 'block', opacity: 0.9, mt: 0.35 }}>F1 / P / R</Box>
        </Box>
      ),
      width: '8%',
      sortable: true
    },
    { id: 'date', label: 'Date', width: '10%', sortable: true },
  ];

  const handleCopyClick = () => {
    const citationText = `@inproceedings{
xu2025openrca,
title={Open{RCA}: Can Large Language Models Locate the Root Cause of Software Failures?},
author={Junjielong Xu and Qinan Zhang and Zhiqing Zhong and Shilin He and Chaoyun Zhang and Qingwei Lin and Dan Pei and Pinjia He and Dongmei Zhang and Qi Zhang},
booktitle={The Thirteenth International Conference on Learning Representations},
year={2025},
url={https://openreview.net/forum?id=M4qNIzQYpd}
},
@article{fang2025rethinking,
  title={Rethinking the Evaluation of Microservice RCA with a Fault Propagation-Aware Benchmark},
  author={Fang, Aoyang and Zhang, Songhan and Yang, Yifan and Wu, Haotong and Xu, Junjielong and Wang, Xuyang and Wang, Rui and Wang, Manyi and Lu, Qisheng and He, Pinjia},
  journal={arXiv preprint arXiv:2510.04711},
  year={2025}
}`;
    navigator.clipboard.writeText(citationText);
    setOpenSnackbarCite(true);
  };

  return (
    <Box sx={{ 
      background: '#ffffff',
      minHeight: '100vh',
      pt: 4
    }}>
      <Container maxWidth={false} sx={{ maxWidth: '1320px !important' }}>
        <Box sx={{ my: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{
              fontSize: { xs: '2rem', md: '2.6rem' },
              background: 'linear-gradient(45deg, #2196F3 30%, #1565C0 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600,
              mb: 3,
              textAlign: 'center'
            }}
          >
            <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
              <Box
                component="img"
                src={`${prefix}/openrca_logo_white.png`}
                alt="OpenRCA Logo"
                sx={{
                  display: 'inline-block',
                  height: { xs: 60, md: 80 },
                  width: 'auto',
                  verticalAlign: 'text-center',
                  mr: 1
                }}
              />
              OpenRCA
            </Box>
            : Can Large Language Models Locate the Root Cause of Software Failures?
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              mb: 4,
              color: '#424242',
              lineHeight: 1.5,
              fontSize: { xs: '0.88rem', md: '0.95rem' },
              textAlign: 'center',
              maxWidth: '1200px',
              mx: 'auto'
            }}
          >
            OpenRCA includes 335 failures from three enterprise software systems, along with over 68 GB of telemetry data (logs, metrics, and traces). Given a failure case and its associated telemetry, the LLM is tasked to identify the root cause of the failure, requiring comprehension of software dependencies and reasoning over heterogeneous, long-context telemetry data.
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: 2,
            mt: 1,
            mb: 1 ,
            ml: 2,
            position: 'relative',
            zIndex: 0
          }}>
            <Box
              component="img"
              src={`${prefix}/microsoft.jpg`}
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
            <Box
              component="img" 
              src={`${prefix}/cuhksz.png`}
              alt="CUHK-SZ Logo"
              onClick={() => window.open('https://www.cuhk.edu.cn/', '_blank')}
              sx={{
                height: 30,
                objectFit: 'contain',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)'
                },
                zIndex: 0
              }}
            />
            <Box
              component="img"
              src={`${prefix}/thu.jpg`}
              alt="Tsinghua Logo"
              onClick={() => window.open('https://www.tsinghua.edu.cn', '_blank')}
              sx={{
                height: 70,
                objectFit: 'contain',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)'
                },
                marginLeft: '-1vw'
              }}
            />
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2.5 }}>
              <Space.Compact>
                <AntButton
                  size="large"
                  type={activeDataset === 'OpenRCA' ? 'primary' : 'default'}
                  onClick={() => setActiveDataset('OpenRCA')}
                  style={{
                    padding: '8px 22px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderColor: activeDataset === 'OpenRCA' ? '#1565C0' : '#cbd5e1',
                    background: activeDataset === 'OpenRCA'
                      ? 'linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 100%)'
                      : '#ffffff',
                    color: activeDataset === 'OpenRCA' ? '#ffffff' : '#0f172a',
                    boxShadow: activeDataset === 'OpenRCA'
                      ? '0 10px 24px rgba(14, 116, 211, 0.35)'
                      : '0 6px 16px rgba(15, 23, 42, 0.08)'
                  }}
                >
                  OpenRCA 1.0
                </AntButton>
                <AntButton
                  size="large"
                  type={activeDataset === 'OpenRCA 2.0' ? 'primary' : 'default'}
                  onClick={() => setActiveDataset('OpenRCA 2.0')}
                  style={{
                    padding: '8px 22px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderColor: activeDataset === 'OpenRCA 2.0' ? '#7c3aed' : '#cbd5e1',
                    background: activeDataset === 'OpenRCA 2.0'
                      ? 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)'
                      : '#ffffff',
                    color: activeDataset === 'OpenRCA 2.0' ? '#ffffff' : '#0f172a',
                    boxShadow: activeDataset === 'OpenRCA 2.0'
                      ? '0 10px 24px rgba(124, 58, 237, 0.35)'
                      : '0 6px 16px rgba(15, 23, 42, 0.08)'
                  }}
                >
                  OpenRCA 2.0 [Preview]
                </AntButton>
              </Space.Compact>
            </Box>

            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                color: '#4b5563',
                mb: 1
              }}
            >
              Use the tags below to filter results. The table also indicates open-source status of each method.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: 1.5,
                flexWrap: 'wrap',
                mb: 2
              }}
            >
              <AntButton
                type={filterAll ? 'primary' : 'default'}
                onClick={() => {
                  setFilterAll(true);
                  setFilterRcaAgent(false);
                  setFilterFrameworkOpen(false);
                  setFilterModelOpen(false);
                }}
                style={{
                  borderRadius: 12,
                  padding: '6px 18px',
                  fontWeight: 600,
                  backgroundColor: filterAll ? '#7c3aed' : '#ffffff',
                  borderColor: filterAll ? '#7c3aed' : '#dbe4f3',
                  color: filterAll ? '#ffffff' : '#475569',
                  boxShadow: filterAll ? '0 10px 20px rgba(124, 58, 237, 0.25)' : 'none'
                }}
              >
                All
              </AntButton>
              <AntButton
                type={filterRcaAgent ? 'primary' : 'default'}
                onClick={() => {
                  const nextRca = !filterRcaAgent;
                  const nextFramework = filterFrameworkOpen;
                  const nextModel = filterModelOpen;
                  const anySpecific = nextRca || nextFramework || nextModel;
                  setFilterAll(!anySpecific);
                  setFilterRcaAgent(nextRca);
                }}
                style={{
                  borderRadius: 12,
                  padding: '6px 18px',
                  fontWeight: 600,
                  backgroundColor: filterRcaAgent ? '#7c3aed' : '#ffffff',
                  borderColor: filterRcaAgent ? '#7c3aed' : '#dbe4f3',
                  color: filterRcaAgent ? '#ffffff' : '#475569',
                  boxShadow: filterRcaAgent ? '0 10px 20px rgba(124, 58, 237, 0.25)' : 'none'
                }}
              >
                Standard*
              </AntButton>
              <AntButton
                type={filterFrameworkOpen ? 'primary' : 'default'}
                onClick={() => {
                  const nextRca = filterRcaAgent;
                  const nextFramework = !filterFrameworkOpen;
                  const nextModel = filterModelOpen;
                  const anySpecific = nextRca || nextFramework || nextModel;
                  setFilterAll(!anySpecific);
                  setFilterFrameworkOpen(nextFramework);
                }}
                style={{
                  borderRadius: 12,
                  padding: '6px 18px',
                  fontWeight: 600,
                  backgroundColor: filterFrameworkOpen ? '#10b981' : '#ffffff',
                  borderColor: filterFrameworkOpen ? '#10b981' : '#dbe4f3',
                  color: filterFrameworkOpen ? '#ffffff' : '#475569',
                  boxShadow: filterFrameworkOpen ? '0 10px 20px rgba(16, 185, 129, 0.25)' : 'none'
                }}
              >
                Open Scaffolds
              </AntButton>
              <AntButton
                type={filterModelOpen ? 'primary' : 'default'}
                onClick={() => {
                  const nextRca = filterRcaAgent;
                  const nextFramework = filterFrameworkOpen;
                  const nextModel = !filterModelOpen;
                  const anySpecific = nextRca || nextFramework || nextModel;
                  setFilterAll(!anySpecific);
                  setFilterModelOpen(nextModel);
                }}
                style={{
                  borderRadius: 12,
                  padding: '6px 18px',
                  fontWeight: 600,
                  backgroundColor: filterModelOpen ? '#f59e0b' : '#ffffff',
                  borderColor: filterModelOpen ? '#f59e0b' : '#dbe4f3',
                  color: filterModelOpen ? '#ffffff' : '#475569',
                  boxShadow: filterModelOpen ? '0 10px 20px rgba(245, 158, 11, 0.25)' : 'none'
                }}
              >
                Open Weights
              </AntButton>
            </Box>

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'left',
                color: '#6b7280',
                mb: 1.5
              }}
            >
              * Standard harness: using RCA-Agent as the scaffold.
            </Typography>
            
            <TableContainer 
              component={Paper} 
              sx={{ 
                boxShadow: 'none',
                backgroundColor: 'transparent',
                maxHeight: 400,
                overflow: 'overlay',
                '&::-webkit-scrollbar': {
                  width: '6px',
                  height: '6px',
                  backgroundColor: 'transparent'
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                  borderRadius: '3px'
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(33, 150, 243, 0.6)',
                  borderRadius: '3px',
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
                }
              }}
            >
              <Table 
                stickyHeader 
                size="small"
                sx={{
                  '& .MuiTableCell-root': {
                    padding: '8px 16px',
                  }
                }}
              >
                {activeDataset === 'OpenRCA' ? (
                  <>
                    <TableHead>
                      <TableRow>
                        {headCellsOpenRCA.map((headCell) => (
                          <TableCell
                            key={headCell.id}
                            sortDirection={orderByOpenRCA === headCell.id ? orderOpenRCA : false}
                            sx={{
                              width: headCell.width,
                              backgroundColor: '#1976d2',
                              color: 'white',
                              fontWeight: 600,
                              textAlign: headCell.id === 'name' ? 'left' : 'center'
                            }}
                          >
                            {typeof headCell.label === 'string' ? (
                              headCell.sortable ? (
                                <TableSortLabel
                                  active={orderByOpenRCA === headCell.id}
                                  direction={orderByOpenRCA === headCell.id ? orderOpenRCA : 'asc'}
                                  onClick={() => handleRequestSortOpenRCA(headCell.id)}
                                  sx={{
                                    width: '100%',
                                    justifyContent: headCell.id === 'name' ? 'flex-start' : 'center',
                                    '&.MuiTableSortLabel-root': { color: 'white' },
                                    '&.MuiTableSortLabel-root:hover': { color: 'white' },
                                    '&.Mui-active': { color: 'white' },
                                    '& .MuiTableSortLabel-icon': { color: 'white !important' },
                                  }}
                                >
                                  {headCell.label}
                                </TableSortLabel>
                              ) : (
                                headCell.label
                              )
                            ) : (
                              headCell.label
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredAndSortedDataOpenRCA.map((row) => (
                        <TableRow
                          key={row.name + row.model}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                            backgroundColor: row.model.includes('*') ? 'rgba(0, 0, 0, 0.02)' : 'inherit'
                          }}
                        >
                          <TableCell sx={{ width: '28%', textAlign: 'left', fontWeight: 600 }}>
                            {row.name}
                          </TableCell>
                          <TableCell sx={{ width: '14%', textAlign: 'center' }}>
                            <Chip
                              label={row.model}
                              size="small"
                              sx={{
                                color: modelColorMap[row.model.replace('*', '')]?.color || '#000',
                                backgroundColor: modelColorMap[row.model.replace('*', '')]?.backgroundColor || '#f5f5f5',
                                fontWeight: 500,
                                '&:hover': {
                                  backgroundColor: modelColorMap[row.model.replace('*', '')]?.backgroundColor || '#f5f5f5',
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ width: '7%', textAlign: 'center' }}>
                            {orgLogoMap[row.org] === '-' ? (
                              <Typography sx={{ color: '#757575' }}>—</Typography>
                            ) : (
                              <Box
                                component="img"
                                src={orgLogoMap[row.org] || `${prefix}/default_logo.svg`}
                                alt={`${row.org} Logo`}
                                sx={{
                                  height: 20,
                                  width: 'auto',
                                  objectFit: 'contain',
                                  opacity: row.model.includes('*') ? 0.7 : 1,
                                  filter: row.model.includes('*') ? 'grayscale(20%)' : 'none'
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell sx={{ width: '6%', textAlign: 'center' }}>
                            {row.trajUrl ? (
                              <IconButton
                                size="small"
                                component="a"
                                href={row.trajUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  color: '#2563eb',
                                  backgroundColor: 'rgba(37, 99, 235, 0.08)',
                                  '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.16)' }
                                }}
                              >
                                <LinkIcon fontSize="small" />
                              </IconButton>
                            ) : (
                              <Typography variant="body2" sx={{ color: '#94a3b8' }}>—</Typography>
                            )}
                          </TableCell>
                          <TableCell sx={{ width: '24%', textAlign: 'center' }}>
                            <Box
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.6,
                                px: 1.2,
                                py: 0.35,
                                borderRadius: '999px',
                                backgroundColor: '#f8fafc',
                                border: '1px solid #dbeafe'
                              }}
                            >
                              <Box component="span">{row.frameworkOpen ? '✅' : '✖️'}</Box>
                              <Box component="span" sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>/</Box>
                              <Box component="span">{row.modelOpen ? '✅' : '✖️'}</Box>
                            </Box>
                          </TableCell>
                          <TableCell
                            sx={{
                              width: '9%',
                              textAlign: 'center',
                              fontWeight: parseFloat(row.correct) === maxCorrect ? 600 : 'inherit',
                              color: parseFloat(row.correct) === maxCorrect ? '#1976d2' : 'inherit'
                            }}
                          >
                            {row.correct}
                          </TableCell>
                          <TableCell sx={{ width: '10%', textAlign: 'center' }}>{row.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </>
                ) : (
                  <>
                    <TableHead>
                      <TableRow>
                        {headCellsOpenRCA2.map((headCell) => (
                          <TableCell
                            key={headCell.id}
                            sortDirection={orderByOpenRCA2 === headCell.id ? orderOpenRCA2 : false}
                            sx={{
                              width: headCell.width,
                              backgroundColor: '#1976d2',
                              color: 'white',
                              fontWeight: 600,
                              textAlign: headCell.id === 'name' ? 'left' : 'center'
                            }}
                          >
                            {typeof headCell.label === 'string' ? (
                              headCell.sortable ? (
                                <TableSortLabel
                                  active={orderByOpenRCA2 === headCell.id}
                                  direction={orderByOpenRCA2 === headCell.id ? orderOpenRCA2 : 'asc'}
                                  onClick={() => handleRequestSortOpenRCA2(headCell.id)}
                                  sx={{
                                    width: '100%',
                                    justifyContent: headCell.id === 'name' ? 'flex-start' : 'center',
                                    '&.MuiTableSortLabel-root': { color: 'white' },
                                    '&.MuiTableSortLabel-root:hover': { color: 'white' },
                                    '&.Mui-active': { color: 'white' },
                                    '& .MuiTableSortLabel-icon': { color: 'white !important' },
                                  }}
                                >
                                  {headCell.label}
                                </TableSortLabel>
                              ) : (
                                headCell.label
                              )
                            ) : (
                              headCell.label
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredAndSortedDataOpenRCA2.map((row) => (
                        <TableRow
                          key={row.name + row.model}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                            backgroundColor: row.model.includes('*') ? 'rgba(0, 0, 0, 0.02)' : 'inherit'
                          }}
                        >
                          <TableCell sx={{ width: '26%', textAlign: 'left', fontWeight: 600 }}>
                            {row.name}
                          </TableCell>
                          <TableCell sx={{ width: '13%', textAlign: 'center' }}>
                            <Chip
                              label={row.model}
                              size="small"
                              sx={{
                                color: modelColorMap[row.model.replace('*', '')]?.color || '#000',
                                backgroundColor: modelColorMap[row.model.replace('*', '')]?.backgroundColor || '#f5f5f5',
                                fontWeight: 500,
                                '&:hover': {
                                  backgroundColor: modelColorMap[row.model.replace('*', '')]?.backgroundColor || '#f5f5f5',
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ width: '7%', textAlign: 'center' }}>
                            {orgLogoMap[row.org] === '-' ? (
                              <Typography sx={{ color: '#757575' }}>—</Typography>
                            ) : (
                              <Box
                                component="img"
                                src={orgLogoMap[row.org] || `${prefix}/default_logo.svg`}
                                alt={`${row.org} Logo`}
                                sx={{ height: 20, width: 'auto', objectFit: 'contain' }}
                              />
                            )}
                          </TableCell>
                          <TableCell sx={{ width: '5%', textAlign: 'center' }}>
                            {row.trajUrl ? (
                              <IconButton
                                size="small"
                                component="a"
                                href={row.trajUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  color: '#2563eb',
                                  backgroundColor: 'rgba(37, 99, 235, 0.08)',
                                  '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.16)' }
                                }}
                              >
                                <LinkIcon fontSize="small" />
                              </IconButton>
                            ) : (
                              <Typography variant="body2" sx={{ color: '#94a3b8' }}>—</Typography>
                            )}
                          </TableCell>
                          <TableCell sx={{ width: '22%', textAlign: 'center' }}>
                            <Box
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.6,
                                px: 1.2,
                                py: 0.35,
                                borderRadius: '999px',
                                backgroundColor: '#f8fafc',
                                border: '1px solid #dbeafe'
                              }}
                            >
                              <Box component="span">{row.frameworkOpen ? '✅' : '✖️'}</Box>
                              <Box component="span" sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>/</Box>
                              <Box component="span">{row.modelOpen ? '✅' : '✖️'}</Box>
                            </Box>
                          </TableCell>
                          <TableCell
                            sx={{
                              width: '8%',
                              textAlign: 'center',
                              fontWeight: parseFloat(row.accuracy) === maxAccuracy ? 600 : 'inherit',
                              color: parseFloat(row.accuracy) === maxAccuracy ? '#1976d2' : 'inherit'
                            }}
                          >
                            {row.accuracy}
                          </TableCell>
                          <TableCell
                            sx={{
                              width: '8%',
                              textAlign: 'center',
                              fontWeight: parseFloat(row.nodeF1) === maxNodeF1 ? 600 : 'inherit',
                              color: parseFloat(row.nodeF1) === maxNodeF1 ? '#1976d2' : 'inherit'
                            }}
                          >
                            {row.nodeF1}
                          </TableCell>
                          <TableCell
                            sx={{
                              width: '8%',
                              textAlign: 'center',
                              fontWeight: parseFloat(row.edgeF1) === maxEdgeF1 ? 600 : 'inherit',
                              color: parseFloat(row.edgeF1) === maxEdgeF1 ? '#1976d2' : 'inherit'
                            }}
                          >
                            {row.edgeF1}
                          </TableCell>
                          <TableCell sx={{ width: '10%', textAlign: 'center' }}>{row.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </>
                )}
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
            <Space size="middle">
              <AntButton
                type="default"
                icon={<EmailIcon />}
                onClick={() => {
                  navigator.clipboard.writeText('openrcanon@gmail.com');
                  setOpenSnackbarMail(true);
                }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.3)'
                }}
              >
                Contact
              </AntButton>
              <Snackbar
                open={openSnackbarMail}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbarMail(false)}
                message="Mail has been copied to clipboard!"
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              />
              <AntButton
                type="primary"
                icon={<FileUploadIcon />}
                href="mailto:openrcanon@gmail.com"
                style={{
                  backgroundColor: '#000000',
                  borderColor: '#000000'
                }}
              >
                Submit
              </AntButton>
            </Space>
          </Box>

          {/* 提交须知 */}
          <Paper sx={{ 
            mt: 2, 
            p: 3, 
            backgroundColor: '#fff8e1', 
            borderRadius: '12px',
            border: '1px solid #ffecb3',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600, 
                color: '#E65100',
                mb: 1.5
              }}
            >
              Submission Guidelines
            </Typography>
            <Typography variant="body2" sx={{ color: '#424242', mb: 1.5, lineHeight: 1.6 }}>
            If you want to have your results included, please include the following in your email:
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 1,
              pl: 2,
              '& .MuiTypography-root': {
                position: 'relative',
                pl: 2.5,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '0.5em',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#E65100'
                }
              }
            }}>
              <Typography variant="body2" sx={{ color: '#424242' }}>
                Name of your method
              </Typography>
              <Typography variant="body2" sx={{ color: '#424242' }}>
                Inference results in valid format (see <a href="https://github.com/microsoft/OpenRCA?tab=readme-ov-file#%EF%B8%8F-evaluation" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline' }}>GitHub repository</a>)
              </Typography>
              <Typography variant="body2" sx={{ color: '#424242' }}>
                Accuracy of your method tested in your own environment
              </Typography>
              <Typography variant="body2" sx={{ color: '#424242' }}>
                (Optional) Link to your repository
              </Typography>
              <Typography variant="body2" sx={{ color: '#424242' }}>
                (Optional) Execution trajectory of your method
              </Typography>
              <Typography variant="body2" sx={{ color: '#424242' }}>
                (Optional) Reproduction guidelines of your method
              </Typography>
              <Typography variant="body2" sx={{ color: '#424242' }}>
                (Optional) Docker image of your method and environment
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#666', mt: 1.5, fontStyle: 'italic' }}>
              Note: Inclusion in the leaderboard will be attempted on a best-effort basis. We cannot guarantee the timely processing of requests.
            </Typography>
          </Paper>

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
              Identify the root cause of the failure!
            </Typography>
            {/* 加上图片 */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <img src={`${prefix}/overview.png`} alt="OpenRCA Task" style={{ maxWidth: '100%', height: 'auto' }} />
            </Box>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#424242',
                mb: 4,
                lineHeight: 1.8,
                textAlign: 'left'
              }}
            >
              Each OpenRCA task is based on a real-world failure case from a software system and its associated telemetry data. Given the failure case and its associated telemetry, the task is to identify the root cause of the failure, requiring comprehension of software dependencies and reasoning over heterogeneous, long-context telemetry data.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'center' }}>
              <Space size="middle">
                <AntButton
                  type="primary"
                  icon={<DescriptionIcon />}
                  href="https://iclr.cc/virtual/2025/poster/32093"
                  style={{ backgroundColor: '#1565C0', borderColor: '#1565C0' }}
                >
                  Paper
                </AntButton>
                <AntButton
                  type="default"
                  icon={<GitHubIcon />}
                  href="https://github.com/microsoft/OpenRCA"
                  style={{ backgroundColor: '#2c3e50', color: '#ffffff', borderColor: '#2c3e50' }}
                >
                  Code
                </AntButton>
              </Space>
            </Box>

            <Typography 
              variant="body2" 
              sx={{ 
                color: '#666',
                mb: 2,
                textAlign: 'center'
              }}
            >
              If you have any remaining questions, please feel free to contact us at <a href="mailto:openrcanon@gmail.com">openrcanon@gmail.com</a>
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
              Citing our works
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#424242',
                mb: 2
              }}
            >
              If you are interested in our works, please cite:
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
&#125;,
<br></br>
<span className="bibtex">@article</span>&#123;<span className="identifier">fang2025rethinking</span>,
<br></br>
<span>  </span>
  <span className="field">title</span>=&#123;<span className="value">Rethinking the Evaluation of Microservice RCA with a Fault Propagation-Aware Benchmark</span>&#125;,
  <br></br>
  <span>  </span>
  <span className="field">author</span>=&#123;<span className="value">Fang, Aoyang and Zhang, Songhan and Yang, Yifan and Wu, Haotong and Xu, Junjielong and Wang, Xuyang and</span>
  <br></br>
  <span>           </span>
  <span className="value">Wang, Rui and Wang, Manyi and Lu, Qisheng and He, Pinjia</span>&#125;,
  <br></br>
  <span>  </span>
  <span className="field">journal</span>=&#123;<span className="value">arXiv preprint arXiv:2510.04711</span>&#125;,
  <br></br>
  <span>  </span>
  <span className="field">year</span>=&#123;<span className="value">2025</span>&#125;
  <br></br>
&#125;</pre>
            </Paper>
            <Snackbar
              open={openSnackbarCite}
              autoHideDuration={2000}
              onClose={() => setOpenSnackbarCite(false)}
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
