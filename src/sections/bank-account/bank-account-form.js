import * as Yup from 'yup';
import * as moment from 'moment';

import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { LoadingButton } from '@mui/lab';
import { accountApi } from 'src/services/account-api';
import { customerApi } from 'src/services/customer-api';
import { interestRateApi } from 'src/services/interest-rate-api';
import { paymentMethodApi } from 'src/services/payment-method-api';
import { productApi } from 'src/services/product-api';
import { rolloverPlanApi } from 'src/services/rollover-plan-api';
import { useFormik } from 'formik';

export const phoneRegExp = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
export const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height: '80%',
  overflow: 'hidden',
  flexDirection: 'column',
  display: 'flex',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const types = {
  ADD: 'Add',
  EDIT: 'Edit',
};

export const BankAccountForm = ({ item, onSubmit, type = 'ADD' }) => {
  const [hasCustomer, setHasCustomer] = useState(item?.customer ? true : false);
  const { data: product } = useQuery({
    queryKey: ['products'],
    queryFn: () => {
      return productApi.getAll({ page: 0, limit: 100 });
    },
  });

  const [selectedProductId, setSelectedProductId] = useState(
    item?.productId || -1,
  );

  const { data: paymentMethodData } = useQuery({
    queryKey: ['paymentMethods'],
    queryFn: () => {
      return paymentMethodApi.getAll({ page: 0, limit: 100 });
    },
  });

  const { data: rolloverMethodData } = useQuery({
    queryKey: ['rolloverPlans'],
    queryFn: () => {
      return rolloverPlanApi.getAll({ page: 0, limit: 100 });
    },
  });

  const rolloverMethods = useMemo(() => {
    const items = rolloverMethodData?.data?.items || [];
    return items;
  }, [rolloverMethodData]);

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

  const products = useMemo(() => {
    const items = product?.data?.items || [];
    return items;
  }, [product]);

  const interestRates = useMemo(() => {
    const items = interestRateData?.data?.items || [];
    return items;
  }, [interestRateData]);

  const terms = useMemo(() => {
    const interestRatesFilter = interestRates.filter(
      (item) => item.term.value !== 0,
    );
    const terms = interestRatesFilter.map((item) => item.term);
    return [...new Set(terms)];
  }, [interestRates]);
  const [selectedType, setSelectedType] = useState(item?.type || 0);

  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      customerId: item?.customerId || null,
      email: item?.customer?.email || '',
      firstName: item?.customer?.firstName || '',
      lastName: item?.customer?.lastName || '',
      pin: item?.customer?.pin || '',
      dob:
        item?.customer?.dob ||
        moment().subtract(18, 'years').format('YYYY-MM-DD'),
      phone: item?.customer?.phone || '',
      gender: item?.customer?.gender || 0,
      address: item?.customer?.address || '',

      type: item?.type || 0,
      principal: item?.principal || 0,
      paymentMethodId: item?.paymentMethodId || 0,
      interestRateId: item?.interestRateId || interestRates[0]?.id || 0,
      rolloverId: item?.rolloverId || 0,
      transferAccountId: item?.transferAccountId || 0,
      termId: item?.termId || terms[0]?.id || 0,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(emailRegExp, 'Email is not valid')
        .max(255)
        .required('Email is required'),

      firstName: Yup.string().max(255).required('First name is required'),
      lastName: Yup.string().max(255).required('Last name is required'),
      pin: Yup.string().matches(/^[0-9]{12}$/, 'Pin is not valid'),
      dob: Yup.string()
        .required('Date of birth is required')
        .test('age', 'Age must be greater than 18', (value) => {
          const age = moment().diff(value, 'years');
          return age >= 18;
        }),
      phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
      address: Yup.string().max(255).required('Address is required'),
      principal:
        selectedType === 0
          ? Yup.number().required('Principal is required').min(0)
          : Yup.number()
              .min(500000, 'Minimum principal is 500,000 VND')
              .required('Principal is required'),
    }),
    onSubmit: async (values, helpers) => {
      setIsLoading(true);
      try {
        const changedKey = Object.keys(values).filter((key) => {
          if (!item) return true;
          if (item.hasOwnProperty(key) === false) return true;
          return values[key] !== item[key];
        });
        const changedValues = changedKey.reduce(
          (acc, key) => ({ ...acc, [key]: values[key] }),
          {},
        );
        changedValues.id = item?.id;
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
          changedValues.customer = customerInfo;
        }
        if (selectedType === 0) {
          changedValues.interestRateId = null;
        }
        if (changedValues?.interestRateId && changedValues?.paymentMethodId)
          changedValues.paymentMethodId = parseInt(
            changedValues.paymentMethodId,
          );
        changedValues.type = selectedType;
        if (selectedType !== 0) {
          const interestRate = interestRates.find(
            (item) => item.id === changedValues.interestRateId,
          );
          changedValues.interestRate = interestRate.value;
          changedValues.termId = selectedTermId;
        }

        await onSubmit(changedValues);
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
    formik.setFieldValue(
      'paymentMethodId',
      item?.paymentMethodId || items[0]?.id || 0,
    );
    return items;
  }, [paymentMethodData]);

  const [selectedTermId, setSelectedTermId] = useState(item?.termId || -1);

  const selectedInterestRate = useMemo(() => {
    const selectedInterestRate = interestRates.find((item) => {
      return item.term.id === parseInt(selectedTermId);
    });
    formik.setFieldValue('interestRateId', selectedInterestRate?.id || 0);
    return selectedInterestRate || null;
  }, [interestRates, selectedTermId]);

  useEffect(() => {
    if (terms.length === 0) return;
    const selectedTermId = item?.interestRate?.term?.id || terms[0]?.id || -1;
    setSelectedTermId(selectedTermId);
  }, [item?.interestRate?.term?.id, terms]);

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

  const { mutate: getAccounts, data } = useMutation({
    mutationFn: accountApi.getAll,
    onSuccess: (data) => {
      formik.setFieldValue(
        'transferAccountId',
        item?.transferAccountId || data?.data?.items[0]?.id || 0,
      );
    },
  });
  const accounts = useMemo(() => {
    return data?.data?.items || [];
  }, [data]);

  return (
    <form autoComplete="off" onSubmit={formik.handleSubmit}>
      <Card style={style}>
        <CardHeader title={`${types[type]} Account`} />
        <CardContent
          sx={{
            pt: 0,
            overflow: 'auto',
          }}
        >
          {formik.errors.submit && (
            <Typography color="error" sx={{ mb: 3 }} variant="body2">
              {formik.errors.submit}
            </Typography>
          )}
          <Box
            sx={{
              flexDirection: 'column',
              gap: '1rem',
              display: 'flex',
            }}
          >
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
                if (e.target.value.length === 12) getCustomer(e.target.value);
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
            <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }}>
              <TextField
                disabled={hasCustomer}
                size="small"
                error={!!(formik.touched.firstName && formik.errors.firstName)}
                fullWidth
                helperText={formik.touched.firstName && formik.errors.firstName}
                label="First Name"
                name="firstName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.firstName}
              />
              <TextField
                disabled={hasCustomer}
                size="small"
                error={!!(formik.touched.lastName && formik.errors.lastName)}
                fullWidth
                helperText={formik.touched.lastName && formik.errors.lastName}
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
                  parseInt(e.target.value) === 0 ? 0 : parseInt(e.target.value),
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
                  size="small"
                  label="Rollover Method"
                  name="rolloverId"
                  value={formik.values.rolloverId}
                  onChange={(e) => {
                    formik.handleChange(e);
                    if (e.target.value === '3') {
                      getAccounts({
                        page: 0,
                        limit: 100,
                        type: 0,
                        customerId: formik.values.customerId,
                      });
                    }
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
                {formik.values.rolloverId === '3' && (
                  <TextField
                    size="small"
                    label="Transfer To Account"
                    name="transferToAccountId"
                    select
                    SelectProps={{ native: true }}
                  >
                    {accounts.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.number}
                      </option>
                    ))}
                  </TextField>
                )}
              </>
            )}
            <TextField
              error={!!(formik.touched.principal && formik.errors.principal)}
              helperText={formik.touched.principal && formik.errors.principal}
              size="small"
              label="Principal"
              name="principal"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.principal}
            />
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <LoadingButton loading={isLoading} type="submit" variant="contained">
            {type === types.ADD ? 'Add' : 'Save'}
          </LoadingButton>
        </CardActions>
      </Card>
    </form>
  );
};

BankAccountForm.propTypes = {};
