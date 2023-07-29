import * as Yup from 'yup';

import { Box, Button, Stack, TextField, Typography } from '@mui/material';

import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import Head from 'next/head';
import Link from 'next/link';
import { LoadingButton } from '@mui/lab';
import { authApi } from 'src/services/authApi';
import { toast } from 'react-hot-toast';
import { useFormik } from 'formik';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

const Page = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const params = useSearchParams();
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
      submit: null,
    },
    validationSchema: Yup.object({
      password: Yup.string().max(255).required('Password is required'),
      confirmPassword: Yup.string()
        .max(255)
        .required('Confirm Password is required')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        setIsLoading(true);
        await authApi.resetPassword({
          token: params.get('token'),
          password: values.password,
        });
        toast.success('Password has been reset', {
          position: 'top-left',
        });
        setIsSuccess(true);
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
      setIsLoading(false);
    },
  });

  return (
    <>
      <Head>
        <title>Reset Password | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <Box
        sx={{
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%',
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Reset Password</Typography>
              <Typography color="text.secondary" variant="body2">
                Enter your new password below
              </Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
                <TextField
                  error={
                    !!(
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                    )
                  }
                  fullWidth
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  label="Confirm Password"
                  name="confirmPassword"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.confirmPassword}
                />
              </Stack>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              {isSuccess ? (
                <Link href="/auth/login">
                  <Button
                    fullWidth
                    size="large"
                    sx={{ mt: 3 }}
                    type="button"
                    variant="contained"
                  >
                    Login
                  </Button>
                </Link>
              ) : (
                <LoadingButton
                  fullWidth
                  loading={isLoading}
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                >
                  Reset Password
                </LoadingButton>
              )}
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
