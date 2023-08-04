import { usePathname } from 'next/navigation';

export const useClient = () => {
  const pathname = usePathname();
  const isClient = pathname.split('/')[1] === 'c';
  return {
    isClient,
  };
};
