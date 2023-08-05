import * as Yup from 'yup';
import * as moment from 'moment';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  FormControlLabel,
  FormLabel,
  Modal,
  Radio,
  RadioGroup,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import {
  emailRegExp,
  phoneRegExp,
} from 'src/sections/bank-account/bank-account-form';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { AccountOtpForm } from 'src/sections/bank-account/account-otp-form';
import Head from 'next/head';
import { Layout } from 'src/layouts/client/layout';
import { LoadingButton } from '@mui/lab';
import { accountApi } from 'src/services/account-api';
import { customerApi } from 'src/services/customer-api';
import { interestRateApi } from 'src/services/interest-rate-api';
import { paymentMethodApi } from 'src/services/payment-method-api';
import { useFormik } from 'formik';
import { CheckIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

const accountTypes = [
  {
    value: 0,
    label: 'Checking',
  },
  {
    value: 1,
    label: 'Deposit',
  },
];

export const style = {
  width: 500,
  height: '80vh',
  overflow: 'hidden',
  flexDirection: 'column',
  display: 'flex',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const Page = () => {
  const [hasCustomer, setHasCustomer] = useState(false);

  const [sourceAccount, setSourceAccount] = useState(null);

  const [isChecked, setIsChecked] = useState(false);

  const [showOtpForm, setShowOtpForm] = useState(false);

  const [transactionId, setTransactionId] = useState(null);

  const { mutateAsync: register } = useMutation({
    mutationFn: accountApi.register,
    onSuccess: (data) => {
      setTransactionId(data.data.transactionId);
      setShowOtpForm(true);
    },
  });

  const { mutateAsync: verifyOtp, isSuccess } = useMutation({
    mutationFn: accountApi.verifyOtp,
    onSuccess: (data) => {
      setShowOtpForm(false);
    },
  });

  const { data: paymentMethodData } = useQuery({
    queryKey: ['paymentMethods'],
    queryFn: () => {
      return paymentMethodApi.getAll({ page: 0, limit: 100 });
    },
  });

  const { data: interestRateData } = useQuery({
    queryKey: ['interestRates'],
    queryFn: () => {
      return interestRateApi.getAll({ page: 0, limit: 100, status: 1 });
    },
  });

  const interestRates = useMemo(() => {
    const items = interestRateData?.data?.items || [];
    return items;
  }, [interestRateData]);

  // term in interest rate, get all terms unique
  const terms = useMemo(() => {
    const interestRatesFilter = interestRates.filter(
      (item) => item.term.value !== 0,
    );
    const terms = interestRatesFilter.map((item) => item.term);
    return [...new Set(terms)];
  }, [interestRates]);

  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      customerId: null,
      email: '',
      firstName: '',
      lastName: '',
      pin: '',
      dob: moment().format('YYYY-MM-DD'),
      phone: '',
      gender: 0,
      address: '',

      type: 0,
      principal: 0,
      paymentMethodId: 0,
      interestRateId: interestRates[0]?.id || 0,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(emailRegExp, 'Email is not valid')
        .max(255)
        .required('Email is required'),

      firstName: Yup.string().max(255).required('First name is required'),
      lastName: Yup.string().max(255).required('Last name is required'),
      pin: Yup.string().min(12).max(12).required('Pin is required'),
      dob: Yup.string().required('Date of birth is required'),
      phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
      address: Yup.string().max(255).required('Address is required'),
      principal: Yup.number()
        .min(500000, 'Minimum principal is 500,000 VND')
        .required('Principal is required'),
    }),
    onSubmit: async (values, helpers) => {
      setIsLoading(true);
      try {
        const changedValues = { ...values };
        if (!changedValues?.customerId && !hasCustomer) {
          const customerInfo = {
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            pin: values.pin,
            dob: values.dob,
            phone: values.phone,
            address: values.address,
            gender: values.gender,
          };
          changedValues['customer'] = customerInfo;
        }
        if (selectedType === 0) {
          changedValues.interestRateId = null;
        }
        if (changedValues?.interestRateId && changedValues?.paymentMethodId)
          changedValues.paymentMethodId = parseInt(
            changedValues.paymentMethodId,
          );
        changedValues.type = selectedType;
        if (sourceAccount) {
          if (sourceAccount.balance < changedValues.principal) {
            throw new Error('Source account balance is not enough');
          }
          changedValues.sourceAccountId = sourceAccount.id;
          changedValues.sourceAccountEmail = sourceAccount.customer.email;
          changedValues.sourceAccountNumber = sourceAccount.number;
        } else {
          throw new Error('Source account is required');
        }

        await register(changedValues);
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
      setIsLoading(false);
    },
  });

  const paymentMethods = useMemo(() => {
    const items = paymentMethodData?.data?.items || [];
    formik.setFieldValue('paymentMethodId', items[0]?.id || 0);
    return items;
  }, [paymentMethodData]);

  const [selectedType, setSelectedType] = useState(0);

  const [selectedTermId, setSelectedTermId] = useState(-1);

  const selectedInterestRate = useMemo(() => {
    const selectedInterestRate = interestRates.find((item) => {
      return item.term.id === parseInt(selectedTermId);
    });
    formik.setFieldValue('interestRateId', selectedInterestRate?.id || 0);
    return selectedInterestRate || null;
  }, [interestRates, selectedTermId]);

  useEffect(() => {
    if (terms.length === 0) return;
    const selectedTermId = terms[0]?.id || -1;
    setSelectedTermId(selectedTermId);
  }, [terms]);

  const maturityDate = useMemo(() => {
    if (!selectedInterestRate) return '';
    return moment()
      .add(selectedInterestRate.term.value, 'M')
      .format('YYYY-MM-DD');
  }, [selectedInterestRate]);

  const { mutate: getCustomer } = useMutation({
    mutationFn: customerApi.findByPin,
    onSuccess: (data) => {
      setHasCustomer(data?.data?.id ? true : false);
      const customer = data?.data || {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        dob: moment().format('YYYY-MM-DD'),
        gender: 0,
      };

      formik.setValues({
        ...formik.values,
        customerId: customer?.id,
        ...customer,
      });
    },
  });

  useEffect(() => {
    if (sourceAccount) {
      getCustomer(sourceAccount?.customer?.pin);
      formik.setFieldValue('pin', sourceAccount?.customer?.pin);
    }
  }, [sourceAccount]);

  return (
    <>
      <Head>
        <title>Activation | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 10,
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
          <Card style={style}>
            <CardHeader title={`Register banking account`} />
            <CardContent
              sx={{
                pt: 0,
                overflow: 'auto',
              }}
            >
              {isSuccess && (
                <Stack spacing={2}>
                  <Stack alignItems="center">
                    <Avatar
                      sx={{
                        backgroundColor: 'success.main',
                        height: 56,
                        width: 56,
                      }}
                    >
                      <SvgIcon>
                        <CheckIcon />
                      </SvgIcon>
                    </Avatar>
                  </Stack>
                  <Typography
                    color="textPrimary"
                    variant="h4"
                    sx={{ mt: 2 }}
                    align="center"
                  >
                    Register banking account successfully
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body1"
                    sx={{ mt: 2 }}
                    align="center"
                  >
                    Please check your email to get account information or
                  </Typography>
                  <Button
                    size="large"
                    component={Link}
                    href="/c/banking-info"
                    color="primary"
                    variant="contained"
                  >
                    Access it now
                  </Button>
                </Stack>
              )}
              {formik.errors.submit && (
                <Typography color="error" sx={{ mb: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              {!isSuccess && (
                <Box
                  sx={{
                    flexDirection: 'column',
                    gap: '1rem',
                    display: 'flex',
                  }}
                >
                  <SourceForm
                    isChecked={isChecked}
                    setIsChecked={setIsChecked}
                    currentAccount={sourceAccount}
                    setCurrentAccount={setSourceAccount}
                  />
                  <form
                    id="main-form"
                    autoComplete="off"
                    onSubmit={formik.handleSubmit}
                  >
                    <Box
                      sx={{
                        flexDirection: 'column',
                        gap: '1rem',
                        display: 'flex',
                      }}
                    >
                      <Divider />
                      <Typography color="indigo" variant="subtitle1">
                        Account Information
                      </Typography>
                      <TextField
                        size="small"
                        value={formik.values.type}
                        label="Account Type"
                        name="type"
                        select
                        SelectProps={{ native: true }}
                        onChange={(e) => {
                          setSelectedType(
                            parseInt(e.target.value) === 0
                              ? 0
                              : parseInt(e.target.value),
                          );
                          formik.handleChange(e);
                        }}
                      >
                        {accountTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </TextField>

                      {parseInt(selectedType) === 1 && (
                        <>
                          <TextField
                            size="small"
                            label="Term"
                            value={selectedTermId}
                            onChange={(e) => {
                              setSelectedTermId(e.target.value);
                            }}
                            select
                            SelectProps={{ native: true }}
                          >
                            {terms.map((term) => (
                              <option key={term.id} value={term.id}>
                                {term.value + ' ' + 'tháng'}
                              </option>
                            ))}
                          </TextField>
                          <TextField
                            size="small"
                            value={formik.values.paymentMethodId}
                            label="Interest Payment Method"
                            name="paymentMethodId"
                            select
                            SelectProps={{ native: true }}
                            onChange={formik.handleChange}
                          >
                            {paymentMethods.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </TextField>
                          <TextField
                            disabled
                            size="small"
                            fullWidth
                            label="Interest Rate (%)"
                            name="value"
                            type="number"
                            value={selectedInterestRate?.value || 0}
                          />

                          <TextField
                            disabled
                            size="small"
                            label="Maturity Date"
                            type="date"
                            value={maturityDate}
                          />
                        </>
                      )}
                      <TextField
                        error={
                          !!(
                            formik.touched.principal && formik.errors.principal
                          )
                        }
                        helperText={
                          formik.touched.principal && formik.errors.principal
                        }
                        size="small"
                        label="Principal"
                        name="principal"
                        type="number"
                        onChange={formik.handleChange}
                        value={formik.values.principal}
                      />
                      <Typography color="indigo" variant="subtitle1">
                        Customer Information
                      </Typography>
                      <TextField
                        error={!!(formik.touched.pin && formik.errors.pin)}
                        helperText={formik.touched.pin && formik.errors.pin}
                        size="small"
                        label="Personal Identification Number"
                        name="pin"
                        type="number"
                        onBlur={(e) => {
                          if (e.target.value.length === 12)
                            getCustomer(e.target.value);
                          formik.handleBlur(e);
                        }}
                        onChange={formik.handleChange}
                        value={formik.values.pin}
                      />
                      <TextField
                        size="small"
                        disabled={hasCustomer}
                        error={!!(formik.touched.email && formik.errors.email)}
                        fullWidth
                        helperText={formik.touched.email && formik.errors.email}
                        label="Email"
                        name="email"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.email}
                      />
                      <Stack
                        spacing={1}
                        direction={{ xs: 'column', sm: 'row' }}
                      >
                        <TextField
                          disabled={hasCustomer}
                          size="small"
                          error={
                            !!(
                              formik.touched.firstName &&
                              formik.errors.firstName
                            )
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
                          disabled={hasCustomer}
                          size="small"
                          error={
                            !!(
                              formik.touched.lastName && formik.errors.lastName
                            )
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
                        disabled={hasCustomer}
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
                        disabled={hasCustomer}
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
                        disabled={hasCustomer}
                        size="small"
                        error={
                          !!(formik.touched.address && formik.errors.address)
                        }
                        fullWidth
                        helperText={
                          formik.touched.address && formik.errors.address
                        }
                        label="Address"
                        name="address"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.address}
                      />
                      <div>
                        <FormLabel id="gender">Gender</FormLabel>
                        <RadioGroup
                          disabled={hasCustomer}
                          aria-labelledby="gender"
                          name="gender"
                          value={formik.values.gender}
                          onChange={formik.handleChange}
                          row
                        >
                          <FormControlLabel
                            disabled={hasCustomer}
                            value={0}
                            control={<Radio />}
                            label="Female"
                          />
                          <FormControlLabel
                            disabled={hasCustomer}
                            value={1}
                            control={<Radio />}
                            label="Male"
                          />
                        </RadioGroup>
                      </div>
                    </Box>
                  </form>
                </Box>
              )}
            </CardContent>
            {!isSuccess && (
              <>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <LoadingButton
                    disabled={!isChecked}
                    form="main-form"
                    loading={isLoading}
                    type="submit"
                    variant="contained"
                  >
                    Submit
                  </LoadingButton>
                </CardActions>
              </>
            )}
          </Card>
        </Container>
      </Box>
      <Modal
        open={showOtpForm}
        onClose={() => {
          setShowOtpForm(false);
        }}
      >
        <Box>
          <AccountOtpForm transactionId={transactionId} onSubmit={verifyOtp} />
        </Box>
      </Modal>
    </>
  );
};

Page.getLayout = (page) => <Layout>{page}</Layout>;

export default Page;

const SourceForm = ({
  currentAccount,
  setCurrentAccount,
  isChecked,
  setIsChecked,
}) => {
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: accountApi.check,
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
        const res = await mutateAsync(values);
        setIsChecked(true);
        setCurrentAccount({
          ...res.data,
          pin: values.pin,
        });
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
      <form id="source-form" autoComplete="off" onSubmit={formik.handleSubmit}>
        <Stack spacing={1}>
          <Typography color="indigo" variant="subtitle1">
            Source of Funds
          </Typography>
          {formik.errors.submit && (
            <Typography color="error" sx={{ mb: 3 }} variant="body2">
              {formik.errors.submit}
            </Typography>
          )}
          <TextField
            disabled={isChecked}
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
          {!isChecked && (
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
          )}
          {currentAccount?.id && isChecked && (
            <Typography align="right" variant="subtitle1">
              Balance:{' '}
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(currentAccount?.balance || 0)}
            </Typography>
          )}
          {!isChecked && (
            <LoadingButton
              form="source-form"
              color="success"
              fullWidth
              loading={isLoading}
              type="submit"
              variant="contained"
              sx={{
                minWidth: 100,
              }}
            >
              Check
            </LoadingButton>
          )}
          {isChecked && (
            <LoadingButton
              form="source-form"
              color="success"
              fullWidth
              onClick={() => {
                setIsChecked(false);
              }}
              variant="contained"
              sx={{
                minWidth: 100,
              }}
            >
              Change
            </LoadingButton>
          )}
        </Stack>
      </form>
    </>
  );
};
