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
import { useFormik } from 'formik';
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

export const AccountOtpForm = ({ item, onSubmit, transactionId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      otp: '',
      transactionId: transactionId,
    },
    validationSchema: Yup.object({
      otp: Yup.string()
        .min(6, 'OTP must be exactly 6 digits')
        .max(6, 'OTP must be exactly 6 digits')
        .matches(/^[0-9]+$/, 'Must be only digits')
        .required('OTP is required'),
    }),
    onSubmit: async (values, helpers) => {
      setIsLoading(true);
      try {
        values.id = item?.id;
        onSubmit({ ...values, transactionId: transactionId });
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
      setIsLoading(false);
    },
  });

  return (
    <form autoComplete="off" onSubmit={formik.handleSubmit}>
      <Card style={style}>
        <CardHeader
          title="Enter OTP"
          subheader="Enter the OTP sent to your source account email address"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box
            sx={{
              flexDirection: 'column',
              gap: '1rem',
              display: 'flex',
            }}
          >
            <TextField
              error={!!(formik.touched.otp && formik.errors.otp)}
              fullWidth
              helperText={formik.touched.otp && formik.errors.otp}
              label="OTP"
              name="otp"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.otp}
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

AccountOtpForm.propTypes = {};
