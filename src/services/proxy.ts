import type { NextApiRequest, NextApiResponse } from "next";

import { createProxyMiddleware } from "http-proxy-middleware";
import type { Options } from "http-proxy-middleware";

const TOKEN = process.env.NEXT_PUBLIC_SHIPPING_TOKEN;

export const config = {
  api: {
    bodyParser: false,
  },
};

const proxyOptions: Options = {
  target: process.env.NEXT_PUBLIC_SHIPPING_BASE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/api/proxy": "",
  },
  secure: true,
};

const proxy = createProxyMiddleware({
  ...proxyOptions,
  // @ts-expect-error: onProxyReq is supported at runtime but not in type
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader("Token", TOKEN || "");
  },
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return proxy(req, res);
}
