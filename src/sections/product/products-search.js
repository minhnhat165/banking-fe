import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';

import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const ProductsSearch = () => {
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
    </Card>
  );
};
