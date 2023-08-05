import * as moment from 'moment';

import { Avatar, Box, Card, CardContent, CardHeader } from '@mui/material';

import { SeverityPill } from 'src/components/severity-pill';

export const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',

  height: '80%',
  overflow: 'hidden',
  flexDirection: 'row',
  display: 'flex',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const statusMap = {
  0: {
    color: 'warning',
    text: 'Inactive',
  },
  1: {
    color: 'success',
    text: 'Active',
  },
  2: {
    color: 'error',
    text: 'Locked',
  },
};

export const UserDetails = ({ item = {}, style: _style }) => {
  return (
    <Card
      style={{
        ...style,
        ..._style,
      }}
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: 480,
        }}
      >
        <CardHeader
          sx={{
            textAlign: 'center',
          }}
          title={`Account Details`}
        />
        <CardContent
          sx={{
            pt: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflow: 'auto',
          }}
        >
          <Box display="flex" justifyContent="center">
            <Avatar
              src={item?.avatar}
              sx={{
                width: 100,
                height: 100,
              }}
            />
          </Box>
          <Box display="flex" justifyContent="space-between">
            <strong>Full name</strong>
            {item?.firstName} {item?.lastName}
          </Box>
          <Box display="flex" justifyContent="space-between">
            <strong>Status</strong>
            <SeverityPill color={statusMap[item.status]?.color}>
              {statusMap[item.status]?.text}
            </SeverityPill>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <strong>Email</strong>
            {item?.email}
          </Box>
          <Box display="flex" justifyContent="space-between">
            <strong>Phone</strong>
            {item?.phone}
          </Box>
          <Box display="flex" justifyContent="space-between">
            <strong>Gender</strong>
            {item.gender === 0 ? 'Female' : 'Male'}
          </Box>
          <Box display="flex" justifyContent="space-between">
            <strong>Address</strong>
            {item.address}
          </Box>
          <Box display="flex" justifyContent="space-between">
            <strong>Date of birth</strong>
            {moment(item.dob).format('DD/MM/YYYY')}
          </Box>
        </CardContent>
      </Card>
    </Card>
  );
};

// Prop Types for the UserDetails component
UserDetails.propTypes = {};
