import axiosClient from 'src/lib/axios';

const baseUrl = '/products';
export const productApi = {
  getAll(params) {
    const url = `${baseUrl}`;
    return axiosClient.get(url, { params });
  },

  create(data) {
    const url = `${baseUrl}`;
    return axiosClient.post(url, data);
  },

  update(data) {
    const url = `${baseUrl}/${data.id}`;
    return axiosClient.patch(url, data);
  },
  delete(id) {
    const url = `${baseUrl}/${id}`;
    return axiosClient.delete(url);
  },
};
