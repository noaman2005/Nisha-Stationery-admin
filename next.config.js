module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude Node.js modules from the client bundle
      config.resolve.fallback = {
        net: false,
        tls: false,
        'timers/promises': false,
      };
    }
    return config;
  },
};
