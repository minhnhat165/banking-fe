const { useRouter } = require('next/navigation');
const { useAuth } = require('./use-auth');

export const usePermission = (screenId) => {
  const userPermissions = useAuth().user.permissions || [];
  const hasPermission = userPermissions.find(
    (permission) => permission.screenId === screenId,
  );

  const router = useRouter();

  if (!hasPermission) {
    router.push('/not-found');
  }

  return !!hasPermission;
};
