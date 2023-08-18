import { Box, Card, Modal } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';

import { SCREENS } from 'src/layouts/dashboard/config';
import { TransactionDetails } from 'src/sections/transaction/transaction-details';
import { TransactionsTable } from 'src/sections/transaction/transactions-table';
import { accountApi } from 'src/services/account-api';
import { transactionApi } from 'src/services/transaction-api';
import { usePermission } from 'src/hooks/use-permission';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

export const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  minHeight: 400,
  overflow: 'hidden',
  bgcolor: 'background.paper',
  boxShadow: 24,
};
const AccountTransactions = ({ accountId }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { data } = useQuery({
    queryKey: ['transactions-account', { page, rowsPerPage, accountId }],
    queryFn: () => accountApi.findTransactions(accountId),
  });

  const items = data?.data || [];

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);
  const [openDetails, setOpenDetails] = useState(false);
  const handleOpenDetails = () => {
    setOpenDetails(true);
  };
  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  const [selected, setSelected] = useState(null);

  return (
    <>
      <Card style={style}>
        <TransactionsTable
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
          <TransactionDetails item={selected} />
        </Box>
      </Modal>
    </>
  );
};

export default AccountTransactions;
