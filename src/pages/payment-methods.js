import { Box, Container, Modal, Stack, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import Head from 'next/head';
import { PaymentMethodForm } from 'src/sections/payment-method/payment-method-form';
import { PaymentMethodsTable } from 'src/sections/payment-method/payment-methods-table';
import { SCREENS } from 'src/layouts/dashboard/config';
import { paymentMethodApi } from 'src/services/payment-method-api';
import { toast } from 'react-hot-toast';
import { usePermission } from 'src/hooks/use-permission';

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const key = ['payments', { page, rowsPerPage }];

  const { data } = useQuery({
    queryKey: key,
    queryFn: () => {
      return paymentMethodApi.getAll({ page, limit: rowsPerPage });
    },
  });

  const items = data?.data?.items || [];

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState(null);
  const { mutateAsync: update } = useMutation({
    mutationFn: paymentMethodApi.update,
    onSuccess: (data) => {
      setOpen(false);
      queryClient.invalidateQueries(key);
      toast.success('Update product successfully', {
        position: 'center-top',
      });
    },
  });

  const isHas = usePermission(SCREENS.PAYMENT_METHODS);
  if (!isHas) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Payment Method | {process.env.NEXT_PUBLIC_APP_NAME}</title>
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
                <Typography variant="h4">Payment Method</Typography>
              </Stack>
            </Stack>
            <PaymentMethodsTable
              count={data?.data?.total || 0}
              items={items}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              onEdit={(item) => {
                setSelectedItem(item);
                handleOpen();
              }}
              rowsPerPage={rowsPerPage}
            />
          </Stack>
        </Container>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box>
          <PaymentMethodForm
            onSubmit={update}
            item={selectedItem}
            type="EDIT"
          />
        </Box>
      </Modal>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
