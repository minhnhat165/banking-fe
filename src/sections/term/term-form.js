import * as Yup from 'yup';

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

const types = {
  ADD: 'Add',
  EDIT: 'Edit',
};

export const TermForm = ({ item, onSubmit, type = 'ADD' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: item?.name,
      value: item?.value,
      description: item?.description || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required('Name is required'),
      // value not allow decimal and min value is 1
      value: Yup.number()
        .min(0)
        .max(36)
        .required('Value is required')
        .integer(),
      description: Yup.string().max(255),
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
        <CardHeader title={`${types[type]} Term`} />

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
              label="Value"
              name="value"
              type="number"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.value}
            />
            <TextField
              size="small"
              error={!!(formik.touched.name && formik.errors.name)}
              fullWidth
              helperText={formik.touched.name && formik.errors.name}
              label="Name"
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.name}
            />

            <TextField
              size="small"
              error={
                !!(formik.touched.description && formik.errors.description)
              }
              fullWidth
              helperText={
                formik.touched.description && formik.errors.description
              }
              label="Description"
              name="description"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.description}
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

TermForm.propTypes = {};
