import { defineConfig } from '@rspack/cli';
import { DefinePlugin, rspack, type SwcLoaderOptions } from '@rspack/core';
import Dotenv from 'dotenv-webpack';
import fs from "node:fs";

const isDev = process.env.NODE_ENV === 'development';

function getEnvPath(): string {
  let envPath = './wwwroot/.env';
  if(isDev) {
    const devPath = './wwwroot/.env.development';
    if(fs.existsSync(devPath)) {
      envPath = devPath;
    }
  }

  return envPath;
}

export default defineConfig({
  mode: isDev ? 'development' : 'production',
  entry: {
    script: './wwwroot/script.ts',
  },
  target: ['browserslist:last 2 versions, > 0.2%, not dead, Firefox ESR'],
  resolve: {
    extensions: ['...', '.ts'],
  },
  output: {
    path: './Elin.Plugin.Main/@Assets/wwwroot',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        type: 'css/auto',
      },
      {
        test: /\.svg$/,
        type: 'asset',
      },
      {
        test: /\.(?:js|mjs|cjs|ts|mts|cts)$/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              detectSyntax: 'auto',
            } satisfies SwcLoaderOptions,
          },
        ],
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './wwwroot/index.html',
    }),
    new Dotenv({
      path: getEnvPath(),
    })
  ],
});
