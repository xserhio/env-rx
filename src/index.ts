import { appendKeysToFile, compare, parseEnv } from './core';
import cac from 'cac';
import pc from 'picocolors';
import prompts from 'prompts';

const cli = cac('env-rx');

cli
  .command('', 'Diagnose and sync your environment variables')
  .option('-e, --env <path>', 'Path to your .env file', { default: '.env' })
  .option('-x, --example <path>', 'Path to your .env.example file', { default: '.env.example' })
  .option('--ci', 'Run in CI mode (fails with exit code 1 if not synced)')
  .action(async (options) => {
    console.log(`\n${pc.cyan(pc.bold('🩺 env-rx'))} ${pc.gray('is analyzing your files...\n')}`);

    const envFile = parseEnv(options.env);
    const exampleFile = parseEnv(options.example);

    let hasErrors = false;

    if (!envFile.exists) {
      console.log(
        `${pc.red('✖ Error:')} Could not find ${pc.bold(options.env)} at ${pc.gray(envFile.path)}`,
      );
      hasErrors = true;
    }
    if (!exampleFile.exists) {
      console.log(
        `${pc.red('✖ Error:')} Could not find ${pc.bold(options.example)} at ${pc.gray(exampleFile.path)}`,
      );
      hasErrors = true;
    }

    if (hasErrors) {
      console.log(`\n${pc.yellow('💡 Tip:')} Use --env and --example to specify custom paths.\n`);
      process.exit(1);
    }

    const diff = compare(envFile.keys, exampleFile.keys);

    if (diff.missingInExample.length === 0 && diff.missingInEnv.length === 0) {
      console.log(
        `${pc.green('✔ Perfect match!')} Your environment variables are perfectly synced.\n`,
      );
      process.exit(0);
    }

    console.log(`${pc.bgYellow(pc.black(' WARNING '))} Mismatches found between your env files:\n`);

    if (diff.missingInExample.length > 0) {
      console.log(
        pc.yellow(
          `📍 Missing in ${pc.bold(options.example)} ${pc.gray(`(found in ${options.env})`)}:`,
        ),
      );
      diff.missingInExample.forEach((key) => {
        console.log(`   ${pc.green('+')} ${pc.cyan(key)}`);
      });
      console.log();
    }

    if (diff.missingInEnv.length > 0) {
      console.log(
        pc.yellow(
          `📍 Missing in ${pc.bold(options.env)} ${pc.gray(`(required by ${options.example})`)}:`,
        ),
      );
      diff.missingInEnv.forEach((key) => {
        console.log(`   ${pc.red('-')} ${pc.magenta(key)}`);
      });
      console.log();
    }

    if (options.ci) {
      console.log(pc.red('✖ CI Check Failed: Environment variables are not synchronized.\n'));
      process.exit(1);
    } else {
      console.log(pc.gray("💡 Tip: Let's fix these missing variables right now.\n"));

      if (diff.missingInExample.length > 0) {
        const response = await prompts({
          type: 'confirm',
          name: 'fix',
          message: `Append missing keys to ${pc.bold(options.example)}?`,
          initial: true,
        });

        if (response.fix) {
          appendKeysToFile(exampleFile.path, diff.missingInExample);
          console.log(pc.green(`✔ Fixed ${options.example}!\n`));
        }
      }

      if (diff.missingInEnv.length > 0) {
        const response = await prompts({
          type: 'confirm',
          name: 'fix',
          message: `Append missing keys to ${pc.bold(options.env)}?`,
          initial: true,
        });

        if (response.fix) {
          appendKeysToFile(envFile.path, diff.missingInEnv);
          console.log(pc.green(`✔ Fixed ${options.env}!\n`));
        }
      }

      console.log(pc.cyan('✨ All done! Check your files.'));
    }
  });

cli.help();
cli.version('1.0.0');

try {
  cli.parse();
} catch (error: any) {
  console.error(pc.red(`\n✖ Error: ${error.message}\n`));
  process.exit(1);
}
