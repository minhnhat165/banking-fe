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
  Modal,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { AccountOtpForm } from 'src/sections/bank-account/account-otp-form';
import { CheckIcon } from '@heroicons/react/24/solid';
import Head from 'next/head';
import { Layout } from 'src/layouts/client/layout';
import Link from 'next/link';
import { LoadingButton } from '@mui/lab';
import { accountApi } from 'src/services/account-api';
import { customerApi } from 'src/services/customer-api';
import { interestRateApi } from 'src/services/interest-rate-api';
import { paymentMethodApi } from 'src/services/payment-method-api';
import { productApi } from 'src/services/product-api';
import { rolloverPlanApi } from 'src/services/rollover-plan-api';
import { set } from 'nprogress';
import { useCustomer } from 'src/hooks/use-customer';
import { useFormik } from 'formik';

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
  const { user } = useCustomer(true);
  const [selectedProductId, setSelectedProductId] = useState(-1);
  const [selectedType, setSelectedType] = useState(0);
  const [selectedTransferAccountId, setSelectedTransferAccountId] =
    useState(-1);
  const [selectedTermId, setSelectedTermId] = useState(-1);

  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(-1);

  const [selectedRolloverId, setSelectedRolloverId] = useState(-1);
  const [hasCustomer, setHasCustomer] = useState(false);
  const { data: product } = useQuery({
    queryKey: ['products'],
    queryFn: () => {
      return productApi.getAll({ page: 0, limit: 100 });
    },
  });
  const { data } = useQuery({
    queryKey: ['accounts', user?.id],
    queryFn: () =>
      accountApi.getAll({
        page: 0,
        limit: 100,
        customerId: user?.id,
        type: 0,
      }),
  });

  const accounts = useMemo(() => {
    const items = data?.data?.items || [];
    if (items.length > 0) setSelectedTransferAccountId(items[0].id);
    return items;
  }, [data]);
  const products = useMemo(() => {
    const items = product?.data?.items || [];
    if (items.length > 0) setSelectedProductId(items[0].id);
    return items;
  }, [product]);

  const { data: rolloverMethodData } = useQuery({
    queryKey: ['rolloverPlans'],
    queryFn: () => {
      return rolloverPlanApi.getAll({ page: 0, limit: 100 });
    },
  });
  const rolloverMethods = useMemo(() => {
    const items = rolloverMethodData?.data?.items || [];
    if (items.length > 0) setSelectedRolloverId(items[0].id);
    return items;
  }, [rolloverMethodData]);

  const [sourceAccount, setSourceAccount] = useState(null);

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
    queryKey: ['interestRates', selectedProductId],
    queryFn: () => {
      return interestRateApi.getAll({
        page: 0,
        limit: 100,
        status: 1,
        productId: selectedProductId,
      });
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
    if (terms.length > 0) setSelectedTermId(terms[0].id);
    return [...new Set(terms)];
  }, [interestRates]);

  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      customerId: user?.id || 0,
      type: 0,
      principal: 0,
      paymentMethodId: 0,
      interestRateId: 0,
      rolloverId: 0,
      transferAccountId: 0,
      termId: 0,
      interestRate: 0,
      productId: 0,
    },
    validationSchema: Yup.object({
      principal: Yup.number()
        .min(500000, 'Minimum principal is 500,000 VND')
        .required('Principal is required'),
    }),
    onSubmit: async (values, helpers) => {
      setIsLoading(true);
      try {
        const changedValues = { ...values };

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
        if (selectedType.toString() !== '0') {
          const interestRate = interestRates.find(
            (item) => item.id === selectedInterestRate.id,
          );
          changedValues.interestRate = interestRate.value;
          changedValues.termId = selectedTermId;
          changedValues.productId = selectedProductId;
          changedValues.transferAccountId = selectedTransferAccountId;
          changedValues.paymentMethodId = selectedPaymentMethodId;
          changedValues.rolloverId = selectedRolloverId;
        }
        await register(changedValues);
      } catch (err) {
        console.log(err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
      setIsLoading(false);
    },
  });

  const paymentMethods = useMemo(() => {
    const items = paymentMethodData?.data?.items || [];
    if (items.length > 0) setSelectedPaymentMethodId(items[0].id);
    return items;
  }, [paymentMethodData]);

  const selectedInterestRate = useMemo(() => {
    const selectedInterestRate = interestRates.find((item) => {
      return item.term.id === parseInt(selectedTermId);
    });

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
    },
  });

  useEffect(() => {
    if (sourceAccount) {
      getCustomer(sourceAccount?.customer?.pin);
      formik.setFieldValue('pin', sourceAccount?.customer?.pin);
    }
  }, [sourceAccount]);
  if (!user) return null;

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
                    href="/c/accounts"
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
                            label="Product"
                            value={selectedProductId}
                            onChange={(e) => {
                              setSelectedProductId(e.target.value);
                            }}
                            select
                            SelectProps={{ native: true }}
                          >
                            {products.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name}
                              </option>
                            ))}
                          </TextField>
                          <TextField
                            size="small"
                            label="Term"
                            name="termId"
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
                          <TextField
                            size="small"
                            value={selectedPaymentMethodId}
                            label="Interest Payment Method"
                            name="paymentMethodId"
                            select
                            SelectProps={{ native: true }}
                            onChange={(e) => {
                              setSelectedPaymentMethodId(e.target.value);
                            }}
                          >
                            {paymentMethods.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </TextField>
                          <TextField
                            size="small"
                            label="Rollover Method"
                            name="rolloverId"
                            value={selectedRolloverId}
                            onChange={(e) => {
                              setSelectedRolloverId(e.target.value);
                            }}
                            select
                            SelectProps={{ native: true }}
                          >
                            {rolloverMethods.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </TextField>
                          {selectedRolloverId === '3' && (
                            <TextField
                              size="small"
                              label="Transfer To Account"
                              name="transferAccountId"
                              select
                              SelectProps={{ native: true }}
                              value={selectedTransferAccountId}
                              onChange={(e) => {
                                setSelectedTransferAccountId(e.target.value);
                              }}
                            >
                              {accounts.map((item, index) => (
                                <option
                                  defaultChecked={index === 0}
                                  key={item.id}
                                  value={item.id}
                                >
                                  {item.number}
                                </option>
                              ))}
                            </TextField>
                          )}
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

const SourceForm = ({ currentAccount, setCurrentAccount }) => {
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: accountApi.check,
  });
  const { user } = useCustomer();
  const { data } = useQuery({
    queryKey: ['accounts', user?.id],
    queryFn: () =>
      accountApi.getAll({
        page: 0,
        limit: 100,
        customerId: user?.id,
        type: 0,
      }),
  });

  const accounts = useMemo(() => {
    const items = data?.data?.items || [];
    return items;
  }, [data]);

  return (
    <>
      <form id="source-form" autoComplete="off">
        <Stack spacing={1}>
          <Typography color="indigo" variant="subtitle1">
            Source of Funds
          </Typography>

          <TextField
            fullWidth
            size="small"
            label="Account number"
            name="number"
            select
            value={currentAccount?.id}
            onChange={(e) => {
              const account = accounts.find(
                (item) => item.id.toString() === e.target.value,
              );
              setCurrentAccount(account);
            }}
            SelectProps={{ native: true }}
          >
            {accounts.map((item, index) => (
              <option
                defaultChecked={index === 0}
                key={item.id}
                value={item.id}
              >
                {item.number}
              </option>
            ))}
          </TextField>

          {currentAccount?.id && (
            <Typography align="right" variant="subtitle1">
              Balance:{' '}
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(currentAccount?.balance || 0)}
            </Typography>
          )}
        </Stack>
      </form>
    </>
  );
};
