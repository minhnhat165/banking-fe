import * as Yup from 'yup';

import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
} from '@mui/material';

import { LoadingButton } from '@mui/lab';
import { accountApi } from 'src/services/account-api';
import { toast } from 'react-hot-toast';
import { useFormik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

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

export const DepositForm = ({ item, onSubmit }) => {
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: accountApi.deposit,
    onSuccess: () => {
      toast.success('Deposit successfully');
    },
  });
  const formik = useFormik({
    initialValues: {
      amount: 0,
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .min(500000, 'Minimum deposit is 500,000')
        .required('Amount is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        values.id = item?.id;
        await mutateAsync({
          amount: values.amount,
          accountId: item?.id,
        });
        onSubmit && onSubmit();
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <form autoComplete="off" onSubmit={formik.handleSubmit}>
      <Card style={style}>
        <CardHeader title="Enter Amount" />
        <CardContent sx={{ pt: 0 }}>
          <Box
            sx={{
              flexDirection: 'column',
              gap: '1rem',
              display: 'flex',
            }}
          >
            <TextField
              error={!!(formik.touched.amount && formik.errors.amount)}
              fullWidth
              helperText={formik.touched.amount && formik.errors.amount}
              label="Amount"
              name="amount"
              type="number"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.amount}
            />
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <LoadingButton loading={isLoading} type="submit" variant="contained">
            Submit
          </LoadingButton>
        </CardActions>
      </Card>
    </form>
  );
};

DepositForm.propTypes = {};
