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

import { LoadingButton } from '@mui/lab';
import { useFormik } from 'formik';
import { useState } from 'react';

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
export const phoneRegExp = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
export const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const UserForm = ({ item, onSubmit, type = 'ADD' }) => {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: item?.email || '',
      firstName: item?.firstName || '',
      lastName: item?.lastName || '',
      dob: item?.dob || moment().subtract(18, 'years').format('YYYY-MM-DD'),
      phone: item?.phone || '',
      gender: item?.gender || 0,
      address: item?.address || '',
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(emailRegExp, 'Email is not valid')
        .max(255)
        .required('Email is required'),

      firstName: Yup.string().max(255).required('First name is required'),
      lastName: Yup.string().max(255).required('Last name is required'),
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
          delete changedValues.termId;
        }
        if (changedValues.pin) {
          changedValues.pin = changedValues.pin.toString();
        }

        changedValues.status = 1;
        await onSubmit(changedValues);
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
        <CardHeader title={`${types[type]} User`} />
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
              disabled={types[type] === types.EDIT}
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

            <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }}>
              <TextField
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
                <FormControlLabel value={1} control={<Radio />} label="Male" />
              </RadioGroup>
            </div>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <LoadingButton loading={isLoading} type="submit" variant="contained">
            {types[type] === types.ADD ? 'Add' : 'Save'}
          </LoadingButton>
        </CardActions>
      </Card>
    </form>
  );
};

UserForm.propTypes = {};
