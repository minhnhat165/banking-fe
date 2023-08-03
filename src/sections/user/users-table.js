import {
  Avatar,
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
import { LockOpenIcon, PencilSquareIcon } from '@heroicons/react/24/solid';

import PropTypes from 'prop-types';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';
import { getInitials } from 'src/utils/get-initials';

const statusMap = {
  0: 'warning',
  1: 'success',
  2: 'error',
};

const userStatusMap = {
  0: 'Pending',
  1: 'Active',
  2: 'Blocked',
};

const roleMap = {
  0: 'Admin',
  1: 'User',
};

export const UsersTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Role</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer) => {
                const isSelected = selected.includes(customer.id);
                return (
                  <TableRow hover key={customer.id} selected={isSelected}>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar src={customer.avatar}>
                          {getInitials(customer.name)}
                        </Avatar>
                        <Typography variant="subtitle2">
                          {customer.lastName + ' ' + customer.firstName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.address}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell align="center">
                      <SeverityPill color={statusMap[customer.status]}>
                        {userStatusMap[customer.status]}
                      </SeverityPill>
                    </TableCell>
                    <TableCell align="center">
                      <SeverityPill color={statusMap[customer.roleId]}>
                        {roleMap[customer.roleId]}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction="row"
                        justifyContent="center"
                        spacing={1}
                      >
                        <IconButton size="small">
                          <SvgIcon fontSize="small">
                            <PencilSquareIcon />
                          </SvgIcon>
                        </IconButton>
                        <IconButton size="small">
                          <SvgIcon fontSize="small">
                            <LockOpenIcon />
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

UsersTable.propTypes = {
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
