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
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import { customerApi } from 'src/services/customer-api';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

export const OverviewTotalCustomers = ({ sx }) => {
  const { data } = useQuery({
    queryKey: 'customers-overview',
    queryFn: () => customerApi.getOverview(),
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
              Total Customers
            </Typography>
            <Typography variant="h4">{overview.total}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'success.main',
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <UsersIcon />
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

OverviewTotalCustomers.propTypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  value: PropTypes.string.isRequired,
  sx: PropTypes.object,
};
