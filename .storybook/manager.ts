import { addons } from '@storybook/manager-api';
import { API_PreparedIndexEntry, API_StatusObject } from '@storybook/types';
import theme from './themes/ds';
import { defaultConfig, type TagBadgeParameters, renderLabel } from 'storybook-addon-tag-badges';

addons.setConfig({
  theme,
  sidebar: {
    filters: {
      patterns: (
        item: API_PreparedIndexEntry & {
          status: Record<string, API_StatusObject | null>;
        }
      ): boolean => {
        return !(item.tags ?? []).includes('hideInSidebar');
      },
    },
    renderLabel,
  },
  tagBadges: [
    {
      tags: 'experimental',
      badge: {
        text: 'Experimental',
        bgColor: '#FFF1D6',
        fgColor: '#6F4A0B',
        tooltip: 'Componente em fase experimental, sujeito a quebra e mudanças.',
      },
      display: {
        sidebar: ['component'],
        toolbar: true,
      },
    },
    {
      tags: 'beta',
      badge: {
        text: 'Beta',
        bgColor: '#E7E3FC',
        fgColor: '#3C309C',
        tooltip: 'Versão próxima de `stable` mas ainda sujeito a ajustes.',
      },
      display: {
        sidebar: ['component'],
        toolbar: true,
      },
    },
    {
      tags: 'deprecated',
      badge: {
        text: 'Deprecated',
        bgColor: '#FDE2E5',
        fgColor: '#8B2331',
        tooltip: 'Este componente foi marcado como obsoleto e será removido em breve. Não use!',
      },
      display: {
        sidebar: ['component'],
        toolbar: true,
      },
    },
    ...defaultConfig,
  ] satisfies TagBadgeParameters,
});
