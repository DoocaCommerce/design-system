import type { IconType } from '../../ui/icon';

export interface SideBarItem {
  name: string;
  isNew?: boolean;
  highlightedLabel?: string;
  isComingSoon?: boolean;
  /** @deprecated Essa propriedade está depreciada e será removida em breve. Use o href no lugar ou trate via evento. */
  to?: string;
  /** @deprecated Essa propriedade está depreciada e será removida em breve. Use o href no lugar ou trate via evento. */
  params?: any;
  href?: string;
  key?: string;
  isKeyActive?: boolean;
  permissions?: string;
  section?: string;
  icon?: IconType;
  caption?: string;
  nodes?: SideBarItem[];
  active?: boolean;
  disabled?: boolean;
  spacer?: boolean;
  last?: boolean;
  dropdown?: boolean;
  action?: () => void;
}

export interface SidebarMobileMenu {
  icon: IconType;
  title: string;
  type: SideBarItemType;
  to?: string;
  params?: any;
}

export type SideBarItemType = 'logo' | 'node' | 'footer' | 'action' | string;

export interface MenuProviderInterface {
  open: boolean;
  close(): void;
  toggle(): void;
}
