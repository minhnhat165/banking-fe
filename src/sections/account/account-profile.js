import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from '@mui/material';

import { useAuth } from 'src/hooks/use-auth';

export const AccountProfile = () => {
  const user = useAuth().user || {};
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Avatar
            src={user?.avatar}
            sx={{
              height: 80,
              mb: 2,
              width: 80,
            }}
          />
          <Typography gutterBottom variant="h5">
            {user.name || user.firstName + ' ' + user.lastName}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {user.email || user.phone}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {user.address}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text">
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
};
