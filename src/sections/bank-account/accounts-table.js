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
  CreditCardIcon,
  InformationCircleIcon,
  LockOpenIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';

import PropTypes from 'prop-types';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';
import { toast } from 'react-hot-toast';

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

export const AccountsTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    onDelete = () => {},
    onEdit = () => {},
    onShowDetails = () => {},
  } = props;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Number</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell>Rollover</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const isSelected = selected.includes(item.id);
                return (
                  <TableRow hover key={item.id} selected={isSelected}>
                    <TableCell>
                      <Typography variant="subtitle2">{item.number}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <SeverityPill color={typeMap[item.type].color}>
                        {typeMap[item.type].text}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      {item?.paymentMethod ? item.paymentMethod.name : 'N/A'}
                    </TableCell>
                    <TableCell align="center">
                      <SeverityPill color={statusMap[item.status].color}>
                        {statusMap[item.status].text}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      {item?.rollover ? item.rollover.name : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {item.customer.lastName + ' ' + item.customer.firstName}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Stack
                        direction="row"
                        justifyContent="center"
                        spacing={1}
                      >
                        <IconButton
                          onClick={() => {
                            if (item.status !== 0) {
                              toast.error('Account is not inactive');
                              return;
                            }
                            onEdit(item);
                          }}
                          size="small"
                        >
                          <SvgIcon fontSize="small">
                            <PencilSquareIcon />
                          </SvgIcon>
                        </IconButton>
                        <IconButton
                          onClick={() => onDelete(item.id)}
                          size="small"
                        >
                          <SvgIcon fontSize="small">
                            <TrashIcon />
                          </SvgIcon>
                        </IconButton>
                        <IconButton
                          onClick={() => onShowDetails(item)}
                          size="small"
                        >
                          <SvgIcon fontSize="small">
                            <InformationCircleIcon />
                          </SvgIcon>
                        </IconButton>
                        <IconButton size="small">
                          <SvgIcon fontSize="small">
                            <CreditCardIcon />
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

AccountsTable.propTypes = {
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
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onShowDetails: PropTypes.func,
};
