// borrow from
// https://github.com/facebook/create-react-app/blob/7e4949a20fc828577fb7626a3262832422f3ae3b/packages/react-scripts/config/env.js

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import chalk from 'chalk';

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const NODE_ENV = process.env.NODE_ENV;

let raw: Record<string, string> = {};
const directories = [__dirname, path.join(__dirname, '..')];

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  //
  '.env',
  `.env.local`,
  `.env.${NODE_ENV}`,
  `.env.${NODE_ENV}.local`
].flatMap(filename => directories.map(dir => path.join(dir, filename)));

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
dotenvFiles.forEach(pathname => {
  if (fs.existsSync(pathname)) {
    const { parsed } = dotenv.config({
      path: pathname
    });
    raw = { ...raw, ...parsed };
  }
});

function getEnv<T extends Record<string, unknown>>(map: T) {
  const result = { ...raw } as Record<string, unknown>;

  for (const key in map) {
    const option: { default?: unknown; required?: boolean } =
      typeof map[key] === 'object' ? map[key] : { default: map[key] };

    // try to convert string into number or boolean
    try {
      result[key] = JSON.parse(raw[key]);
    } catch (e) {
      result[key] = raw[key];
    }

    if (typeof result[key] === 'undefined' || result[key] === '') {
      if (option.required) {
        console.error(chalk.red(`Environment variable ${key} is missing, please define it in a ".env" file`));
        process.exit(1);
      }
      result[key] = option.default;
    }
  }

  return result as {
    [K in keyof T]: T[K] extends string | number | boolean
      ? T[K]
      : T[K] extends { default: string | number | boolean }
      ? T[K]['default']
      : string;
  };
}

const isEnvDevelopment = NODE_ENV === 'development';
const isEnvProduction = NODE_ENV === 'production';

/**
 * Define default value of variables in `process.env`
 * These value could be overwritten by `.env*` file
 * `required` means the variable is required to be defined
 */
const env = getEnv({
  NODE_ENV
});

export { env, isEnvDevelopment, isEnvProduction };
