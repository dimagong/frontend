export const warning = (msg: string, ...optionalParams: any[]) => {
  if (process.env.NODE_ENV === "development") {
    console.warn(msg, ...optionalParams);
  }
};
