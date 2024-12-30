import type { ActionButton } from '#ds/types/Action.js';

export interface MediaCardProps {
  title: string;
  text: string;
  video?: string;
  image?: string;
  imageHref?: string;
  imageTarget?: '_blank' | '_self';
  inverse?: boolean;
  buttons?: ActionButton[];
  vertical?: boolean;
  maxMediaHeight?: number;
}
