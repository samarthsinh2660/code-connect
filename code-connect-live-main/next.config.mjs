import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // swcMinify is now default in Next.js 15 and deprecated as a config option
  webpack: (config, { isServer }) => {
    config.experiments = { ...config.experiments, topLevelAwait: true }
    if (!isServer) {
      config.plugins.push(
        new MonacoWebpackPlugin({
          languages: ['javascript', 'typescript', 'python', 'java', 'cpp'],
          filename: 'static/[name].worker.js',
          experimental: {
            optimizeCss: true
          }
        })
      );
    }
    return config;
  },
};

export default nextConfig;
