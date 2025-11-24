module.exports = function override(config) {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        "http": false,
        "https": false,
        "stream": false,
        "zlib": false,
        "url": false
    };
    return config;
};
