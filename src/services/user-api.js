import axiosClient from 'src/lib/axios';

const baseUrl = '/users';
export const userApi = {
  getAll(params) {
    const url = `${baseUrl}`;
    return axiosClient.get(url, { params });
  },
  update(data) {
    const url = `${baseUrl}/${data.id}`;
    return axiosClient.patch(url, data);
  },
  delete(id) {
    const url = `${baseUrl}/${id}`;
    return axiosClient.delete(url);
  },

  lock(id) {
    const url = `${baseUrl}/${id}/lock`;
    return axiosClient.patch(url);
  },

  unlock(id) {
    const url = `${baseUrl}/${id}/unlock`;
    return axiosClient.patch(url);
  },
};
