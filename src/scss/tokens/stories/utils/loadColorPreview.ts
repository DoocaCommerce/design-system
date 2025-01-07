import { loadTokens } from './loadTokens';

export const loadColorPreview = (color: string) => {
  if (color.includes('b-color')) {
    let brand = document.documentElement.dataset.company ?? 'suite';

    if (brand === 'suite') {
      brand = 'suite-commerce';
    }

    const brandTokens = loadTokens('brand', brand);
    const primitiveColors = loadTokens('primitives', 'color');
    color = primitiveColors[brandTokens[color]];
  }

  return `<div style="width:100%; height:30px; border: var(--s-border-light); background-color: ${color};"/>`;
};
