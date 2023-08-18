import { Box, Card, Modal } from '@mui/material';
import { useCallback, useState } from 'react';

import { AccountDetails } from '../bank-account/account-details';
import { AccountsTable } from '../bank-account/accounts-table';
import { accountApi } from 'src/services/account-api';
import { useQuery } from '@tanstack/react-query';

export const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  overflow: 'hidden',
  bgcolor: 'background.paper',
  boxShadow: 24,
};
const CustomerAccounts = ({ customerId }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const key = ['accounts-customer', { page, rowsPerPage, customerId }];

  const { data } = useQuery({
    queryKey: key,
    queryFn: () =>
      accountApi.getAll({
        page: page,
        limit: rowsPerPage,
        customerId: customerId,
      }),
  });

  const items = data?.data.items || [];

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const [selected, setSelected] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const handleOpenDetails = () => {
    setOpenDetails(true);
  };
  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  return (
    <>
      <Card style={style}>
        <AccountsTable
          count={data?.data?.total || 0}
          items={items}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          onShowDetails={(item) => {
            setSelected(item);
            handleOpenDetails();
          }}
        />
      </Card>

      <Modal open={openDetails} onClose={handleCloseDetails}>
        <Box>
          <AccountDetails
            queryKey={key}
            item={selected}
            onClose={handleCloseDetails}
          />
        </Box>
      </Modal>
    </>
  );
};

export default CustomerAccounts;
