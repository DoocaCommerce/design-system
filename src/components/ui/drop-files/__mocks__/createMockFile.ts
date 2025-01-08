interface MockFileParams {
  name: string;
  size: number;
  type: string;
}

export const createMockFile = ({ name, size, type }: MockFileParams): File => {
  const content = new Uint8Array(size);
  const blob = new Blob([content], { type });

  return new File([blob], name, { type });
};
