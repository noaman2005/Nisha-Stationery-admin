module.exports = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                child_process: false,
                fs: false,
                dns: false,
            };
        }
        return config;
    },
};