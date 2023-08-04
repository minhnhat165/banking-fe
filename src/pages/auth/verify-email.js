import { Box, Button, Stack, SvgIcon, Typography } from '@mui/material';
import {
  CheckCircleIcon,
  CheckIcon,
  CircleStackIcon,
  EllipsisHorizontalIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import Head from 'next/head';
import Link from 'next/link';
import { authApi } from 'src/services/auth-api';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

const Page = () => {
  const params = useSearchParams();
  const token = params.get('token');

  const { isLoading, error, isError } = useQuery({
    queryKey: ['verify-email', { token }],
    queryFn: () => authApi.verifyEmail({ token }),
    enabled: !!token,
  });

  return (
    <>
      <Head>
        <title>Reset Password | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <Box
        sx={{
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%',
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h3">Verify Email</Typography>
              <Box alignItems="center" display="flex">
                <Typography color="text.secondary" variant="h5">
                  {isLoading
                    ? 'Verifying...'
                    : isError
                    ? ' Failed to verify email. Please try again.'
                    : 'Email verified successfully.'}
                </Typography>
                {isLoading ? (
                  <SvgIcon color="primary">
                    <EllipsisHorizontalIcon />
                  </SvgIcon>
                ) : isError ? (
                  <SvgIcon color="error">
                    <XCircleIcon />
                  </SvgIcon>
                ) : (
                  <SvgIcon color="success">
                    <CheckCircleIcon />
                  </SvgIcon>
                )}
              </Box>

              <Link href="/auth/login">
                <Button
                  fullWidth
                  size="large"
                  type="button"
                  variant="contained"
                  sx={{ mt: 3 }}
                >
                  {isError ? 'Try Again' : 'Login'}
                </Button>
              </Link>
            </Stack>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
