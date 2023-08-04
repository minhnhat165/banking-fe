import * as moment from 'moment';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
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
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ACCOUNT } from 'src/constant/account';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { LoadingButton } from '@mui/lab';
import { SeverityPill } from 'src/components/severity-pill';
import { accountApi } from 'src/services/account-api';
import { rolloverPlanApi } from 'src/services/rollover-plan-api';
import { toast } from 'react-hot-toast';
import { useClient } from 'src/hooks/use-client';
import { usePathname } from 'next/navigation';

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

  height: '90%',
  overflow: 'hidden',
  flexDirection: 'row',
  display: 'flex',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export const AccountDetails = ({
  item = {},
  onClose,
  queryKey,
  onSettle,
  style: _style,
}) => {
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
        ..._style,
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
            pt: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflow: 'auto',
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
          {item.type === ACCOUNT.TYPE.DEPOSIT && (
            <Box display="flex" justifyContent="space-between">
              <strong>Interest rate</strong>
              {item?.interestRate?.value}%
            </Box>
          )}
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
          <Accordion>
            <AccordionSummary
              expandIcon={
                <SvgIcon>
                  <ChevronDownIcon />
                </SvgIcon>
              }
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>
                <strong>Customer</strong>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" justifyContent="space-between">
                <strong>Full name</strong>
                {item.customer?.firstName} {item.customer?.lastName}
              </Box>
              <Box display="flex" justifyContent="space-between">
                <strong>Personal ID</strong>
                {item.customer?.pin}
              </Box>
              <Box display="flex" justifyContent="space-between">
                <strong>Email</strong>
                {item.customer?.email}
              </Box>
              <Box display="flex" justifyContent="space-between">
                <strong>Phone</strong>
                {item.customer?.phone}
              </Box>
              <Box display="flex" justifyContent="space-between">
                <strong>Gender</strong>
                {item.customer.gender === 0 ? 'Female' : 'Male'}
              </Box>
              <Box display="flex" justifyContent="space-between">
                <strong>Address</strong>
                {item.customer.address}
              </Box>
              <Box display="flex" justifyContent="space-between">
                <strong>Date of birth</strong>
                {moment(item.customer.dob).format('DD/MM/YYYY')}
              </Box>
            </AccordionDetails>
          </Accordion>
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
      {isShowSettle && (
        <Settlement
          queryKey={queryKey}
          account={item}
          onConfirm={() => {
            onClose && onClose();
            onSettle && onSettle();
          }}
        />
      )}
    </Card>
  );
};

