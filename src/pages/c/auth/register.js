import * as Yup from 'yup';
import * as moment from 'moment';

import {
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Link,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import Head from 'next/head';
import { LoadingButton } from '@mui/lab';
import NextLink from 'next/link';
import { customerApi } from 'src/services/customer-api';
import { emailRegExp } from 'src/sections/bank-account/bank-account-form';
import { phoneRegExp } from 'src/sections/user/user-form';
import { toast } from 'react-hot-toast';
import { useFormik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

const Page = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // create a new product
  const { mutateAsync: create } = useMutation({
    mutationFn: customerApi.create,
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      pin: '',
      dob: moment().subtract(18, 'years').format('YYYY-MM-DD'),
      phone: '',
      gender: 0,
      address: '',
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(emailRegExp, 'Email is not valid')
        .max(255)
        .required('Email is required'),

      firstName: Yup.string().max(255).required('First name is required'),
      lastName: Yup.string().max(255).required('Last name is required'),
      pin: Yup.string().min(12).max(12).required('Pin is required'),
      dob: Yup.string()
        .required('Date of birth is required')
        .test('age', 'Age must be greater than 18', (value) => {
          const age = moment().diff(value, 'years');
          return age >= 18;
        }),
      phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
      address: Yup.string().max(255).required('Address is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        setIsLoading(true);
        values.pin = values.pin.toString();
        await create(values);
        toast.success('Account created', {
          position: 'top-left',
        });
        setIsSuccess(true);
      } catch (err) {
        toast.error(err.message, {
          position: 'top-left',
        });
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
                  href="/c/auth/login"
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
                  Account created successfully. Please check your email for get
                  mPass to login
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
                  <TextField
                    size="small"
                    error={!!(formik.touched.email && formik.errors.email)}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label="Email"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />

                  <TextField
                    error={!!(formik.touched.pin && formik.errors.pin)}
                    helperText={formik.touched.pin && formik.errors.pin}
                    size="small"
                    label="Personal Identification Number"
                    name="pin"
                    type="number"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.pin}
                  />
                  <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }}>
                    <TextField
                      size="small"
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
                      size="small"
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
                    error={!!(formik.touched.dob && formik.errors.dob)}
                    helperText={formik.touched.dob && formik.errors.dob}
                    size="small"
                    label="Date of birth"
                    name="dob"
                    type="date"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.dob}
                  />
                  <TextField
                    error={!!(formik.touched.phone && formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                    size="small"
                    label="Phone"
                    name="phone"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.phone}
                  />
                  <TextField
                    size="small"
                    error={!!(formik.touched.address && formik.errors.address)}
                    fullWidth
                    helperText={formik.touched.address && formik.errors.address}
                    label="Address"
                    name="address"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.address}
                  />
                  <div>
                    <FormLabel id="gender">Gender</FormLabel>
                    <RadioGroup
                      aria-labelledby="gender"
                      name="gender"
                      value={formik.values.gender}
                      onChange={formik.handleChange}
                      row
                    >
                      <FormControlLabel
                        value={0}
                        control={<Radio />}
                        label="Female"
                      />
                      <FormControlLabel
                        value={1}
                        control={<Radio />}
                        label="Male"
                      />
                    </RadioGroup>
                  </div>
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
