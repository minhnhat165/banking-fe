import {
  Box,
  Card,
  IconButton,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import {
  InformationCircleIcon,
  LockOpenIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/solid';

import PropTypes from 'prop-types';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';

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

export const TransactionsTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    onShowDetails = () => {},
    selected = [],
  } = props;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Account Number</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Transaction Date</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const isSelected = selected.includes(item.id);
                return (
                  <TableRow hover key={item.id} selected={isSelected}>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {item.account.number}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <SeverityPill color={typeMap[item.type].color}>
                        {typeMap[item.type].text}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(item.amount)}
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.transactionDate}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(item.balance)}
                    </TableCell>
                    <TableCell align="center">
                      <SeverityPill color={statusMap[item.status].color}>
                        {statusMap[item.status].text}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction="row"
                        justifyContent="center"
                        spacing={1}
                      >
                        <IconButton
                          onClick={() => onShowDetails(item)}
                          size="small"
                        >
                          <SvgIcon fontSize="small">
                            <InformationCircleIcon />
                          </SvgIcon>
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[1, 5, 10, 25]}
      />
    </Card>
  );
};

TransactionsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
