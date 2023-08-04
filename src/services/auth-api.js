import axiosClient from 'src/lib/axios';

const baseUrl = '/auth';
export const authApi = {
  login({ email, password }) {
    const url = `${baseUrl}/login`;
    return axiosClient.post(url, { email, password });
  },

  register(data) {
    const url = `${baseUrl}/register`;
    return axiosClient.post(url, data);
  },

  logout() {
    const url = `${baseUrl}/logout`;
    return axiosClient.post(url);
  },

  getProfile() {
    const url = `${baseUrl}/profile`;
    return axiosClient.get(url);
  },

  verifyEmail({ token }) {
    const url = `${baseUrl}/verify-email`;
    return axiosClient.post(url, { token });
  },

  forgotPassword({ email }) {
    const url = `${baseUrl}/forgot-password`;
    return axiosClient.post(url, { email });
  },

  resetPassword({ token, password }) {
    const url = `${baseUrl}/reset-password`;
    return axiosClient.post(url, { token, password });
  },

  updateProfile({ firstName, lastName, phone, dob, address }) {
    const url = `${baseUrl}/profile`;
    return axiosClient.patch(url, { firstName, lastName, phone, dob, address });
  },
};
