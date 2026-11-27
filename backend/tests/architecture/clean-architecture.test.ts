import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

const SRC_ROOT = path.resolve(import.meta.dirname, '../../src');
const AUTH_ROOT = path.join(SRC_ROOT, 'modules/auth');
const TASK_ROOT = path.join(SRC_ROOT, 'modules/task');
const SHARED_ROOT = path.join(SRC_ROOT, 'shared');

function collectTsFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      results.push(...collectTsFiles(fullPath));
    } else if (entry.endsWith('.ts') && !entry.endsWith('.d.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

function extractImports(filePath: string): string[] {
  const sourceText = readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
  const specifiers: string[] = [];

  function visit(node: ts.Node): void {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      specifiers.push(node.moduleSpecifier.text);
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return specifiers;
}

function resolveRelativeTsPath(fromFile: string, specifier: string): string | null {
  if (!specifier.startsWith('.')) {
    return null;
  }
  const withoutExt = specifier.replace(/\.js$/, '.ts');
  return path.resolve(path.dirname(fromFile), withoutExt);
}

function toRelPosix(filePath: string): string {
  return path.relative(SRC_ROOT, filePath).split(path.sep).join('/');
}

describe('Clean Architecture Fitness Tests', () => {
  const authFiles = collectTsFiles(AUTH_ROOT);
  const taskFiles = collectTsFiles(TASK_ROOT);
  const cleanModuleFiles = [...authFiles, ...taskFiles];
  const sharedFiles = collectTsFiles(SHARED_ROOT);
  const allSrcFiles = collectTsFiles(SRC_ROOT).filter(
    (file) => !toRelPosix(file).startsWith('generated/'),
  );

  const domainFiles = [...cleanModuleFiles, ...sharedFiles].filter((file) =>
    toRelPosix(file).includes('/domain/'),
  );
  const applicationFiles = [...cleanModuleFiles, ...sharedFiles].filter((file) =>
    toRelPosix(file).includes('/application/'),
  );
  const presentationFiles = cleanModuleFiles.filter((file) =>
    toRelPosix(file).includes('/presentation/'),
  );

  it('Domain layer does not import outer layers, frameworks, or process.env', () => {
    const forbiddenPackages = ['express', 'bcryptjs', 'jose', 'pino', '@prisma/client'];
    const forbiddenSubpaths = [
      '/application/',
      '/infrastructure/',
      '/presentation/',
      'auth.module',
      'generated/prisma',
      'config/prisma',
      'config/env',
      'config/logger',
      'errors/app-error',
    ];

    for (const file of domainFiles) {
      const content = readFileSync(file, 'utf8');
      expect(content, `${toRelPosix(file)} must not access process.env`).not.toMatch(
        /\bprocess\.env\b/,
      );

      for (const spec of extractImports(file)) {
        for (const pkg of forbiddenPackages) {
          expect(spec, `${toRelPosix(file)} must not import ${pkg}`).not.toBe(pkg);
        }
        const resolved = resolveRelativeTsPath(file, spec);
        const target = resolved ? toRelPosix(resolved) : spec;
        for (const forbidden of forbiddenSubpaths) {
          expect(target, `${toRelPosix(file)} must not import ${forbidden}`).not.toContain(
            forbidden,
          );
        }
      }
    }
  });

  it('Application layer depends only on Domain and Ports (no Infrastructure, Presentation, Express, Prisma, bcrypt, jose, or process.env)', () => {
    const forbiddenPackages = ['express', 'bcryptjs', 'jose', 'pino', '@prisma/client'];
    const forbiddenSubpaths = [
      '/infrastructure/',
      '/presentation/',
      'auth.module',
      'generated/prisma',
      'config/prisma',
      'config/env',
      'config/logger',
      'errors/app-error',
    ];

    for (const file of applicationFiles) {
      const content = readFileSync(file, 'utf8');
      expect(content, `${toRelPosix(file)} must not access process.env`).not.toMatch(
        /\bprocess\.env\b/,
      );

      for (const spec of extractImports(file)) {
        for (const pkg of forbiddenPackages) {
          expect(spec, `${toRelPosix(file)} must not import ${pkg}`).not.toBe(pkg);
        }
        const resolved = resolveRelativeTsPath(file, spec);
        const target = resolved ? toRelPosix(resolved) : spec;
        for (const forbidden of forbiddenSubpaths) {
          expect(target, `${toRelPosix(file)} must not import ${forbidden}`).not.toContain(
            forbidden,
          );
        }
      }
    }
  });

  it('Presentation layer does not import Infrastructure, Prisma, bcrypt, or jose', () => {
    const forbiddenPackages = ['bcryptjs', 'jose', '@prisma/client'];
    const forbiddenSubpaths = ['/infrastructure/', 'generated/prisma', 'config/prisma'];

    for (const file of presentationFiles) {
      for (const spec of extractImports(file)) {
        for (const pkg of forbiddenPackages) {
          expect(spec, `${toRelPosix(file)} must not import ${pkg}`).not.toBe(pkg);
        }
        const resolved = resolveRelativeTsPath(file, spec);
        const target = resolved ? toRelPosix(resolved) : spec;
        for (const forbidden of forbiddenSubpaths) {
          expect(target, `${toRelPosix(file)} must not import ${forbidden}`).not.toContain(
            forbidden,
          );
        }
      }
    }
  });

  it('Other modules do not deep-import auth internals', () => {
    const externalFiles = allSrcFiles.filter((file) => !toRelPosix(file).startsWith('modules/auth/'));
    const forbiddenAuthInternals = [
      'modules/auth/domain/',
      'modules/auth/application/',
      'modules/auth/infrastructure/',
      'modules/auth/presentation/',
      'modules/auth/auth.module',
    ];

    for (const file of externalFiles) {
      for (const spec of extractImports(file)) {
        const resolved = resolveRelativeTsPath(file, spec);
        if (!resolved) continue;
        const target = toRelPosix(resolved);
        for (const forbidden of forbiddenAuthInternals) {
          expect(target, `${toRelPosix(file)} must import auth via modules/auth/index`).not.toContain(
            forbidden,
          );
        }
      }
    }
  });

  it('Has no circular dependencies within auth and shared layers', () => {
    const scopeFiles = [...authFiles, ...sharedFiles];
    const scopeSet = new Set(scopeFiles.map(toRelPosix));
    const graph = new Map<string, string[]>();

    for (const file of scopeFiles) {
      const from = toRelPosix(file);
      const deps: string[] = [];
      for (const spec of extractImports(file)) {
        const resolved = resolveRelativeTsPath(file, spec);
        if (resolved) {
          const target = toRelPosix(resolved);
          if (scopeSet.has(target)) {
            deps.push(target);
          }
        }
      }
      graph.set(from, deps);
    }

    const visiting = new Set<string>();
    const visited = new Set<string>();

    function dfs(node: string, trail: string[]): void {
      visiting.add(node);
      for (const next of graph.get(node) ?? []) {
        if (visiting.has(next)) {
          throw new Error(`Circular dependency detected: ${[...trail, next].join(' -> ')}`);
        }
        if (!visited.has(next)) {
          dfs(next, [...trail, next]);
        }
      }
      visiting.delete(node);
      visited.add(node);
    }

    for (const node of graph.keys()) {
      if (!visited.has(node)) {
        dfs(node, [node]);
      }
    }
  });
});
