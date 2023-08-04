import {
  Avatar,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';

import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { userPermissionApi } from 'src/services/user-permission-api';

export const PermissionCard = ({
  sx,
  title,
  icon,
  color = 'success.main',
  screenId,
  userId,
}) => {
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState({
    2: false,
    3: false,
    4: false,
    5: false,
  });
  useQuery({
    queryKey: ['userPermission', { screenId, userId }],
    queryFn: () => userPermissionApi.getAll({ screenId, userId }),
    onSuccess: (data) => {
      const updatedCheckedItems = {};
      for (const item of data.data.items) {
        if (item.permissionId === 1) {
          setIsSelectAll(true);
        } else {
          updatedCheckedItems[item.permissionId] = true;
        }
      }
      setCheckedItems(updatedCheckedItems);
    },
  });

  const { mutate: add } = useMutation({
    mutationFn: userPermissionApi.add,
    onSuccess: (data) => {
      toast.success('Add permission successfully', {
        position: 'top-center',
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        position: 'top-center',
      });
    },
  });
  const { mutate: remove } = useMutation({
    mutationFn: userPermissionApi.remove,
    onSuccess: (data) => {
      toast.success('Remove permission successfully', {
        position: 'top-center',
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        position: 'top-center',
      });
    },
  });

  const handleChange = (event) => {
    const permissionId = parseInt(event.target.value);
    const isChecked = event.target.checked;

    if (permissionId === 1) {
      setIsSelectAll(isChecked);
      const updatedCheckedItems = {};
      if (isChecked) {
        for (const key in checkedItems) {
          updatedCheckedItems[key] = !isChecked;
        }

        setCheckedItems(updatedCheckedItems);
      }
    } else {
      setCheckedItems((prevCheckedItems) => ({
        ...prevCheckedItems,
        [permissionId]: isChecked,
      }));
    }

    if (isChecked) {
      add({ screenId, userId, permissionId });
    } else {
      remove({ screenId, userId, permissionId });
    }
  };
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
        <Stack spacing={1}>
          <FormGroup
            sx={{
              flexDirection: 'row',
            }}
          >
            <PermissionCheckbox
              value={1}
              checked={isSelectAll}
              onChange={handleChange}
              label="All"
            />
            <PermissionCheckbox
              value={2}
              checked={checkedItems[2]}
              onChange={handleChange}
              disabled={isSelectAll}
              label="Create"
            />
            <PermissionCheckbox
              value={3}
              checked={checkedItems[3]}
              onChange={handleChange}
              disabled={isSelectAll}
              label="Read"
            />
            <PermissionCheckbox
              value={4}
              checked={checkedItems[4]}
              onChange={handleChange}
              disabled={isSelectAll}
              label="Update"
            />
            <PermissionCheckbox
              value={5}
              checked={checkedItems[5]}
              onChange={handleChange}
              disabled={isSelectAll}
              label="Delete"
            />
          </FormGroup>
        </Stack>
      </CardContent>
    </Card>
  );
};

const PermissionCheckbox = ({ value, checked, disabled, onChange, label }) => (
  <FormControlLabel
    control={<Checkbox value={value} checked={checked} onChange={onChange} />}
    label={label}
    disabled={disabled}
  />
);
