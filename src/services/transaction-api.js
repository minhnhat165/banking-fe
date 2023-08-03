import axiosClient from 'src/lib/axios';

const baseUrl = '/transactions';
export const transactionApi = {
  getAll(params) {
    const url = `${baseUrl}`;
    return axiosClient.get(url, { params });
  },
};
