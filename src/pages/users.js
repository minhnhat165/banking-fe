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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/solid';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import Head from 'next/head';
import { PermissionForm } from 'src/sections/user/permission-form';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { SCREENS } from 'src/layouts/dashboard/config';
import { UserDetails } from 'src/sections/user/user-details';
import { UserForm } from 'src/sections/user/user-form';
import { UsersSearch } from 'src/sections/user/users-search';
import { UsersTable } from 'src/sections/user/users-table';
import { authApi } from 'src/services/auth-api';
import { toast } from 'react-hot-toast';
import { usePermission } from 'src/hooks/use-permission';
import { useSearchParams } from 'next/navigation';
import { userApi } from 'src/services/user-api';

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

  const key = ['users', { page, rowsPerPage, ...options }];

  const { data } = useQuery({
    queryKey: key,
    queryFn: () => {
      return userApi.getAll({ page, limit: rowsPerPage, ...options });
    },
  });

  const users = data?.data?.items || [];

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

  const [openPermission, setOpenPermission] = useState(false);
  const handleOpenPermission = () => {
    setOpenPermission(true);
  };
  const handleClosePermission = () => {
    setOpenPermission(false);
  };

  // create a new product
  const { mutateAsync: create } = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setOpen(false);
      queryClient.invalidateQueries(key);
      toast.success('Create user successfully', {
        position: 'center',
      });
    },
  });

  // update a product

  const { mutateAsync: update } = useMutation({
    mutationFn: userApi.update,
    onSuccess: (data) => {
      setOpenEdit(false);
      queryClient.invalidateQueries(key);
      toast.success('Update user successfully', {
        position: 'center',
      });
    },
  });

  // delete a product

  const { mutateAsync: deleteItem } = useMutation({
    mutationFn: userApi.delete,
    onSuccess: (data) => {
      setOpen(false);
      queryClient.invalidateQueries(key);
      toast.success('Delete user successfully', {
        position: 'top-center',
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        position: 'top-center',
      });
    },
  });

  // lock a user

  const { mutateAsync: lock } = useMutation({
    mutationFn: userApi.lock,
    onSuccess: (data) => {
      queryClient.invalidateQueries(key);
      toast.success('Lock user successfully', {
        position: 'top-center',
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        position: 'top-center',
      });
    },
  });

  // unlock a user

  const { mutateAsync: unlock } = useMutation({
    mutationFn: userApi.unlock,
    onSuccess: (data) => {
      queryClient.invalidateQueries(key);
      toast.success('Unlock user successfully', {
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
    SCREENS.USERS,
  );
  if (!isHas) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Users | {process.env.NEXT_PUBLIC_APP_NAME}</title>
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
                <Typography variant="h4">Users</Typography>
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
            <UsersSearch />
            <UsersTable
              allowEdit={isAll || isUpdate}
              allowDelete={isAll || isDelete}
              count={data?.data?.total || 0}
              items={users}
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
              onPermission={(item) => {
                setSelected(item);
                handleOpenPermission();
              }}
              onLock={lock}
              onUnlock={unlock}
            />
          </Stack>
        </Container>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box>
          <UserForm
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
          <UserForm type="EDIT" item={selected} onSubmit={update} />
        </Box>
      </Modal>
      <Modal open={openPermission} onClose={handleClosePermission}>
        <Box>
          <PermissionForm userId={selected?.id} />
        </Box>
      </Modal>
      <Modal open={openDetails} onClose={handleCloseDetails}>
        <Box>
          <UserDetails item={selected} />
        </Box>
      </Modal>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
