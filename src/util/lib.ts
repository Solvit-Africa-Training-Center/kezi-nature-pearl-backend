import * as bcrypt from 'bcrypt';

export const hashContent = (content: string, saltOrRounds: number) => {
  const hashedContent = bcrypt.hashSync(content, 10);
  return hashedContent;
};

export const comparehashContent = (content: string, hashedContent: string) => {
  const result = bcrypt.compareSync(content, hashedContent);
  return result;
};
