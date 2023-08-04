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

import { AccountDetails } from 'src/sections/bank-account/account-details';
import { AccountsTable } from 'src/sections/bank-account/accounts-table';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/solid';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import { BankAccountForm } from 'src/sections/bank-account/bank-account-form';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { SCREENS } from 'src/layouts/dashboard/config';
import { accountApi } from 'src/services/account-api';
import { toast } from 'react-hot-toast';
import { usePermission } from 'src/hooks/use-permission';

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const key = ['accounts', { page, rowsPerPage }];

  const { data } = useQuery({
    queryKey: key,
    queryFn: () => {
      return accountApi.getAll({ page, limit: rowsPerPage });
    },
  });

  const items = data?.data?.items || [];

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const [selected, setSelected] = useState(null);
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => {
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const [openDetails, setOpenDetails] = useState(false);
  const handleOpenDetails = () => {
    setOpenDetails(true);
  };
  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  // create a new product
  const { mutateAsync: create } = useMutation({
    mutationFn: accountApi.create,
    onSuccess: (data) => {
      setOpen(false);
      queryClient.invalidateQueries(key);
      toast.success('Create product successfully', {
        position: 'center',
      });
    },
  });

  // update a product

  const { mutateAsync: update } = useMutation({
    mutationFn: accountApi.update,
    onSuccess: (data) => {
      setOpenEdit(false);
      queryClient.invalidateQueries(key);
      toast.success('Update product successfully', {
        position: 'center',
      });
    },
  });

  // delete a product

  const { mutateAsync: deleteItem } = useMutation({
    mutationFn: accountApi.delete,
    onSuccess: (data) => {
      setOpen(false);
      queryClient.invalidateQueries(key);
      toast.success('Delete product successfully', {
        position: 'top-center',
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        position: 'top-center',
      });
    },
  });
  const isHas = usePermission(SCREENS.ACCOUNTS);
  if (!isHas) {
    return null;
  }
  return (
    <>
      <Head>
        <title>Accounts | {process.env.NEXT_PUBLIC_APP_NAME}</title>
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
                <Typography variant="h4">Accounts</Typography>
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
              <div>
                <Button
                  onClick={handleOpen}
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            <CustomersSearch />
            <AccountsTable
              count={data?.data?.total || 0}
              items={items}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              onDelete={deleteItem}
              onEdit={(item) => {
                setSelected(item);
                handleOpenEdit();
              }}
              onShowDetails={(item) => {
                setSelected(item);
                handleOpenDetails();
              }}
            />
          </Stack>
        </Container>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box>
          <BankAccountForm onSubmit={create} />
        </Box>
      </Modal>
      <Modal open={openEdit} onClose={handleCloseEdit}>
        <Box>
          <BankAccountForm type="EDIT" item={selected} onSubmit={update} />
        </Box>
      </Modal>
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

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
