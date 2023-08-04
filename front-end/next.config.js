/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    nextConfig,

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
        ],
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },

    // Autres configurations Webpack

}
