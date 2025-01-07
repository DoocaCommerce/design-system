export const loadMotionPreview = (token: string, value: string) => {
  if (token.includes('duration')) {
    return `<div style="width:30px; height:30px; border: var(--s-border-light); background-color: #fff; animation: ${value} linear 0s infinite normal both running spin"/>`;
  }

  return `<div style="width:30px; height:30px; border: var(--s-border-light); background-color: #fff; animation: 2s ${value} 0s infinite alternate both running slide"/>`;
};
