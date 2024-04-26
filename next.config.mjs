/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NODE_ENV === 'production' ? '/md2csv' : '',
  output: "export",
  reactStrictMode: true,
};

export default nextConfig;
