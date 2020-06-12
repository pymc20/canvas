module.exports = {
    devIndicators: {
        autoPrerender: false,
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.node = {
                fs: 'empty',
            }
        }
        return config
    },
}
