import {
  Box,
  Button,
  Card,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Popover,
  Select,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import { useId, useState } from 'react';

import { FunnelIcon } from '@heroicons/react/24/solid';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { USER } from 'src/constant/user';
import { useRouter } from 'next/navigation';

export const UsersSearch = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const [status, setStatus] = useState(-1);

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const router = useRouter();

  const handleSearch = (event) => {
    const value = event.target.value;
    const routeObject = {
      pathname: router.pathname,
    };
    if (value) {
      routeObject.query = { q: value };
    } else {
      routeObject.query = {};
    }
    router.push(routeObject);
  };

  const handleFilter = () => {
    const routeObject = {
      pathname: router.pathname,
    };
    if (status !== -1) {
      routeObject.query = { status: status };
    } else {
      routeObject.query = {};
    }
    router.push(routeObject);

    handleClose();
  };

  return (
    <Card sx={{ p: 1, display: 'flex', gap: 1 }}>
      <OutlinedInput
        onChange={handleSearch}
        defaultValue=""
        fullWidth
        placeholder="Search"
        startAdornment={
          <InputAdornment position="start">
            <SvgIcon color="action" fontSize="small">
              <MagnifyingGlassIcon />
            </SvgIcon>
          </InputAdornment>
        }
        sx={{ maxWidth: 360 }}
      />
      <Box ml="auto">
        <IconButton
          aria-describedby={id}
          variant="contained"
          onClick={handleClick}
          size="large"
        >
          <SvgIcon>
            <FunnelIcon />
          </SvgIcon>
        </IconButton>
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box
          sx={{
            minWidth: 300,
            p: 2,
          }}
        >
          <Stack spacing={1}>
            <FormControl fullWidth>
              <InputLabel id="status">Status</InputLabel>
              <Select
                labelId="status"
                id="demo-simple-select"
                value={status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value={-1}>All</MenuItem>
                <MenuItem value={USER.STATUS.INACTIVATED}>Inactivated</MenuItem>
                <MenuItem value={USER.STATUS.ACTIVATED}>Activated</MenuItem>
                <MenuItem value={USER.STATUS.LOCKED}>Locked</MenuItem>
              </Select>
            </FormControl>
            {/* <TextField fullWidth label="Search" variant="outlined" />
            <DateFilter />
            <NumberFilter /> */}
            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={handleFilter}
            >
              Apply
            </Button>
          </Stack>
        </Box>
      </Popover>
    </Card>
  );
};

const DateFilter = () => {
  const id = useId();
  const [age, setAge] = useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  return (
    <Box>
      <Typography sx={{ alignSelf: 'center' }}>Date</Typography>
      <Stack direction="row" spacing={1}>
        <TextField
          id="date"
          label="From"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="date"
          label="To"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TypeFilter />
      </Stack>
    </Box>
  );
};

const TypeFilter = () => {
  const id = useId();
  const [age, setAge] = useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  return (
    <FormControl
      sx={{
        minWidth: 80,
      }}
    >
      <InputLabel id={id}>Age</InputLabel>
      <Select
        labelId={id}
        id="s"
        value={age}
        label="Type"
        onChange={handleChange}
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
};

const NumberFilter = () => {
  const id = useId();
  const [age, setAge] = useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  return (
    <Box>
      <Typography sx={{ alignSelf: 'center' }}>Number</Typography>
      <Stack direction="row" gap={1}>
        <TextField
          sx={{ maxWidth: 154 }}
          id="date"
          type="Number"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          sx={{ maxWidth: 154 }}
          id="date"
          label="To"
          type="Number"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TypeFilter />
      </Stack>
    </Box>
  );
};
