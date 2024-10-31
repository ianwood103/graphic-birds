const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), "chrome-aws-lambda"];
    }
    return config;
  },
};

export default nextConfig;
