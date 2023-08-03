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
import { ProductsForm } from 'src/sections/product/products-form';
import { ProductsTable } from 'src/sections/product/products-table';
import { productApi } from 'src/services/product-api';
import { toast } from 'react-hot-toast';

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const queryClient = useQueryClient();

  const key = ['products', { page, rowsPerPage }];

  const { data } = useQuery({
    queryKey: key,
    queryFn: () => {
      return productApi.getAll({ page, limit: rowsPerPage });
    },
  });

  const products = data?.data?.items || [];

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

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => {
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const [selected, setSelected] = useState(null);

  // create a new product
  const { mutateAsync: create } = useMutation({
    mutationFn: productApi.create,
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
    mutationFn: productApi.update,
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
    mutationFn: productApi.delete,
    onSuccess: (data) => {
      setOpen(false);
      queryClient.invalidateQueries(key);
      toast.success('Delete product successfully', {
        position: 'top-center',
      });
    },
    onError: (error) => {
      toast.error('Delete product failed', {
        position: 'top-center',
      });
    },
  });

  return (
    <>
      <Head>
        <title>Product | {process.env.NEXT_PUBLIC_APP_NAME}</title>
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
                <Typography variant="h4">Product</Typography>
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
            <ProductsTable
              onDelete={deleteItem}
              count={data?.data?.total || 0}
              items={products}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              onEdit={(item) => {
                setSelected(item);
                handleOpenEdit();
              }}
            />
          </Stack>
        </Container>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box>
          <ProductsForm onSubmit={create} />
        </Box>
      </Modal>
      <Modal open={openEdit} onClose={handleCloseEdit}>
        <Box>
          <ProductsForm type="EDIT" item={selected} onSubmit={update} />
        </Box>
      </Modal>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
