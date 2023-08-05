import * as React from 'react';

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';

import { AccountPopover } from '../dashboard/account-popover';
import Link from 'next/link';
import { Logo } from 'src/components/logo';
import { useAuth } from 'src/hooks/use-auth';
import { usePopover } from 'src/hooks/use-popover';

function ResponsiveAppBar() {
  const user = useAuth().user;
  const avatar = user?.avatar;
  const accountPopover = usePopover();

  return (
    <AppBar color="inherit" position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/c"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Logo />
          </Typography>
          <Typography
            variant="h5"
            noWrap
            component={Link}
            href="/c"
            sx={{
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'darkslategrey',
              textDecoration: 'none',
            }}
          >
            PTIT Banking
          </Typography>

          <Box sx={{ flexGrow: 0, ml: 'auto' }}>
            {!!user ? (
              <>
                <Avatar
                  onClick={accountPopover.handleOpen}
                  ref={accountPopover.anchorRef}
                  sx={{
                    cursor: 'pointer',
                    height: 40,
                    width: 40,
                  }}
                  src={avatar}
                />
                <AccountPopover
                  anchorEl={accountPopover.anchorRef.current}
                  open={accountPopover.open}
                  onClose={accountPopover.handleClose}
                />
              </>
            ) : (
              <Button
                component={Link}
                href="/auth/login"
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
