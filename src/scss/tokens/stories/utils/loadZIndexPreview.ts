export const loadZIndexPreview = (value: number) => {
  return `
      <div style="width: 60px; height: 60px; border: var(--s-border-light); background-color: #fff; margin: 10px 0; box-shadow: #ccc 0px 0px ${value * 3}px"/>
    `;
};
