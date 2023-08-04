import * as Yup from 'yup';

import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Unstable_Grid2 as Grid,
  TextField,
} from '@mui/material';

import { LoadingButton } from '@mui/lab';
import { authApi } from 'src/services/auth-api';
import { toast } from 'react-hot-toast';
import { useAuth } from 'src/hooks/use-auth';
import { useFormik } from 'formik';
import { useMutation } from '@tanstack/react-query';

export const AccountProfileDetails = () => {
  const { user, updateProfile } = useAuth();

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (data) => {
      updateProfile(data.data);
      toast.success('Profile updated', {
        position: 'top-left',
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      phone: user?.phone,
      dob: user?.dob,
      address: user?.address,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().max(255).required('First name is required'),
      lastName: Yup.string().max(255).required('Last name is required'),
      phone: Yup.string().max(255),
      dob: Yup.date().max(new Date(), 'Date of birth must be in the past'),
      address: Yup.string().max(255),
    }),
    onSubmit: async (values, helpers) => {
      try {
        mutateAsync(values);
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <form autoComplete="off" onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  error={
                    !!(formik.touched.firstName && formik.errors.firstName)
                  }
                  fullWidth
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                  label="First name"
                  name="firstName"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.lastName && formik.errors.lastName)}
                  fullWidth
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  label="Last name"
                  name="lastName"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.phone && formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  type="number"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.dob && formik.errors.dob)}
                  helperText={formik.touched.dob && formik.errors.dob}
                  fullWidth
                  label="Select Date of Birth"
                  name="dob"
                  type="date"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  required
                  value={formik.values.dob}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.address && formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                  fullWidth
                  label="Address"
                  name="address"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.address}
                ></TextField>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <LoadingButton loading={isLoading} type="submit" variant="contained">
            Save details
          </LoadingButton>
        </CardActions>
      </Card>
    </form>
  );
};
