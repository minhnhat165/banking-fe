import * as Yup from 'yup';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  TextField,
  Typography,
} from '@mui/material';

import { AccountDetails } from 'src/sections/bank-account/account-details';
import Head from 'next/head';
import { Layout } from 'src/layouts/client/layout';
import { LoadingButton } from '@mui/lab';
import { accountApi } from 'src/services/account-api';
import { useFormik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

const Page = () => {
  const [currentAccount, setCurrentAccount] = useState(null);

  const { mutateAsync, isLoading, data } = useMutation({
    mutationFn: accountApi.findByNumberClient,
  });

  const formik = useFormik({
    initialValues: {
      number: '',
      pin: '',
      newPin: '',
      confirmPin: '',
    },
    validationSchema: Yup.object({
      number: Yup.string()
        .required('Required')
        .min(16, 'Invalid account number')
        .max(16, 'Invalid account number'),
      pin: Yup.string()
        .required('Required')
        .min(6, 'Invalid PIN')
        .max(6, 'Invalid PIN'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await mutateAsync(values);
        setCurrentAccount(values);
      } catch (err) {
        setCurrentAccount(null);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Account info | {process.env.NEXT_PUBLIC_APP_NAME}</title>
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
          <form autoComplete="off" onSubmit={formik.handleSubmit}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    width: 580,
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    error={!!(formik.touched.number && formik.errors.number)}
                    helperText={formik.touched.number && formik.errors.number}
                    label="Account number"
                    name="number"
                    type="number"
                    onChange={formik.handleChange}
                    value={formik.values.number}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    error={!!(formik.touched.pin && formik.errors.pin)}
                    helperText={formik.touched.pin && formik.errors.pin}
                    label="PIN"
                    name="pin"
                    type="password"
                    onChange={formik.handleChange}
                    value={formik.values.pin}
                  />
                  <LoadingButton
                    loading={isLoading}
                    type="submit"
                    variant="contained"
                    sx={{
                      minWidth: 100,
                    }}
                  >
                    Find
                  </LoadingButton>
                </Box>
                {formik.errors.submit && (
                  <Typography color="error" variant="body2">
                    {formik.errors.submit}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </form>
          {data?.data && (
            <AccountDetails
              onSettle={() => {
                mutateAsync(currentAccount);
              }}
              item={{
                ...data.data,
                pin: currentAccount?.pin,
              }}
              style={{
                position: 'static',
                transform: 'none',
                height: 'auto',
              }}
            />
          )}
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <Layout>{page}</Layout>;

export default Page;
