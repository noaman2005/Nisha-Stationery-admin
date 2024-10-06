module.exports = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // Exclude Node.js modules from the client bundle
            config.resolve.fallback = {
                child_process: false,
                fs: false,
                dns: false,
                net: false,
                tls: false,
                'timers/promises': false,
            };
        }
        return config;
    },
};