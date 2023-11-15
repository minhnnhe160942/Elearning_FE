import { Box, Button, IconButton, Typography, useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import { mockTransactions } from '../../../data/mockData';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TrafficIcon from '@mui/icons-material/Traffic';
import Header from '../../../components/Admin/Header/Header';
import LineChart from '../../../components/Admin/LineChart';
import StatBox from '../../../components/Admin/StatBox';
import { useEffect, useState } from 'react';
import authApi from '../../../api/authApi';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Charts from './Charts/Charts';
import { BarChart } from '@mui/icons-material';

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [totalUser, setTotalUser] = useState('');
  const [totalCoure, setTotalCourse] = useState('');
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('2023');
  const [transaction, setTranscation] = useState([]);
  useEffect(() => {
    authApi.getAllPayment().then((response) => {
      const paymentArray = response.data.listPayment;
      setPayments(paymentArray);
      setFilteredPayments(paymentArray);
    });
  }, []);

  useEffect(() => {
    authApi.totalCourse().then((response) => {
      setTotalCourse(response.data);
    });
  }, []);

  useEffect(() => {
    authApi
      .getPaymentByMonthYear({ month, year })
      .then((resp) => {
        setTranscation(resp.data.revenueForMonth);
      })
      .catch((err) => {});
  }, []);

  const recentTransactions = payments.slice(0, 5);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box m="20px">
          {/* HEADER */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

            <Box></Box>
          </Box>

          {/* GRID & CHARTS */}
          <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">
            {/* ROW 1 */}
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={totalUser}
                subtitle="Total User"
                progress="0.75"
                increase="+14%"
                icon={<PersonAddIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
              />
            </Box>

            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={totalCoure.totalCourse}
                subtitle="Total Course"
                progress="0.80"
                increase="+43%"
                icon={<TrafficIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
              />
            </Box>

            {/* ROW 2 */}
            <Box gridColumn="span 8" gridRow="span 2" backgroundColor={colors.primary[400]}>
              <Box mt="25px" p="0 30px" display="flex " justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                    Revenue Generated
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
                    $5900
                  </Typography>
                </Box>
              </Box>
              <Box height="250px" m="-20px 0 0 0">
                {/* <LineChart isDashboard={true} /> */}
                <Charts list={transaction} />
              </Box>
            </Box>

            <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.primary[400]} overflow="auto">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                colors={colors.grey[100]}
                p="15px"
              >
                <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                  Recent Transactions
                </Typography>
              </Box>
              {recentTransactions.map((transaction, i) => (
                <Box
                  key={`${transaction.txId}-${i}`}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom={`4px solid ${colors.primary[500]}`}
                  p="15px"
                >
                  <Box>
                    <Typography color={colors.grey[100]}> {transaction.courseName}</Typography>
                  </Box>
                  <Box color={colors.grey[100]}>{transaction.createdAt}</Box>
                  <Box backgroundColor={colors.greenAccent[500]} p="5px 10px" borderRadius="4px">
                    ${transaction.amount}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Dashboard;
