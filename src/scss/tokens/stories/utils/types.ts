export type GenerateTemplateParams = {
  type: string;
  columnWidth?: {
    key?: number;
    value?: number;
    preview?: number;
  };
};

export type LoadPreviewParams = {
  type: string;
  value: string | number;
  index: string;
};
