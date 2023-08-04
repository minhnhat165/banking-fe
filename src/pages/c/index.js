import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import {
  CheckBadgeIcon,
  CreditCardIcon,
  MagnifyingGlassIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/solid';

import Head from 'next/head';
import { Layout } from 'src/layouts/client/layout';
import { OverviewPanel } from 'src/sections/overview/overview';

const Page = () => (
  <>
    <Head>
      <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 10,
        px: 10,
      }}
    >
      <Container
        sx={{
          background: 'transparent',
        }}
        maxWidth="xl"
      >
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} lg={3}>
            <OverviewPanel
              href="c/banking-register"
              title="Register"
              subtitle="Banking account"
              icon={<CreditCardIcon />}
              sx={{ height: '100%', cursor: 'pointer' }}
            />
          </Grid>
          <Grid xs={12} sm={6} lg={3}>
            <OverviewPanel
              href="c/interest-rate"
              title="Interest Rate"
              subtitle="Rate"
              icon={<ReceiptPercentIcon />}
              sx={{ height: '100%', cursor: 'pointer' }}
              color="primary.main"
            />
          </Grid>
          <Grid xs={12} sm={6} lg={3}>
            <OverviewPanel
              href="c/banking-activate"
              title="Active"
              subtitle="Banking account"
              icon={<CheckBadgeIcon />}
              sx={{ height: '100%', cursor: 'pointer' }}
              color="info.main"
            />
          </Grid>
          <Grid xs={12} sm={6} lg={3}>
            <OverviewPanel
              title="Access"
              href="c/banking-info"
              subtitle="Banking account"
              icon={<MagnifyingGlassIcon />}
              sx={{ height: '100%', cursor: 'pointer' }}
              color="info.main"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => <Layout>{page}</Layout>;

export default Page;
