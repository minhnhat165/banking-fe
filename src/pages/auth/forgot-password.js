import * as Yup from 'yup';

import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';

import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import Head from 'next/head';
import { LoadingButton } from '@mui/lab';
import { default as NextLink } from 'next/link';
import { authApi } from 'src/services/auth-api';
import { toast } from 'react-hot-toast';
import { useFormik } from 'formik';
import { useState } from 'react';

const Page = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: '',
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        setIsLoading(true);
        await authApi.forgotPassword({ email: values.email });
        toast.success('Email sent', {
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
        <title>Forgot | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.paper',
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
              <Typography variant="h4">Forgot Password</Typography>
              <Typography variant="body2">
                Enter your email address and we will send you instructions to
                reset your password.
              </Typography>
            </Stack>

            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
              </Stack>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}

              {isSuccess ? (
                <NextLink href="https://mail.google.com/mail/u/0/#inbox">
                  <Button
                    fullWidth
                    size="large"
                    sx={{ mt: 3 }}
                    type="button"
                    variant="contained"
                  >
                    Open Email
                  </Button>
                </NextLink>
              ) : (
                <LoadingButton
                  loading={isLoading}
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                >
                  Send Reset Link
                </LoadingButton>
              )}
              <Typography
                color="text.secondary"
                variant="body1"
                textAlign="center"
                sx={{ mt: 2 }}
              >
                Back to&nbsp;
                <Link
                  component={NextLink}
                  href="/auth/login"
                  underline="hover"
                  variant="subtitle2"
                >
                  Login
                </Link>
              </Typography>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
