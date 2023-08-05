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
import {
  InformationCircleIcon,
  LockClosedIcon,
  LockOpenIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';

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
  0: 'Inactive',
  1: 'Active',
  2: 'locked',
};

export const UsersTable = (props) => {
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
    onLock = () => {},
    onUnlock = () => {},
    onPermission = () => {},
    allowEdit = false,
    allowDelete = false,
    onShowDetails = () => {},
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
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const isSelected = selected.includes(item.id);
                return (
                  <TableRow hover key={item.id} selected={isSelected}>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar src={item.avatar}>
                          {getInitials(item.name)}
                        </Avatar>
                        <Typography variant="subtitle2">
                          {item.lastName + ' ' + item.firstName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.address}</TableCell>
                    <TableCell>{item.phone}</TableCell>
                    <TableCell align="center">
                      <SeverityPill color={statusMap[item.status]}>
                        {userStatusMap[item.status]}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction="row"
                        justifyContent="center"
                        spacing={1}
                      >
                        {allowEdit && (
                          <IconButton onClick={() => onEdit(item)} size="small">
                            <SvgIcon fontSize="small">
                              <PencilSquareIcon />
                            </SvgIcon>
                          </IconButton>
                        )}
                        {allowDelete && (
                          <IconButton
                            onClick={() => onDelete(item.id)}
                            size="small"
                          >
                            <SvgIcon fontSize="small">
                              <TrashIcon />
                            </SvgIcon>
                          </IconButton>
                        )}
                        {allowEdit && (
                          <IconButton
                            onClick={() =>
                              item.status === 2
                                ? onUnlock(item.id)
                                : onLock(item.id)
                            }
                            size="small"
                          >
                            <SvgIcon fontSize="small">
                              {item.status === 2 ? (
                                <LockClosedIcon />
                              ) : (
                                <LockOpenIcon />
                              )}
                            </SvgIcon>
                          </IconButton>
                        )}
                        {allowEdit && (
                          <IconButton
                            onClick={() => onPermission(item)}
                            size="small"
                          >
                            <SvgIcon fontSize="small">
                              <ShieldCheckIcon />
                            </SvgIcon>
                          </IconButton>
                        )}

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
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onLock: PropTypes.func,
  onUnlock: PropTypes.func,
  onPermission: PropTypes.func,
};
