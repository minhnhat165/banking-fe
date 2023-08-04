import * as Yup from 'yup';
import * as moment from 'moment';

import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import { LoadingButton } from '@mui/lab';
import { productApi } from 'src/services/product-api';
import { termApi } from 'src/services/term-api';
import { useFormik } from 'formik';
import { useQuery } from '@tanstack/react-query';

const notProductId = 4;

export const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const types = {
  ADD: 'Add',
  EDIT: 'Edit',
};

export const InterestRateForm = ({ item, onSubmit, type = 'ADD' }) => {
  const { data } = useQuery({
    queryKey: ['products'],
    queryFn: () => {
      return productApi.getAll({ page: 0, limit: 100 });
    },
  });
  const { data: termData } = useQuery({
    queryKey: ['terms'],
    queryFn: () => {
      return termApi.getAll({ page: 0, limit: 100 });
    },
  });

  const products = data?.data?.items || [];
  const terms = useMemo(() => {
    const items = termData?.data?.items.filter((term) => term.value !== 0);
    return items;
  }, [termData]);

  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      value: item?.value,
      productId: item?.productId || products[0]?.id || 0,
      termId: item?.termId || terms[0]?.id || 0,
      effectiveDate: item?.effectiveDate || moment().format('YYYY-MM-DD'),
      expiredDate:
        item?.expiredDate || moment().add(1, 'd').format('YYYY-MM-DD'),
    },
    validationSchema: Yup.object({
      value: Yup.number().min(0).max(100).required('Value is required'),
      effectiveDate:
        types[type] === types.EDIT
          ? Yup.date().required('Effective date is required')
          : Yup.date()
              .required('Effective date is required')
              .min(
                moment().format('YYYY-MM-DD'),
                'Effective date must be in the future',
              ),
      // expiredDate not less than effectiveDate
      expiredDate: Yup.date()
        .required('Expired date is required')
        .min(
          Yup.ref('effectiveDate'),
          'Expired date must be greater than effective date',
        ),
    }),
    onSubmit: async (values, helpers) => {
      setIsLoading(true);
      try {
        const changedKey = Object.keys(values).filter(
          (key) => values[key] !== item[key],
        );
        const changedValues = changedKey.reduce(
          (acc, key) => ({ ...acc, [key]: values[key] }),
          {},
        );
        changedValues.id = item?.id;
        if (parseInt(changedValues.productId) === notProductId) {
          changedValues.termId = termData?.data?.items.find(
            (term) => term.value === 0,
          )?.id;
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
  const [selectedProductId, setSelectedProductId] = useState(
    item?.productId || products[0]?.id || 0,
  );

  useEffect(() => {
    if (products.length === 0) return;
    setSelectedProductId(item?.productId || products[0]?.id);
    formik.setFieldValue('productId', item?.productId || products[0]?.id);
  }, [products]);

  useEffect(() => {
    if (terms.length === 0) return;
    formik.setFieldValue('termId', terms[0]?.id);
  }, [terms]);

  return (
    <form autoComplete="off" onSubmit={formik.handleSubmit}>
      <Card style={style}>
        <CardHeader title={`${types[type]} Interest Rate`} />
        <CardContent sx={{ pt: 0 }}>
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
            <TextField
              size="small"
              error={!!(formik.touched.value && formik.errors.value)}
              fullWidth
              helperText={formik.touched.value && formik.errors.value}
              label="Value (%)"
              name="value"
              type="number"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.value}
            />
            <TextField
              size="small"
              value={formik.values.productId}
              label="Product"
              name="productId"
              select
              SelectProps={{ native: true }}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                formik.handleChange(e);
              }}
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </TextField>

            {parseInt(selectedProductId) !== notProductId && (
              <TextField
                size="small"
                value={formik.values.termId}
                label="Term"
                name="termId"
                select
                SelectProps={{ native: true }}
                onChange={formik.handleChange}
              >
                {terms.map((term) => (
                  <option key={term.id} value={term.id}>
                    {term.value + ' ' + 'tháng'}
                  </option>
                ))}
              </TextField>
            )}

            <TextField
              error={
                !!(formik.touched.effectiveDate && formik.errors.effectiveDate)
              }
              helperText={
                formik.touched.effectiveDate && formik.errors.effectiveDate
              }
              size="small"
              label="Effective Date"
              name="effectiveDate"
              type="date"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.effectiveDate}
            />
            <TextField
              error={
                !!(formik.touched.expiredDate && formik.errors.expiredDate)
              }
              helperText={
                formik.touched.expiredDate && formik.errors.expiredDate
              }
              size="small"
              label="Expired Date"
              name="expiredDate"
              type="date"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.expiredDate}
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

InterestRateForm.propTypes = {};
