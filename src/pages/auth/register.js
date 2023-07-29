import * as Yup from 'yup';

import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';

import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import Head from 'next/head';
import { LoadingButton } from '@mui/lab';
import NextLink from 'next/link';
import { authApi } from 'src/services/authApi';
import { toast } from 'react-hot-toast';
import { useFormik } from 'formik';
import { useState } from 'react';

const Page = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      firstName: Yup.string().max(255).required('First name is required'),
      lastName: Yup.string().max(255).required('Last name is required'),
      password: Yup.string().max(255).required('Password is required'),
      confirmPassword: Yup.string().oneOf(
        [Yup.ref('password'), null],
        'Passwords must match',
      ),
    }),
    onSubmit: async (values, helpers) => {
      try {
        setIsLoading(true);
        await authApi.register({
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password,
        });
        toast.success('Account created', {
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
        <title>Register | {process.env.NEXT_PUBLIC_APP_NAME}</title>
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
              <Typography variant="h4">Register</Typography>
              <Typography color="text.secondary" variant="body2">
                Already have an account? &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/login"
                  underline="hover"
                  variant="subtitle2"
                >
                  Log in
                </Link>
              </Typography>
            </Stack>

            {isSuccess ? (
              <Stack spacing={3}>
                <Typography color="success" variant="h5">
                  Account created successfully. Please check your email for
                  verification.
                </Typography>
                <NextLink href="https://mail.google.com/mail/u/0/#inbox">
                  <Button
                    fullWidth
                    size="large"
                    type="button"
                    variant="contained"
                  >
                    Open Email
                  </Button>
                </NextLink>
              </Stack>
            ) : (
              <form noValidate onSubmit={formik.handleSubmit}>
                <Stack spacing={3}>
                  <Stack spacing={3} direction={{ xs: 'column', sm: 'row' }}>
                    <TextField
                      error={
                        !!(formik.touched.firstName && formik.errors.firstName)
                      }
                      fullWidth
                      helperText={
                        formik.touched.firstName && formik.errors.firstName
                      }
                      label="First Name"
                      name="firstName"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.firstName}
                    />
                    <TextField
                      error={
                        !!(formik.touched.lastName && formik.errors.lastName)
                      }
                      fullWidth
                      helperText={
                        formik.touched.lastName && formik.errors.lastName
                      }
                      label="Last Name"
                      name="lastName"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.lastName}
                    />
                  </Stack>

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
                  <TextField
                    error={
                      !!(formik.touched.password && formik.errors.password)
                    }
                    fullWidth
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
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

                <LoadingButton
                  loading={isLoading}
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                >
                  Continue
                </LoadingButton>
              </form>
            )}
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
