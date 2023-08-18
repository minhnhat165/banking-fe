import {
  Avatar,
  Card,
  CardContent,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';

import Link from 'next/link';

export const OverviewPanel = ({
  sx,
  title,
  subtitle,
  icon,
  color = 'success.main',
  href = '#',
}) => {
  return (
    <Link
      href={href}
      style={{
        textDecoration: 'none',
      }}
    >
      <Card sx={sx}>
        <CardContent
          sx={{
            minHeight: 200,
          }}
        >
          <Stack
            alignItems="flex-start"
            direction="row"
            justifyContent="space-between"
            spacing={3}
          >
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                {subtitle}
              </Typography>
              <Typography variant="h4">{title}</Typography>
            </Stack>
            <Avatar
              sx={{
                backgroundColor: color,
                height: 56,
                width: 56,
              }}
            >
              <SvgIcon>{icon}</SvgIcon>
            </Avatar>
          </Stack>
        </CardContent>
      </Card>
    </Link>
  );
};
