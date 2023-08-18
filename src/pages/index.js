import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import Head from 'next/head';
import { OverviewBudget } from 'src/sections/overview/overview-budget';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import { OverviewTasksProgress } from 'src/sections/overview/overview-tasks-progress';
import { OverviewTotalAccounts } from 'src/sections/overview/overview-total-accounts';
import { OverviewTotalCustomers } from 'src/sections/overview/overview-total-customers';
import { OverviewTotalProfit } from 'src/sections/overview/overview-total-profit';
import { OverviewTotalTransactions } from 'src/sections/overview/overview-total-transactions';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';
import { OverviewUser } from 'src/sections/overview/overview-user';
import { SCREENS } from 'src/layouts/dashboard/config';
import { TRANSACTION } from 'src/constant/transaction';
import { transactionApi } from 'src/services/transaction-api';
import { useMemo } from 'react';
import { usePermission } from 'src/hooks/use-permission';
import { useQuery } from '@tanstack/react-query';

const Page = () => {
  const { isHas } = usePermission(SCREENS.OVERVIEW) || {};
  const { data } = useQuery({
    queryKey: ['overview', 'budget'],
    queryFn: () =>
      transactionApi.getAll({
        page: 0,
        limit: 999999999999,
        type: TRANSACTION.TYPE.DEPOSIT,
      }),
  });

  const dataCharts = useMemo(() => {
    if (!data?.data?.items) {
      return [];
    }
    const result = [];
    const years =
      data?.data?.items?.map((item) => {
        return new Date(item.transactionDate).getFullYear();
      }) || [];
    const yearsUnique = [...new Set(years)];
    yearsUnique.forEach((year) => {
      const monthsValue = [];
      for (let i = 0; i < 12; i++) {
        monthsValue.push(0);
      }
      data?.data?.items?.forEach((item) => {
        const month = new Date(item.transactionDate).getMonth();
        if (new Date(item.transactionDate).getFullYear() === year) {
          monthsValue[month] += item.amount / 1000;
        }
      });
      result.push({
        name: year,
        data: monthsValue,
      });
    });
    return result;
  }, [data]);

  if (!isHas) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Overview | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewUser
                difference={12}
                positive
                sx={{ height: '100%' }}
                value="$24k"
              />
            </Grid>

            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalCustomers
                difference={16}
                positive={false}
                sx={{ height: '100%' }}
                value="1.6k"
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalAccounts
                difference={16}
                positive={false}
                sx={{ height: '100%' }}
                value="1.6k"
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalTransactions
                difference={16}
                positive={false}
                sx={{ height: '100%' }}
                value="1.6k"
              />
            </Grid>

            <Grid xs={12} lg={12}>
              <OverviewSales chartSeries={dataCharts} sx={{ height: '100%' }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
