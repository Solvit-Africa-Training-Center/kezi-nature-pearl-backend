export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and') // replace & with 'and'
    .replace(/[\s\W-]+/g, '-') // replace spaces, non-word chars with -
    .replace(/^-+|-+$/g, ''); // remove leading/trailing -
}
