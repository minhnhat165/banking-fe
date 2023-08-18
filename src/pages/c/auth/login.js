import * as Yup from 'yup';

import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';

import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import Head from 'next/head';
import NextLink from 'next/link';
import { customerApi } from 'src/services/customer-api';
import { useAuth } from 'src/hooks/use-auth';
import { useFormik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const { mutateAsync } = useMutation({
    mutationFn: customerApi.login,
    onSuccess: (data, variables) => {
      data.data.mPass = variables.mPass;
      localStorage.setItem('user', JSON.stringify(data.data));
      router.push('/c');
    },
  });
  const formik = useFormik({
    initialValues: {
      email: '',
      mPass: '',
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      mPass: Yup.string().max(255).required('mPass is required'),
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
        <title>Login | {process.env.NEXT_PUBLIC_APP_NAME}</title>
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
              <Typography variant="h4">Login</Typography>
              <Typography color="text.secondary" variant="body2">
                Don&apos;t have an account? &nbsp;
                <Link
                  component={NextLink}
                  href="/c/auth/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  Register
                </Link>
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
                <TextField
                  error={!!(formik.touched.mPass && formik.errors.mPass)}
                  fullWidth
                  helperText={formik.touched.mPass && formik.errors.mPass}
                  label="mPass"
                  name="mPass"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.mPass}
                />
              </Stack>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Link
                component={NextLink}
                href="c/auth/forgot-mPass"
                underline="hover"
                variant="subtitle2"
              >
                Forgot mPass?
              </Link>
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                Login
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
