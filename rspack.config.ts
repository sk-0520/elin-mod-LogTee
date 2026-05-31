import fs from 'node:fs';
import { defineConfig } from '@rspack/cli';
import { rspack, type SwcLoaderOptions } from '@rspack/core';
import PreactRefreshPlugin from '@rspack/plugin-preact-refresh';
import Dotenv from 'dotenv-webpack';
import z from 'zod';

const isDev = process.env.NODE_ENV === 'development';

function getEnvPath(): string {
	let envPath = './wwwroot/.env';
	if (isDev) {
		const devPath = './wwwroot/.env.development';
		if (fs.existsSync(devPath)) {
			envPath = devPath;
		}
	}

	return envPath;
}

const PluginDefineSchema = z.object({
	package: z.object({
		title: z.string(),
	}),
	mod: z.object({
		version: z.string(),
	}),
});
type PluginDefine = z.infer<typeof PluginDefineSchema>;

function loadPluginDefine(): PluginDefine {
	const pluginDefineJson = fs.readFileSync('./Plugin.json', 'utf-8');
	const pluginDefine = JSON.parse(pluginDefineJson);

	return PluginDefineSchema.parse(pluginDefine);
}

const pluginDefine = loadPluginDefine();

export default defineConfig({
	mode: isDev ? 'development' : 'production',
	entry: {
		script: './wwwroot/script.ts',
	},
	target: ['browserslist:last 2 versions, > 0.2%, not dead, Firefox ESR'],
	resolve: {
		extensions: ['...', '.ts', '.tsx'],
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
				test: /\.tsx$/,
				use: {
					loader: 'builtin:swc-loader',
					options: {
						detectSyntax: 'auto',
						jsc: {
							externalHelpers: true,
							experimental: {
								plugins: [
									[
										'@swc/plugin-prefresh', // enable prefresh specific transformation
										{
											library: ['preact-like-framework'], // the customizable preact name, default is `["preact", "preact/compat", "react"]`
										},
									],
								],
							},
							transform: {
								react: {
									runtime: 'automatic',
									development: isDev,
									refresh: isDev,
								},
							},
						},
					},
				},
				type: 'javascript/auto',
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
	devServer: {
		hot: true,
		open: true,
		client: {
			webSocketURL: {
				hostname: '0.0.0.0',
				pathname: '/ws',
				password: 'dev-server',
				port: 8080,
				protocol: 'ws',
				username: 'rspack',
			},
		},
	},
	plugins: [
		isDev && new PreactRefreshPlugin({}),
		isDev && new rspack.HotModuleReplacementPlugin(),
		new rspack.HtmlRspackPlugin({
			template: './wwwroot/index.html',
			templateParameters: {
				package_title: pluginDefine.package.title,
				mod_version: pluginDefine.mod.version,
			},
		}),
		new Dotenv({
			path: getEnvPath(),
		}),
	],
});
