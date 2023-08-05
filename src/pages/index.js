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
import { usePermission } from 'src/hooks/use-permission';

const Page = () => {
  const { isHas } = usePermission(SCREENS.OVERVIEW) || {};
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
              <OverviewSales
                chartSeries={[
                  {
                    name: 'This year',
                    data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
                  },
                  {
                    name: 'Last year',
                    data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13],
                  },
                ]}
                sx={{ height: '100%' }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
