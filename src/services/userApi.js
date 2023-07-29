import axiosClient from 'src/lib/axios';

const baseUrl = '/users';
export const userApi = {
  getAll(params) {
    const url = `${baseUrl}`;
    return axiosClient.get(url, { params });
  },
};
