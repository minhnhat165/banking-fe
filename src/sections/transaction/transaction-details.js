import * as moment from 'moment';

import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  SvgIcon,
  Typography,
} from '@mui/material';

import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/solid';
import { SeverityPill } from 'src/components/severity-pill';
import { accountApi } from 'src/services/account-api';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

export const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',

  height: '80%',
  overflow: 'hidden',
  flexDirection: 'row',
  display: 'flex',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const statusMap = {
  0: {
    color: 'error',
    text: 'Failed',
  },
  1: {
    color: 'success',
    text: 'Success',
  },
};

const typeMap = {
  1: {
    color: 'info',
    text: 'Deposit',
  },
  2: {
    color: 'primary',
    text: 'Withdrawal',
  },
  3: {
    color: 'success',
    text: 'Transfer',
  },
  4: {
    color: 'warning',
    text: 'INTEREST',
  },
  5: {
    color: 'error',
    text: 'SETTLEMENT',
  },
  6: {
    color: 'secondary',
    text: 'RENEWAL',
  },
};

export const TransactionDetails = ({ item = {}, style: _style }) => {
  const { receivers, senders } = useMemo(() => {
    const receivers = [];
    const senders = [];
    item.transactionDetails.forEach((detail) => {
      if (detail.isIncrease) {
        receivers.push(detail);
      } else {
        senders.push(detail);
      }
    });
    return {
      receivers,
      senders,
    };
  }, [item]);
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
          <Box display="flex" justifyContent="center">
            <Avatar
              sx={{
                width: 100,
                height: 100,
              }}
            >
              <SvgIcon>
                <ClipboardDocumentCheckIcon />
              </SvgIcon>
            </Avatar>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <strong>Type</strong>
            <SeverityPill color={typeMap[item.type].color}>
              {typeMap[item.type].text}
            </SeverityPill>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <strong>Status</strong>
            <SeverityPill color={statusMap[item.status].color}>
              {statusMap[item.status].text}
            </SeverityPill>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <strong>Description</strong>
            <Typography textAlign="right">{item?.description}</Typography>
          </Box>

          <Divider />
          <Box display="flex" justifyContent="space-between">
            <strong>Transaction date</strong>{' '}
            {item?.transactionDate
              ? moment(item.transactionDate).format('DD/MM/YYYY')
              : 'N/A'}
          </Box>

          <Box display="flex" justifyContent="space-between">
            <strong>Amount</strong>
            <Typography color="yellowgreen">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(item.amount)}
            </Typography>
          </Box>
          {senders.length > 0 && (
            <>
              <Divider />
              <Box display="flex" justifyContent="center">
                <strong>Senders</strong>
              </Box>

              {senders.map((senders) => (
                <AccountDetails key={senders.id} item={senders} />
              ))}
            </>
          )}
          {receivers.length > 0 && (
            <>
              <Divider />
              <Box display="flex" justifyContent="center">
                <strong>Receivers</strong>
              </Box>

              {receivers.map((receiver) => (
                <AccountDetails key={receiver.id} item={receiver} />
              ))}
            </>
          )}
        </CardContent>
      </Card>
    </Card>
  );
};

const AccountDetails = ({ item }) => {
  const { data } = useQuery({
    queryKey: ['account', item.accountId],
    queryFn: () => accountApi.getAll({ id: item.accountId }),
  });
  const account = data?.data?.items[0] || {};

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <strong>Account Number</strong>
        <Typography>{account?.number}</Typography>
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
      {item?.fee > 0 && (
        <Box display="flex" justifyContent="space-between">
          <strong>Fee</strong>
          <Typography color="red">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(item.fee)}
          </Typography>
        </Box>
      )}
    </>
  );
};

// Prop Types for the TransactionDetails component
TransactionDetails.propTypes = {};
