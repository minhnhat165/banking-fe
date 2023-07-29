import { Box, Container, Unstable_Grid2 as Grid, Stack, Typography } from "@mui/material";

import { AccountProfile } from "src/sections/account/account-profile";
import { AccountProfileDetails } from "src/sections/account/account-profile-details";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Head from "next/head";

const Page = () => (
  <>
    <Head>
      <title>Profile | {process.env.NEXT_PUBLIC_APP_NAME}</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">Profile</Typography>
          </div>
          <div>
            <Grid container spacing={3}>
              <Grid xs={12} md={6} lg={4}>
                <AccountProfile />
              </Grid>
              <Grid xs={12} md={6} lg={8}>
                <AccountProfileDetails />
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
