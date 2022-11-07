type Unpack<T> = T extends (infer U)[] ? U : never;

type PartialKey<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
