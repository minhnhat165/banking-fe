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
} from '@mui/material';
import {
  InformationCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';

import PropTypes from 'prop-types';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';

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
    color: 'secondary',
    text: 'Expired',
  },
};

export const InterestRatesTable = (props) => {
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
  } = props;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Index</TableCell>
                <TableCell align="center">Rate</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Term</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => {
                const isSelected = selected.includes(item.id);
                return (
                  <TableRow hover key={item.id} selected={isSelected}>
                    <TableCell align="center">
                      {index + 1 + page * rowsPerPage}
                    </TableCell>
                    <TableCell align="center">{item.value}%</TableCell>

                    <TableCell align="center">
                      <SeverityPill color={statusMap[item.status].color}>
                        {statusMap[item.status].text}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>
                      {item?.term?.name ? item.term.name : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction="row"
                        justifyContent="center"
                        spacing={1}
                      >
                        <IconButton onClick={() => onEdit(item)} size="small">
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
                        <IconButton size="small">
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

InterestRatesTable.propTypes = {
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
};
