import axiosClient from 'src/lib/axios';

const baseUrl = '/accounts';
export const accountApi = {
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
  findByNumber(number) {
    const url = `${baseUrl}/number/${number}`;
    return axiosClient.get(url);
  },
  check(data) {
    const url = `${baseUrl}/check-register`;
    return axiosClient.post(url, data);
  },
  findByNumberClient(data) {
    const url = `${baseUrl}/client/number`;
    return axiosClient.post(url, data);
  },
  settle(data) {
    const url = `${baseUrl}/settle`;
    return axiosClient.patch(url, data);
  },

  settleClient(data) {
    const url = `${baseUrl}/client/settle`;
    return axiosClient.patch(url, data);
  },

  activate(data) {
    const url = `${baseUrl}/activate`;
    return axiosClient.patch(url, data);
  },
  getOverview() {
    const url = `${baseUrl}/overview`;
    return axiosClient.get(url);
  },

  register(data) {
    const url = `${baseUrl}/register`;
    return axiosClient.post(url, data);
  },
  verifyOtp(data) {
    const url = `${baseUrl}/verify-otp`;
    return axiosClient.post(url, data);
  },
};
