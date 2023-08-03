import * as moment from 'moment';

import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';

import { ACCOUNT } from 'src/constant/account';
import { LoadingButton } from '@mui/lab';
import PropTypes from 'prop-types';
import { SeverityPill } from 'src/components/severity-pill';
import { paymentMethodApi } from 'src/services/payment-method-api';
import { rolloverPlanApi } from 'src/services/rollover-plan-api';
import { useQuery } from '@tanstack/react-query';

const statusMap = {
  0: {
    color: 'warning',
    text: 'Inactive',
  },
  1: {
    color: 'success',
    text: 'Active',
  },
  2: {
    color: 'primary',
    text: 'Maturity',
  },
  3: {
    color: 'error',
    text: 'Closed',
  },
};

const typeMap = {
  0: {
    color: 'info',
    text: 'Checking',
  },
  1: {
    color: 'primary',
    text: 'Deposit',
  },
};

export const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',

  height: '86%',
  overflow: 'hidden',
  flexDirection: 'row',
  display: 'flex',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export const AccountDetails = (props) => {
  const { item = {} } = props;

  const startDate = moment(item?.activatedDate || item?.createdDate);

  const maturityDate = moment(startDate).add(
    item?.interestRate?.term?.value || 0,
    'months',
  );

  const [isShowSettle, setIsShowSettle] = useState(false);
  const showSettle = () => {
    setIsShowSettle(true);
  };

  const hideSettle = () => {
    setIsShowSettle(false);
  };

  const toggleSettle = () => {
    setIsShowSettle(!isShowSettle);
  };

  return (
    <Card
      style={{
        ...style,
      }}
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: 480,
          borderTopRightRadius: isShowSettle ? 0 : 16,
          borderBottomRightRadius: isShowSettle ? 0 : 16,
        }}
      >
        <CardHeader
          sx={{
            textAlign: 'center',
          }}
          title={`Account Details`}
        />
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <strong>Number</strong> {item.number}
          </Box>
          <Box display="flex" justifyContent="space-between">
            <strong>Type</strong> {typeMap[item.type]?.text}
          </Box>
          <Box display="flex" justifyContent="space-between">
            <strong>Status</strong>
            <SeverityPill color={statusMap[item.status]?.color}>
              {statusMap[item.status]?.text}
            </SeverityPill>
          </Box>
          <Divider />

          <Box display="flex" justifyContent="space-between">
            <strong>Activated date</strong>{' '}
            {item?.activatedDate
              ? moment(item.activatedDate).format('DD/MM/YYYY')
              : 'N/A'}
          </Box>

          {item.type === ACCOUNT.TYPE.DEPOSIT && (
            <Box display="flex" justifyContent="space-between">
              <strong>Maturity date</strong>{' '}
              {item.type === 1
                ? maturityDate.format('DD/MM/YYYY')
                : startDate.format('DD/MM/YYYY')}
            </Box>
          )}

          {item.status === ACCOUNT.STATUS.CLOSED && (
            <Box display="flex" justifyContent="space-between">
              <strong>Closed date</strong>{' '}
              {moment(item.closedDate).format('DD/MM/YYYY')}
            </Box>
          )}
          {item?.interestRate?.term && (
            <Box display="flex" justifyContent="space-between">
              <strong>Term</strong>
              {item?.interestRate?.term?.name}
            </Box>
          )}
          {item.type === ACCOUNT.TYPE.DEPOSIT && <Divider />}
          {item.rollover && (
            <Box display="flex" justifyContent="space-between">
              <strong>Rollover</strong>
              {item.rollover.name}
            </Box>
          )}
          {item.paymentMethod && (
            <Box display="flex" justifyContent="space-between">
              <strong>Interest payment</strong>
              {item.paymentMethod.name}
            </Box>
          )}

          <Divider />
          <Box display="flex" justifyContent="space-between">
            <strong>Principal</strong>
            <Typography color="yellowgreen">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(item.principal)}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <strong>Balance</strong>
            <Typography color="green">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(item.balance)}
            </Typography>
          </Box>
        </CardContent>
        {(item.status === ACCOUNT.STATUS.ACTIVATED ||
          item.status === ACCOUNT.STATUS.MATURITY) &&
          parseInt(item.type) === ACCOUNT.TYPE.DEPOSIT && (
            <CardActionArea
              sx={{
                mt: 'auto',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <CardActions>
                <LoadingButton
                  onClick={toggleSettle}
                  type=""
                  variant="contained"
                >
                  {isShowSettle ? 'Close Settlement' : 'Settle Account'}
                </LoadingButton>
              </CardActions>
            </CardActionArea>
          )}
      </Card>
      {isShowSettle && <Settlement account={item} onClose={hideSettle} />}
    </Card>
  );
};

const Settlement = ({ account }) => {
  const [selectedRolloverPlan, setSelectedRolloverPlan] = useState(null);
  const { data } = useQuery({
    queryKey: 'rolloverPlan',
    queryFn: () => {
      return rolloverPlanApi.getAll({ page: 0, limit: 100 });
    },
  });
  const rolloverPlans = useMemo(() => {
    const plans = data?.data?.items || [];
    setSelectedRolloverPlan(plans[0]?.id);
    return plans;
  }, [data]);

  const handleChange = (event) => {
    setSelectedRolloverPlan(event.target.value);
  };
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: 480,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      }}
    >
      <CardHeader
        sx={{
          textAlign: 'center',
        }}
        title={`Settlement`}
      />
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {account.status !== ACCOUNT.STATUS.MATURITY && (
          <Alert severity="warning">
            Your account is not matured yet. The interest can be less than the
            as expected.
          </Alert>
        )}
        <Box display="flex" justifyContent="space-between">
          <strong>Total time</strong>
          {moment().diff(moment(account.activatedDate), 'M')} months
        </Box>
        <Box display="flex" justifyContent="space-between">
          <strong>Interest rate</strong>
          0.1%
        </Box>
        <Divider />
        <Box display="flex" justifyContent="space-between">
          <strong>Total interest</strong>
          <Typography color="greenyellow">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(0)}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <strong>Amount debit</strong>
          <Typography color="red">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(0)}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <strong>Amount withdrawn </strong>
          <Typography color="green">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(0)}
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Rollover method
            </InputLabel>
            <Box display="flex" flexDirection="column" gap={1}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedRolloverPlan}
                label="Rollover method"
                onChange={handleChange}
              >
                {rolloverPlans.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              {parseInt(selectedRolloverPlan) ===
                ACCOUNT.ROLLOVER.TRANSFER_TO_ACCOUNT && (
                <TextField required label="Account number" type="number" />
              )}
            </Box>
          </FormControl>
        </Box>
      </CardContent>
      <CardActionArea
        sx={{
          mt: 'auto',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <CardActions>
          <Button type="submit" variant="contained">
            Confirm settlement
          </Button>
        </CardActions>
      </CardActionArea>
    </Card>
  );
};

// Prop Types for the AccountDetails component
AccountDetails.propTypes = {
  item: PropTypes.shape({
    type: PropTypes.number,
    status: PropTypes.number,
    number: PropTypes.string,
    balance: PropTypes.number,
    // Add more prop types as needed
  }).isRequired,
};
