import {
  Box,
  Button,
  Container,
  Modal,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/solid';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import Head from 'next/head';
import { SCREENS } from 'src/layouts/dashboard/config';
import { TransactionDetails } from 'src/sections/transaction/transaction-details';
import { TransactionsSearch } from 'src/sections/transaction/transactions-search';
import { TransactionsTable } from 'src/sections/transaction/transactions-table';
import { transactionApi } from 'src/services/transaction-api';
import { usePermission } from 'src/hooks/use-permission';
import { useSearchParams } from 'next/navigation';

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const params = useSearchParams();
  const options = useMemo(() => {
    const result = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }, [params]);

  const key = ['transactions', { page, rowsPerPage, ...options }];
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['transactions', { page, rowsPerPage, ...options }],
    queryFn: () => {
      return transactionApi.getAll({ page, limit: rowsPerPage, ...options });
    },
  });

  const items = data?.data?.items || [];

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);
  const [openDetails, setOpenDetails] = useState(false);
  const handleOpenDetails = () => {
    setOpenDetails(true);
  };
  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  const [selected, setSelected] = useState(null);

  const { isHas } = usePermission(SCREENS.TRANSACTIONS);
  if (!isHas) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Transactions | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Transactions</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Export
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => {
                      queryClient.invalidateQueries(key);
                    }}
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowPathRoundedSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Refresh
                  </Button>
                </Stack>
              </Stack>
            </Stack>
            <TransactionsSearch />
            <TransactionsTable
              count={data?.data?.total || 0}
              items={items}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              onShowDetails={(item) => {
                setSelected(item);
                handleOpenDetails();
              }}
            />
          </Stack>
        </Container>
      </Box>
      <Modal open={openDetails} onClose={handleCloseDetails}>
        <Box>
          <TransactionDetails item={selected} />
        </Box>
      </Modal>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
