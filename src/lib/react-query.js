import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

const config = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
  },
};

const ReactQueryProvider = ({ children }) => {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: config }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools position="bottom-left" initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
