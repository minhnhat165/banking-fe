import axiosClient from 'src/lib/axios';

const baseUrl = '/user-permissions';
export const userPermissionApi = {
  getAll(params) {
    const url = `${baseUrl}`;
    return axiosClient.get(url, { params });
  },
  add(data) {
    const url = `${baseUrl}/add`;
    return axiosClient.post(url, data);
  },
  remove(data) {
    const url = `${baseUrl}/remove`;
    return axiosClient.post(url, data);
  },
};
