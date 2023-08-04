import * as Yup from 'yup';

import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  TextField,
  Typography,
} from '@mui/material';

import Head from 'next/head';
import { Layout } from 'src/layouts/client/layout';
import { LoadingButton } from '@mui/lab';
import { accountApi } from 'src/services/account-api';
import { useFormik } from 'formik';
import { useMutation } from '@tanstack/react-query';

const Page = () => {
  const { mutateAsync, isLoading, isSuccess } = useMutation({
    mutationFn: accountApi.activate,
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
      newPin: Yup.string()
        .required('Required')
        .min(6, 'Invalid PIN')
        .max(6, 'Invalid PIN'),
      confirmPin: Yup.string()
        .required('Required')
        .oneOf([Yup.ref('newPin'), null], 'PIN must match'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await mutateAsync(values);
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Activation | {process.env.NEXT_PUBLIC_APP_NAME}</title>
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
            justifyContent: 'center',
            alignItems: 'center',
          }}
          maxWidth="xl"
        >
          <form autoComplete="off" onSubmit={formik.handleSubmit}>
            <Card
              sx={{
                width: 360,
              }}
            >
              <CardHeader title="Activate your account"></CardHeader>

              <CardContent
                sx={{
                  pt: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                {formik.errors.submit && (
                  <Typography color="error" variant="body2">
                    {formik.errors.submit}
                  </Typography>
                )}
                <TextField
                  fullWidth
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
                  error={!!(formik.touched.pin && formik.errors.pin)}
                  helperText={formik.touched.pin && formik.errors.pin}
                  label="PIN"
                  name="pin"
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.pin}
                />
                <TextField
                  fullWidth
                  error={!!(formik.touched.newPin && formik.errors.newPin)}
                  helperText={formik.touched.newPin && formik.errors.newPin}
                  label="New PIN"
                  name="newPin"
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.newPin}
                />

                <TextField
                  fullWidth
                  error={
                    !!(formik.touched.confirmPin && formik.errors.confirmPin)
                  }
                  helperText={
                    formik.touched.confirmPin && formik.errors.confirmPin
                  }
                  label="Confirm PIN"
                  name="confirmPin"
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.confirmPin}
                />
              </CardContent>
              <CardActions>
                <LoadingButton
                  loading={isLoading}
                  fullWidth
                  type="submit"
                  variant="contained"
                  color={
                    isSuccess
                      ? 'success'
                      : formik.isSubmitting
                      ? 'info'
                      : 'primary'
                  }
                >
                  {isSuccess ? 'Activated success' : 'Activate'}
                </LoadingButton>
              </CardActions>
            </Card>
          </form>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <Layout>{page}</Layout>;

export default Page;
