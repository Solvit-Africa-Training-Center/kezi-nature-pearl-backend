import * as bcrypt from 'bcrypt';

export const hashContent = async (content: string) => {
  const hashedContent = await bcrypt.hash(content, 10);
  return hashedContent;
};

export const comparehashContent = async (
  content: string,
  hashedContent: string,
) => {
  const result = await bcrypt.compare(content, hashedContent);
  return result;
};
