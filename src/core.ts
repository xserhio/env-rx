import * as fs from 'node:fs';
import { resolve } from 'node:path';
import dotenv from 'dotenv';

export function parseEnv(path: string) {
  const absolutePath = resolve(process.cwd(), path);

  if (!fs.existsSync(absolutePath)) {
    return { exists: false, keys: {}, path: absolutePath };
  }

  const fileContent = fs.readFileSync(absolutePath, 'utf-8');
  const parsedKeys = dotenv.parse(fileContent);

  return { exists: true, keys: parsedKeys, path: absolutePath };
}

export function compare(env: dotenv.DotenvParseOutput, example: dotenv.DotenvParseOutput) {
  const envKeys = Object.keys(env);
  const exampleKeys = Object.keys(example);

  const missingInExample = envKeys.filter((key) => !exampleKeys.includes(key));

  const missingInEnv = exampleKeys.filter((key) => !envKeys.includes(key));

  return {
    missingInExample,
    missingInEnv,
  };
}

export function appendKeysToFile(filePath: string, keys: string[]) {
  if (keys.length === 0) {
    return;
  }

  const appendText = '\n' + keys.map((k) => `${k}=`).join('\n') + '\n';
  fs.appendFileSync(filePath, appendText);
}
