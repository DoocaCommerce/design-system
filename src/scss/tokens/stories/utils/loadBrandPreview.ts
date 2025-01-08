import { loadColorPreview } from './loadColorPreview';
import { loadTokens } from './loadTokens';

export const loadBrandPreview = (token: string, value: string) => {
  if (token.includes('color')) {
    const primitiveColors = loadTokens('primitives', 'color');
    return loadColorPreview(primitiveColors[value]);
  }

  return `<span>${value}</span>`;
};
