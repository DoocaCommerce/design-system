import { lstatSync, cpSync, copyFileSync, rmSync, mkdirSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';

export const copy = (sources: string[], dest: string): Plugin => {
  let resolvedConfig: ResolvedConfig;
  let output: boolean = false;

  return {
    name: 'ds-copy',
    apply: 'build',
    configResolved(config) {
      resolvedConfig = config;
    },
    buildEnd() {
      output = false;
    },
    writeBundle() {
      if (output) return;
      output = true;

      const destResolved = resolve(resolvedConfig.root, resolvedConfig.build.outDir, dest);

      rmSync(destResolved, { force: true, recursive: true });
      mkdirSync(destResolved);

      sources.forEach((src) => {
        const sourceResolved = resolve(resolvedConfig.root, src);

        if (lstatSync(sourceResolved).isDirectory()) {
          cpSync(sourceResolved, destResolved, {
            preserveTimestamps: true,
            dereference: true,
            recursive: true,
          });
        } else {
          const fileName = basename(sourceResolved);
          copyFileSync(sourceResolved, `${destResolved}/${fileName}`);
        }
      });
    },
  };
};
