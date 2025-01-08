export const loadTypographyPreview = (token: string, value: number | string) => {
  if (token.includes('family')) {
    const family = (value as string).charAt(0).toUpperCase() + (value as string).slice(1);
    return `
        <link href="https://fonts.googleapis.com/css2?family=${family}:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
        <span style="font-family: Roboto, serif; font-weight: 400; font-style: normal; font-size: 14px;">Design System Commerce Suite</span>
      `;
  } else if (token.includes('size')) {
    return `     
        <span style="font-weight: 400; font-style: normal; font-size: ${value}px;">Design System Commerce Suite</span>
      `;
  } else if (token.includes('weight')) {
    return `     
        <span style="font-weight: ${value}; font-style: normal; font-size: 14px;">Design System Commerce Suite</span>
      `;
  }
};
