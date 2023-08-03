import axiosClient from 'src/lib/axios';

const baseUrl = '/interest-payments';
export const paymentMethodApi = {
  getAll(params) {
    const url = `${baseUrl}`;
    return axiosClient.get(url, { params });
  },
  update(data) {
    const url = `${baseUrl}/${data.id}`;
    return axiosClient.patch(url, data);
  },
};
