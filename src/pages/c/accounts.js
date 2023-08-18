import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Modal,
  Stack,
  Typography,
} from '@mui/material';

import { AccountDetails } from 'src/sections/bank-account/account-details';
import Head from 'next/head';
import { Layout } from 'src/layouts/client/layout';
import { SeverityPill } from 'src/components/severity-pill';
import { accountApi } from 'src/services/account-api';
import { useCustomer } from 'src/hooks/use-customer';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const Page = () => {
  const { user } = useCustomer(true);
  const key = [
    'accounts-customer',
    { page: 0, limit: 1000, customerId: user?.id },
  ];

  const { data } = useQuery({
    queryKey: key,
    queryFn: () =>
      accountApi.getAll({
        page: 0,
        limit: 1000,
        customerId: user?.id,
      }),
  });
  const items = data?.data.items || [];
  const [openDetails, setOpenDetails] = useState(false);
  const handleOpenDetails = () => {
    setOpenDetails(true);
  };
  const handleCloseDetails = () => {
    setOpenDetails(false);
  };
  const [selected, setSelected] = useState(null);
  if (!user) return null;

  return (
    <>
      <Head>
        <title>Accounts | {process.env.NEXT_PUBLIC_APP_NAME}</title>
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
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
          maxWidth="xl"
        >
          <Typography variant="h4" component="h1">
            Accounts
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              width: '100%',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {items.map((account) => (
              <div
                key={account.id}
                onClick={() => {
                  handleOpenDetails();
                  setSelected(account);
                }}
              >
                <AccountCard key={account.id} account={account} />
              </div>
            ))}
          </Box>
        </Container>
      </Box>
      <Modal open={openDetails} onClose={handleCloseDetails}>
        <Box>
          <AccountDetails
            queryKey={key}
            item={selected}
            onClose={handleCloseDetails}
          />
        </Box>
      </Modal>
    </>
  );
};

Page.getLayout = (page) => <Layout>{page}</Layout>;
const typeMap = {
  0: {
    color: 'info',
    text: 'Checking',
  },
  1: {
    color: 'primary',
    text: 'Deposit',
  },
};

const statusMap = {
  0: {
    color: 'warning',
    text: 'Inactive',
  },
  1: {
    color: 'success',
    text: 'Active',
  },

  2: {
    color: 'primary',
    text: 'Maturity',
  },

  3: {
    color: 'error',
    text: 'Closed',
  },
};

const AccountCard = ({ account }) => {
  return (
    <Card
      sx={{
        width: 360,
      }}
    >
      <CardHeader title={account.number} />
      <CardContent
        sx={{
          pt: 1,
        }}
      >
        <Stack gap={1}>
          <Box display={'flex'} justifyContent="space-between">
            <Typography variant="body1" component="p">
              Balance
            </Typography>
            <Typography color="green">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(account.balance)}
            </Typography>
          </Box>
          <Box display={'flex'} justifyContent="space-between">
            <Typography variant="body1" component="p">
              Type{' '}
            </Typography>
            <SeverityPill color={typeMap[account.type].color}>
              {typeMap[account.type].text}
            </SeverityPill>
          </Box>
          <Box display={'flex'} justifyContent="space-between">
            <Typography variant="body1" component="p">
              Status{' '}
            </Typography>
            <SeverityPill color={statusMap[account.status].color}>
              {statusMap[account.status].text}
            </SeverityPill>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Page;
