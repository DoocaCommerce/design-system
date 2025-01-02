import { render, createVNode } from 'vue';
import DialogComponent from './Dialog.vue';
import type { DialogConfig } from './types';

const globalConfig = {
  opened: true,
};

let seed = 1;

const open = (config: DialogConfig = {}) => {
  let dialogWrapper = null;
  let dialogVM = null;
  const id = 'ui-dialog-' + seed++;
  dialogWrapper = document.createElement('div');
  dialogWrapper.id = id;
  dialogVM = createVNode(DialogComponent, {
    ...globalConfig,
    ...config,
    id,
  });

  render(dialogVM, dialogWrapper);
  document.body.appendChild(dialogWrapper);
};

export const Dialog = {
  open: open,
  delete(config: DialogConfig = {}) {
    config.destructLabel = 'Deletar';
    config.destructIcon = 'delete';
    config.destructVariant = 'critical';
    open(config);
  },
  prompt(config = {}) {
    config = {
      ...{
        type: 'prompt',
        destructVariant: 'critical',
        destructLabel: 'Confirmar',
      },
      ...config,
    };
    open(config);
  },
  confirm(config: DialogConfig = {}) {
    config.type = 'confirm';
    config.destructLabel = config.destructLabel || 'Confirmar';
    config.destructIcon = 'check';
    config.destructVariant = 'success';
    config.hideCancel = true;
    open(config);
  },
};
