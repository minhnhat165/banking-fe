import {
  ArrowPathRoundedSquareIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CreditCardIcon,
  DocumentDuplicateIcon,
  MagnifyingGlassIcon,
  ReceiptPercentIcon,
  ShoppingBagIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/24/solid';
import {
  Card,
  CardContent,
  CardHeader,
  Unstable_Grid2 as Grid,
} from '@mui/material';

import { PermissionCard } from './permission-card';
import { SCREENS } from 'src/layouts/dashboard/config';
import { useAuth } from 'src/hooks/use-auth';

export const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  height: '90%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export const PermissionForm = ({ userId }) => {
  return (
    <Card style={style}>
      <CardHeader title="Permission" />
      <CardContent
        sx={{
          background: 'transparent',
          height: 600,
          flexGrow: 1,
          overflow: 'auto',
        }}
      >
        <Grid container overflow="auto" spacing={2}>
          <Grid lg={4}>
            <PermissionCard
              userId={userId}
              screenId={SCREENS.OVERVIEW}
              title="Overview"
              icon={<ChartBarIcon />}
              sx={{ height: '100%' }}
              color="info.main"
            />
          </Grid>
          <Grid lg={4}>
            <PermissionCard
              userId={userId}
              screenId={SCREENS.USERS}
              title="Users"
              icon={<UserIcon />}
              sx={{ height: '100%' }}
              color="info.main"
            />
          </Grid>
          <Grid lg={4}>
            <PermissionCard
              userId={userId}
              screenId={SCREENS.PRODUCTS}
              title="Products"
              icon={<ShoppingBagIcon />}
              sx={{ height: '100%' }}
              color="info.main"
            />
          </Grid>
          <Grid lg={4}>
            <PermissionCard
              userId={userId}
              screenId={SCREENS.TERMS}
              title="Terms"
              icon={<ClockIcon />}
              sx={{ height: '100%' }}
              color="info.main"
            />
          </Grid>
          <Grid lg={4}>
            <PermissionCard
              userId={userId}
              screenId={SCREENS.INTEREST_RATES}
              title="Interest Rates"
              icon={<ReceiptPercentIcon />}
              sx={{ height: '100%' }}
              color="info.main"
            />
          </Grid>
          <Grid lg={4}>
            <PermissionCard
              userId={userId}
              screenId={SCREENS.PAYMENT_METHODS}
              title="Payment Methods"
              icon={<DocumentDuplicateIcon />}
              sx={{ height: '100%' }}
              color="info.main"
            />
          </Grid>
          <Grid lg={4}>
            <PermissionCard
              userId={userId}
              screenId={SCREENS.ROLLOVER_PLANS}
              title="Rollover Plans"
              icon={<ArrowPathRoundedSquareIcon />}
              sx={{ height: '100%' }}
              color="info.main"
            />
          </Grid>
          <Grid lg={4}>
            <PermissionCard
              userId={userId}
              screenId={SCREENS.CUSTOMERS}
              title="Customers"
              icon={<UsersIcon />}
              sx={{ height: '100%' }}
              color="info.main"
            />
          </Grid>
          <Grid lg={4}>
            <PermissionCard
              userId={userId}
              screenId={SCREENS.ACCOUNTS}
              title="Accounts"
              icon={<CreditCardIcon />}
              sx={{ height: '100%' }}
              color="info.main"
            />
          </Grid>
          <Grid lg={4}>
            <PermissionCard
              userId={userId}
              screenId={SCREENS.TRANSACTIONS}
              title="Transactions"
              icon={<ClipboardDocumentCheckIcon />}
              sx={{ height: '100%' }}
              color="info.main"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

PermissionForm.propTypes = {};
