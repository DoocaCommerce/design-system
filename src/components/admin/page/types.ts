import type { ActionButton } from '#ds/types';
import type { IArticle } from '../page-helper-articles';
import type { IVideo } from '../page-helper-video';

export interface PageProps {
  hideTitle?: boolean;
  primaryAction?: ActionButton;
  secondaryActions?: ActionButton[];
  to?: Record<string, any>;
  backlink?: { to: string };
  size?: 'sm' | 'md' | 'lg' | 'full';
  videoHelp?: IVideo;
  articlesHelp?: IArticle[];
  footerHelp?: any;
  title?: string;
  groupActions?: {
    name: string;
    actions: ActionButton[];
  };
}
