import {
  Box,
  Divider,
  MenuItem,
  MenuList,
  Popover,
  Typography,
} from '@mui/material';

import PropTypes from 'prop-types';
import { useAuth } from 'src/hooks/use-auth';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open } = props;
  const router = useRouter();
  const auth = useAuth();
  const user = auth.user;

  const handleSignOut = useCallback(() => {
    onClose?.();
    router.push('/auth/login');
    setTimeout(() => {
      auth.signOut();
    }, 1000);
  }, [onClose, auth, router]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom',
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        <Typography variant="overline">Account</Typography>
        <Typography color="text.secondary" variant="body2">
          {user?.firstName + ' ' + user?.lastName}
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: '8px',
          '& > *': {
            borderRadius: 1,
          },
        }}
      >
        {/* profile item */}
        <MenuItem
          onClick={() => {
            router.push('/profile');
            onClose?.();
          }}
        >
          Profile
        </MenuItem>
        {/* sign out item */}

        <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};
