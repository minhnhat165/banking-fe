import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import Head from 'next/head';
import { Layout } from 'src/layouts/client/layout';
import { interestRateApi } from 'src/services/interest-rate-api';
import { productApi } from 'src/services/product-api';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

const Page = () => {
  const { data: productData } = useQuery({
    queryKey: ['products'],
    queryFn: () => {
      return productApi.getAll({ page: 0, limit: 100 });
    },
  });

  const products = useMemo(() => {
    const items = productData?.data?.items || [];
    return items;
  }, [productData]);

  return (
    <>
      <Head>
        <title>Account info | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 10,
          px: 10,
        }}
      >
        <Container
          sx={{
            height: '100%',
            background: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            pt: 4,
          }}
          maxWidth="xl"
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Interest rate
          </Typography>
          <TableContainer sx={{ width: 640 }} component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Term </TableCell>
                  <TableCell align="right">Rate</TableCell>
                </TableRow>
              </TableHead>
              {products.map((product) => {
                return (
                  <TableBody key={product.id}>
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        sx={{
                          backgroundColor: 'skyblue',
                        }}
                        component="td"
                      >
                        {product.name}
                      </TableCell>
                    </TableRow>
                    <InterestRateProduct productId={product.id} />
                  </TableBody>
                );
              })}
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <Layout>{page}</Layout>;

const InterestRateProduct = ({ productId }) => {
  const { data: interestRateData } = useQuery({
    queryKey: ['interestRates', productId],
    queryFn: () => {
      return interestRateApi.getAll({
        page: 0,
        limit: 100,
        status: 1,
        productId,
      });
    },
  });
  const interestRates = useMemo(() => {
    const items = interestRateData?.data?.items.sort((a, b) => {
      return a.term.value - b.term.value;
    });
    return items || [];
  }, [interestRateData]);

  return (
    <>
      {interestRates.map((row) => (
        <TableRow
          key={row.id}
          sx={{
            '&:last-child td, &:last-child th': { border: 0 },
          }}
        >
          <TableCell component="th" scope="row">
            {row.term.name}
          </TableCell>
          <TableCell align="right">{row.value}%</TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default Page;