const Settlement = ({ account, onConfirm, queryKey }) => {
  const [selectedRolloverPlan, setSelectedRolloverPlan] = useState(null);
  const { isClient } = useClient();
  const { data } = useQuery({
    queryKey: 'rolloverPlan',
    queryFn: () => {
      return rolloverPlanApi.getAll({ page: 0, limit: 100 });
    },
  });

  const queryClient = useQueryClient();

  const { mutateAsync: settleAccount, isLoading } = useMutation({
    mutationFn: isClient ? accountApi.settleClient : accountApi.settle,
    onSuccess: () => {
      toast.success('Settle account successfully');
      queryClient.invalidateQueries(queryKey);
      onConfirm();
    },
  });
  const rolloverPlans = useMemo(() => {
    const plans = data?.data?.items.filter((item) => {
      if (account.status !== ACCOUNT.STATUS.MATURITY) {
        return (
          item.id.toString() ===
            ACCOUNT.ROLLOVER.TRANSFER_TO_ACCOUNT.toString() ||
          item.id.toString() === ACCOUNT.ROLLOVER.FULL_SETTLEMENT.toString()
        );
      }
      return true;
    });
    if (plans?.length > 0) {
      setSelectedRolloverPlan(plans[0]?.id);
      return plans;
    }
    return [];
  }, [account.status, data?.data?.items]);

  const calResult = useMemo(() => {
    const accountClone = { ...account };
    const totalTime = moment().diff(moment(account.activatedDate), 'M');
    let interestRateApplied = accountClone?.interestRate?.value;
    let interest = 0;
    let total = 0;
    let debit = 0;
    const isMaturity = accountClone.status === ACCOUNT.STATUS.MATURITY;
    if (!isMaturity) {
      interestRateApplied = 0.1;
      switch (accountClone.paymentMethodId) {
        case ACCOUNT.INTEREST_PAYMENT_METHOD.PREPAID:
          debit = accountClone.balance - accountClone.principal;
          total = accountClone.balance;
          break;
        case ACCOUNT.INTEREST_PAYMENT_METHOD.REGULAR:
          let newBalance = accountClone.principal;

          for (let i = 0; i < totalTime; i++) {
            console.log(newBalance * (interestRateApplied / 100));
            newBalance += newBalance * (interestRateApplied / 100);
          }

          if (accountClone.balance < newBalance) {
            newBalance = accountClone.balance;
          }
          debit = accountClone.balance - newBalance;
          total = newBalance;
          interest = newBalance - accountClone.principal;
          break;
        case ACCOUNT.INTEREST_PAYMENT_METHOD.END_OF_TERM:
          interest = calEndOfTermInterest({
            balance: accountClone.principal,
            months: totalTime,
            interestRate: interestRateApplied,
          });
          total = accountClone.principal + interest;
          break;
        default:
          break;
      }
    } else {
      interest = accountClone.balance - accountClone.principal;
      total = accountClone.balance;
      interestRateApplied = accountClone?.interestRate?.value;
    }

    return {
      interestRateApplied,
      debit,
      total,
      totalTime,
      interest,
    };
  }, [account]);

  const handleChange = (event) => {
    setSelectedRolloverPlan(event.target.value);
  };
  const [errorMessage, setErrorMessage] = useState(null);

  const accountNumberRef = useRef(null);
  const handleSettle = async () => {
    try {
      const values = {
        accountId: account.id,
        rolloverId: selectedRolloverPlan,
      };
      if (
        selectedRolloverPlan.toString() ===
        ACCOUNT.ROLLOVER.TRANSFER_TO_ACCOUNT.toString()
      ) {
        const accountNumber = accountNumberRef.current.value;
        if (!accountNumber) {
          setErrorMessage('Please enter account number');
          return;
        }
        if (accountNumber.length !== 16) {
          setErrorMessage('Account number must be 16 digits');
          return;
        }

        if (accountNumber === account.number) {
          setErrorMessage('Account number must be different from current');
          return;
        }

        const res = await accountApi.findByNumber(accountNumber);
        values['bnfAccountId'] = res.data.id;
      }
      if (isClient) {
        values['pin'] = account.pin;
      }
      await settleAccount(values);
    } catch (error) {
      setErrorMessage(
        error?.statusCode === 404 ? 'Account not found' : error?.message,
      );
    }
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
          pt: 0,
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
          {calResult.totalTime} months
        </Box>
        <Box display="flex" justifyContent="space-between">
          <strong>Interest rate</strong>
          {calResult.interestRateApplied}%
        </Box>
        <Divider />
        <Box display="flex" justifyContent="space-between">
          <strong>Interest</strong>
          <Typography color="greenyellow">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(calResult.interest)}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <strong>Debit</strong>
          <Typography color="red">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(calResult.debit)}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <strong>Amount withdrawn </strong>
          <Typography color="green">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(calResult.total)}
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
                <>
                  <TextField
                    inputRef={accountNumberRef}
                    required
                    label="Account number"
                    type="number"
                  />
                  {errorMessage && (
                    <Typography color="red">{errorMessage}</Typography>
                  )}
                </>
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
          <LoadingButton
            loading={isLoading}
            onClick={handleSettle}
            type="submit"
            variant="contained"
          >
            Confirm settlement
          </LoadingButton>
        </CardActions>
      </CardActionArea>
    </Card>
  );
};

// Prop Types for the AccountDetails component
AccountDetails.propTypes = {};

const calEndOfTermInterest = ({ interestRate, balance, months }) => {
  const interest = (balance * interestRate * months) / (12 * 100);
  return interest;
};
