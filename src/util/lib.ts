import * as bcrypt from 'bcrypt';

export const hashContent = (content: string) => {
  const hashedContent = bcrypt.hashSync(content, 10);
  return hashedContent;
};

export const comparehashContent = (hashedContent: string, content: string) => {
  const result = bcrypt.compareSync(content, hashedContent);
  return result;
};
