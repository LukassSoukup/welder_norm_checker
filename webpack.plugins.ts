// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import type ICSPHtmlWebpackPlugin from "csp-html-webpack-plugin";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CSPHtmlWebpackPlugin: typeof ICSPHtmlWebpackPlugin = require('csp-html-webpack-plugin');

const cspConfig = {
  'default-src': ["'self'", "'unsafe-inline'", 'data:'],
  'connect-src': ["'self'", 'https://api.apilayer.com']
};
export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
];
