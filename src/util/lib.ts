import * as bcrypt from 'bcrypt';

export const hashContent = (content: string) => {
  const hashedContent = bcrypt.hashSync(content, 10);
  return hashedContent;
};

export const comparehashContent = (db_content: string, content: string) => {
  const result = bcrypt.compareSync(content, db_content);
  return result;
};
