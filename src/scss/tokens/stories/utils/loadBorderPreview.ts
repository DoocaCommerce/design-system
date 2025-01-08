export const loadBorderPreview = (token: string, value: number) => {
  if (token.includes('radius')) {
    return `
        <div style="width: 80px; height: 80px; border: var(--s-border-light); background-color: #fff; border-radius: ${value}px"/>
      `;
  } else if (token.includes('width')) {
    return `
        <div style="width:100%; height:30px; border: var(--s-border-light); background-color: #fff; border-width: ${value}px"/>
      `;
  }
};
