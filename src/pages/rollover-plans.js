import {
  Box,
  Button,
  Container,
  Modal,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { RolloverPlanForm } from 'src/sections/rollover-plan/rollover-plan-form';
import { RolloverPlansTable } from 'src/sections/rollover-plan/rollover-plans-table';
import { SCREENS } from 'src/layouts/dashboard/config';
import { paymentMethodApi } from 'src/services/payment-method-api';
import { rolloverPlanApi } from 'src/services/rollover-plan-api';
import { toast } from 'react-hot-toast';
import { usePermission } from 'src/hooks/use-permission';

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const key = ['rollovers', { page, rowsPerPage }];

  const { data } = useQuery({
    queryKey: key,
    queryFn: () => {
      return rolloverPlanApi.getAll({ page, limit: rowsPerPage });
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
    mutationFn: rolloverPlanApi.update,
    onSuccess: (data) => {
      setOpen(false);
      queryClient.invalidateQueries(key);
      toast.success('Update product successfully', {
        position: 'center-top',
      });
    },
  });

  const isHas = usePermission(SCREENS.ROLLOVER_PLANS);
  if (!isHas) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Rollover Plan | {process.env.NEXT_PUBLIC_APP_NAME}</title>
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
                <Typography variant="h4">Rollover Plan</Typography>
              </Stack>
            </Stack>
            <RolloverPlansTable
              count={data?.data?.total || 0}
              items={items}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              onEdit={(item) => {
                setSelectedItem(item);
                handleOpen();
              }}
            />
          </Stack>
        </Container>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box>
          <RolloverPlanForm onSubmit={update} item={selectedItem} type="EDIT" />
        </Box>
      </Modal>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
