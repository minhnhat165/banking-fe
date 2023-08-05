import {
  Avatar,
  Card,
  CardContent,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';

import ArrowDownIcon from '@heroicons/react/24/solid/ArrowDownIcon';
import ArrowUpIcon from '@heroicons/react/24/solid/ArrowUpIcon';
import PropTypes from 'prop-types';
import { UserIcon } from '@heroicons/react/24/solid';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userApi } from 'src/services/user-api';

export const OverviewUser = ({ sx }) => {
  const { data } = useQuery({
    queryKey: 'user-overview',
    queryFn: () => userApi.getOverview(),
  });

  const overview = useMemo(() => {
    return data?.data || {};
  }, [data]);

  const status = useMemo(() => {
    if (overview.status === 0) {
      return (
        <>
          <Stack alignItems="center" direction="row" spacing={0.5}>
            <Typography color="grey" variant="body2">
              {overview.percent}%
            </Typography>
          </Stack>
          <Typography color="text.secondary" variant="caption">
            Since last month
          </Typography>
        </>
      );
    }

    if (overview.status === 1) {
      return (
        <>
          <Stack alignItems="center" direction="row" spacing={0.5}>
            <SvgIcon color={'success'} fontSize="small">
              <ArrowUpIcon />
            </SvgIcon>
            <Typography color="success.main" variant="body2">
              {overview.percent}%
            </Typography>
          </Stack>
          <Typography color="text.secondary" variant="caption">
            Since last month
          </Typography>
        </>
      );
    }
    if (overview.status === -1) {
      return (
        <>
          <Stack alignItems="center" direction="row" spacing={0.5}>
            <SvgIcon color="error" fontSize="small">
              <ArrowDownIcon />
            </SvgIcon>
            <Typography color="error.main" variant="body2">
              {overview.percent}%
            </Typography>
          </Stack>
          <Typography color="text.secondary" variant="caption">
            Since last month
          </Typography>
        </>
      );
    }
  }, [overview]);

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Total Users
            </Typography>
            <Typography variant="h4">{overview.total}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'error.main',
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <UserIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
        <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
          {status}
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewUser.prototypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.string.isRequired,
};
