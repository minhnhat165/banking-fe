import axiosClient from 'src/lib/axios';

const baseUrl = '/rollovers';
export const rolloverPlanApi = {
  getAll(params) {
    const url = `${baseUrl}`;
    return axiosClient.get(url, { params });
  },
  update(data) {
    const url = `${baseUrl}/${data.id}`;
    return axiosClient.patch(url, data);
  },
};
