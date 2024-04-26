/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: process.env.NODE_ENV === 'production' ? '/md2csv' : '',
  basePath: '/md2csv',
  output: "export",
  reactStrictMode: true,
};

export default nextConfig;
