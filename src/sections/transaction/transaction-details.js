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

import { SeverityPill } from 'src/components/severity-pill';
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/solid';

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
};

export const TransactionDetails = ({ item = {}, style: _style }) => {
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
            <strong>Account number</strong>
            {item?.account.number}
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
            {item?.description}
          </Box>

          {item.bnfAccountId && (
            <Box display="flex" justifyContent="space-between">
              <strong>Beneficiary account number</strong>{' '}
              {item.bnfAccount.number}
            </Box>
          )}
          <Divider />
          <Box display="flex" justifyContent="space-between">
            <strong>Transaction date</strong>{' '}
            {item?.transactionDate
              ? moment(item.transactionDate).format('DD/MM/YYYY')
              : 'N/A'}
          </Box>

          <Box display="flex" justifyContent="space-between">
            <strong>Debit</strong>
            <Typography color="red">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(item.drcrInd)}
            </Typography>
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
      </Card>
    </Card>
  );
};

// Prop Types for the TransactionDetails component
TransactionDetails.propTypes = {};
