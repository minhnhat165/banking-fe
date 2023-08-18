import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import {
  CheckBadgeIcon,
  CreditCardIcon,
  MagnifyingGlassIcon,
  ReceiptPercentIcon,
  UserIcon,
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
          height: '100%',
          background: 'transparent',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 800,
        }}
      >
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} lg={6}>
            <OverviewPanel
              href="c/banking-register"
              title="Register"
              subtitle="Banking account"
              icon={<CreditCardIcon />}
              sx={{ height: '100%', cursor: 'pointer' }}
            />
          </Grid>
          <Grid xs={12} sm={6} lg={6}>
            <OverviewPanel
              href="c/interest-rate"
              title="Interest Rate"
              subtitle="Rate"
              icon={<ReceiptPercentIcon />}
              sx={{ height: '100%', cursor: 'pointer' }}
              color="primary.main"
            />
          </Grid>
          <Grid xs={12} sm={6} lg={6}>
            <OverviewPanel
              href="c/banking-activate"
              title="Settings"
              subtitle="Profile"
              icon={<UserIcon />}
              sx={{ height: '100%', cursor: 'pointer' }}
              color="info.main"
            />
          </Grid>
          <Grid xs={12} sm={6} lg={6}>
            <OverviewPanel
              title="Accounts management"
              href="c/accounts"
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
