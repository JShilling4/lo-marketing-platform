module.exports = {
    css: {
        loaderOptions: {
            scss: {
                data: `
                    @import "@/scss/utility/_variables.scss";
                    @import "@/scss/utility/_mixins.scss";
                    @import "@/scss/utility/_animations.scss";
                `
                // sourceMap: true
            }
        }
        // sourceMap: true
    },
    configureWebpack: {
        resolve: {
            extensions: [".sass", ".scss", ".css", ".js", ".json"]
        },
        devtool: "source-map"
    }
};
