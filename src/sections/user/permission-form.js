import {
  Card,
  CardContent,
  CardHeader,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import {
  CheckBadgeIcon,
  CreditCardIcon,
  MagnifyingGlassIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/solid';

import { PermissionCard } from './permission-card';
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

export const PermissionForm = () => {
  const userId = useAuth().user.id || '';
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
              screenId={1}
              title="Register"
              subtitle="Banking account"
              icon={<CreditCardIcon />}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid lg={4}>
            <PermissionCard
              userId={userId}
              screenId={2}
              title="Interest Rate"
              icon={<ReceiptPercentIcon />}
              sx={{ height: '100%' }}
              color="primary.main"
            />
          </Grid>
          <Grid lg={4}>
            <PermissionCard
              userId={userId}
              screenId={3}
              title="Active"
              icon={<CheckBadgeIcon />}
              sx={{ height: '100%' }}
              color="info.main"
            />
          </Grid>
          <Grid lg={4}>
            <PermissionCard
              userId={userId}
              screenId={4}
              title="Access"
              icon={<MagnifyingGlassIcon />}
              sx={{ height: '100%' }}
              color="info.main"
            />
          </Grid>
          <Grid lg={4}>
            <PermissionCard
              userId={userId}
              screenId={5}
              title="Access"
              icon={<MagnifyingGlassIcon />}
              sx={{ height: '100%' }}
              color="info.main"
            />
          </Grid>
          <Grid lg={4}>
            <PermissionCard
              userId={userId}
              screenId={6}
              title="Access"
              icon={<MagnifyingGlassIcon />}
              sx={{ height: '100%' }}
              color="info.main"
            />
          </Grid>
          <Grid lg={4}>
            <PermissionCard
              userId={userId}
              screenId={7}
              title="Access"
              icon={<MagnifyingGlassIcon />}
              sx={{ height: '100%' }}
              color="info.main"
            />
          </Grid>
          <Grid lg={4}>
            <PermissionCard
              userId={userId}
              screenId={8}
              title="Access"
              icon={<MagnifyingGlassIcon />}
              sx={{ height: '100%' }}
              color="info.main"
            />
          </Grid>
          <Grid lg={4}>
            <PermissionCard
              userId={userId}
              screenId={9}
              title="Access"
              icon={<MagnifyingGlassIcon />}
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
