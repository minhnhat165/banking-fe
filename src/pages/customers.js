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
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/solid';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import CustomerAccounts from 'src/sections/customer/customer-accounts';
import { CustomerForm } from 'src/sections/customer/customer-form';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { CustomersTable } from 'src/sections/customer/customers-table';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { SCREENS } from 'src/layouts/dashboard/config';
import { customerApi } from 'src/services/customer-api';
import { toast } from 'react-hot-toast';
import { usePermission } from 'src/hooks/use-permission';

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const key = ['customers', { page, rowsPerPage }];

  const { data } = useQuery({
    queryKey: key,
    queryFn: () => {
      return customerApi.getAll({ page, limit: rowsPerPage });
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

  const [openAccount, setOpenAccount] = useState(false);
  const handleOpenAccount = () => {
    setOpenAccount(true);
  };
  const handleCloseAccount = () => {
    setOpenAccount(false);
  };

  // create a new product
  const { mutateAsync: create } = useMutation({
    mutationFn: customerApi.create,
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
    mutationFn: customerApi.update,
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
    mutationFn: customerApi.delete,
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

  const { isHas, isAll, isCreate, isDelete, isUpdate } = usePermission(
    SCREENS.CUSTOMERS,
  );

  if (!isHas) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Customers | {process.env.NEXT_PUBLIC_APP_NAME}</title>
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
                <Typography variant="h4">Customers</Typography>
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
              {(isAll || isCreate) && (
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
              )}
            </Stack>
            <CustomersSearch />
            <CustomersTable
              allowEdit={isAll || isUpdate}
              allowDelete={isAll || isDelete}
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
              onShowAccount={(item) => {
                setSelected(item);
                handleOpenAccount();
              }}
            />
          </Stack>
        </Container>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box>
          <CustomerForm
            item={{
              name: '',
              description: '',
            }}
            onSubmit={create}
          />
        </Box>
      </Modal>
      <Modal open={openEdit} onClose={handleCloseEdit}>
        <Box>
          <CustomerForm type="EDIT" item={selected} onSubmit={update} />
        </Box>
      </Modal>
      <Modal open={openAccount} onClose={handleCloseAccount}>
        <Box>
          <CustomerAccounts customerId={selected?._id} />
        </Box>
      </Modal>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
