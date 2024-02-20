export function createSlug(title: string): string {
  return (
    title
      .normalize('NFD') // Normalize the string to decompose combined characters
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .toLowerCase() // Convert to lower case
      .trim() // Trim white spaces at the beginning and end of the string
      .replace(/\s+/g, '-') // Replace spaces with -
      // eslint-disable-next-line no-useless-escape
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      // eslint-disable-next-line no-useless-escape
      .replace(/\-\-+/g, '-')
  ) // Replace multiple - with single -
}
