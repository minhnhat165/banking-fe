import Cookies from "cookies";
import httpProxy from "http-proxy";

export const config = {
  api: {
    bodyParser: false,
  },
};

const proxy = httpProxy.createProxyServer();

export default function handler(req, res) {
  return new Promise(() => {
    // convert cookies to header Authorization
    const cookies = new Cookies(req, res);
    const accessToken = cookies.get("access_token");
    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`;
    }

    // don't send cookies to API server
    req.headers.cookie = "";

    proxy.web(req, res, {
      target: process.env.SERVER_URL,
      changeOrigin: true,
      selfHandleResponse: false,
    });
  });
}
