export const setImageUrl = (url: string | null | undefined): string => {
  if (url) {
    return url;
  }
  // Sinon mettre l'image dans public/images/placeholder.svg
  return '/images/placeholder.svg';
};
