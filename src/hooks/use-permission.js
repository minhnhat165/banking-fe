const { useRouter } = require('next/navigation');
const { useAuth } = require('./use-auth');

export const usePermission = (screenId) => {
  const userPermissions = useAuth().user.permissions || [];
  const permissions = userPermissions.filter(
    (permission) => permission.screenId === screenId,
  );

  const router = useRouter();

  const isHas = permissions && permissions.length > 0;

  if (!isHas) {
    router.push('/not-found');
  }

  const isAll = permissions.some((permission) => permission.permissionId === 1);
  const isCreate = permissions.some(
    (permission) => permission.permissionId === 2,
  );
  const isRead = permissions.some(
    (permission) => permission.permissionId === 3,
  );
  const isUpdate = permissions.some(
    (permission) => permission.permissionId === 4,
  );
  const isDelete = permissions.some(
    (permission) => permission.permissionId === 5,
  );
  return {
    isHas,
    permissions,
    isAll,
    isCreate,
    isRead,
    isUpdate,
    isDelete,
  };
};
