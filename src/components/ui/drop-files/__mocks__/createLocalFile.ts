export async function createLocalFile(fileSrc: string): Promise<File> {
  const response = await fetch(fileSrc);
  const blob = await response.blob();
  const splitted = fileSrc.split('/');
  const fileName = splitted.pop() || 'local-image';

  return new File([blob], fileName, { type: blob.type });
}
