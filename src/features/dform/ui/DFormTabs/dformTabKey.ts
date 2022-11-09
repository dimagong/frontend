export const createDformTabKey = (key: string, index: number) => {
  return `${key}/${index}`;
};

export const extractDformTabKey = (dformTabKey: string) => {
  const [key, index] = dformTabKey.split("/");
  return { key, index: Number(index) };
};
