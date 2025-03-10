/* eslint-disable @typescript-eslint/no-explicit-any */
import { writeFileSync } from 'node:fs';
import tokens from './tokens.json';

/* Global variables */

const parsedTokens: ParsedTokens = {
  primitives: {},
  brand: {},
  semantics: {},
};

/* Types */

interface ParsedTokens {
  primitives: Record<string, any>;
  brand: Record<string, any>;
  semantics: Record<string, any>;
}

type ClassifiedTokens = Required<ParsedTokens>;

/* Functions */

/**
 * Sanitize tokens based on css vars names
 * @param {string} token
 * @returns Returns token sanitized
 */
const sanitizeToken = (token: string) => {
  return `--${token.replaceAll('/', '-')}`;
};

/**
 * Parse primitives tokens
 * @param {any[]} tokens
 */
const parsePrimitives = (tokens) => {
  return tokens.reduce((result, token) => ({ ...result, [sanitizeToken(token.name)]: token.value }), {});
};

/**
 * Parse brand tokens
 * @param {any[]} tokens
 */
const parseBrand = (collection) => {
  return collection.reduce((brandsResult, items) => {
    const brandTokens = items.variables.reduce((result, token) => {
      return {
        ...result,
        [sanitizeToken(token.name)]: typeof token.value === 'object' ? sanitizeToken(token.value.name) : token.value,
      };
    }, {});

    const result = { ...brandsResult };

    const sanitizeName = items.name.replace(/[^a-zA-Z0-9-]/, '-');
    result[sanitizeName] = brandTokens;

    return result;
  }, {});
};

/**
 * Parse semantics tokens
 * @param {any[]} tokens
 */
const parseSemantics = (tokens: any[]) => {
  return tokens.reduce(
    (result, token) => ({
      ...result,
      [sanitizeToken(token.name)]:
        typeof token.value === 'object'
          ? token.value.collection === 'brand'
            ? sanitizeToken(token.value.name)
            : parsedTokens[token.value.collection][sanitizeToken(token.value.name)]
          : token.value,
    }),
    {}
  );
};

/**
 * Define group based on token
 * @param {string} token
 * @returns Returns group name
 */
const defineGroup = (token: string): string => {
  let group = token.slice(4).split('-')[0];

  if (group === 'z') {
    group = 'z-index';
  }

  if (group === 'line') {
    group = 'line-height';
  }

  return group;
};

/**
 * Classifies tokens into respective group
 * @param {Record<string, any>} tokens
 * @returns Classified tokens
 */
const classifyTokens = (tokens: Record<string, any>) => {
  const result = {};

  Object.entries(tokens).forEach(([key, value]) => {
    const group = defineGroup(key);

    if (!result[group]) {
      result[group] = {};
    }

    result[group][key] = value;
  });

  return result;
};

/*
 * Main function
 */
const init = () => {
  const collections: any = {};

  tokens.collections.forEach((collection) => {
    const collectionName = collection.name.toLowerCase();

    if (collectionName === 'brand') {
      collections[collectionName] = [];
      collection.modes.forEach((brandCollection) => {
        collections[collectionName].push(brandCollection);
      });
    } else {
      collections[collectionName] = collection.modes[0].variables;
    }
  });

  if (!collections.primitives) {
    console.error('Primitives tokens not found... Aborted!');
    process.exit(1);
  }

  if (!collections.brand) {
    console.error('Brand tokens not found... Aborted!');
    process.exit(1);
  }

  parsedTokens.primitives = parsePrimitives(collections.primitives);
  parsedTokens.brand = parseBrand(collections.brand);
  parsedTokens.semantics = parseSemantics(collections.semantics);

  const classifiedTokens: ClassifiedTokens = {
    primitives: classifyTokens(parsedTokens.primitives),
    brand: parsedTokens.brand,
    semantics: classifyTokens(parsedTokens.semantics),
  };

  try {
    writeFileSync(`./.storybook/tokens.parsed.json`, JSON.stringify(classifiedTokens, null, 2));
  } catch (error: any) {
    console.error(`Could not generate parsed tokens file. Details: ${error.message}`);
  }
};

init();
