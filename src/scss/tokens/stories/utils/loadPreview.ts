import { loadColorPreview } from '../utils/loadColorPreview';
import { loadSpagingPreview } from '../utils/loadSpacingPreview';
import { loadBorderPreview } from '../utils/loadBorderPreview';
import { loadZIndexPreview } from '../utils/loadZIndexPreview';
import { loadLineHeightPreview } from '../utils/loadLineHeightPreview';
import { loadMotionPreview } from '../utils/loadMotionPreview';
import { loadBrandPreview } from '../utils/loadBrandPreview';
import type { LoadPreviewParams } from './types';
import { loadTypographyPreview } from './loadTypographyPreview';

export const loadPreview = ({ type, value, index }: LoadPreviewParams): string | undefined => {
  switch (type) {
    case 'color':
      return loadColorPreview(value as string);
    case 'spacing':
      return loadSpagingPreview(value as string);
    case 'border':
      return loadBorderPreview(index, value as number);
    case 'z-index':
      return loadZIndexPreview(value as number);
    case 'font':
      return loadTypographyPreview(index, value);
    case 'line-height':
      return loadLineHeightPreview(value as string);
    case 'motion':
      return loadMotionPreview(index, value as string);
    case 'brand':
      return loadBrandPreview(index, value as string);
    default:
      return;
  }
};
