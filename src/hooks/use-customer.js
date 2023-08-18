import { useRouter } from 'next/navigation';

export const useCustomer = (required = false) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const router = useRouter();
  if (required && !user) {
    router.push('/c/auth/login');
  }
  return {
    user,
  };
};
