import tokens from '../../../../../.storybook/tokens.parsed.json';

export const loadTokens = (type: string, group: string, subgroup: string | null = null) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itens = (tokens as any)[type][group];

  if (!subgroup) {
    return itens;
  }

  const filteredItens = Object.entries(itens).filter(([key]) => key.includes(subgroup));
  return Object.fromEntries(filteredItens);
};
