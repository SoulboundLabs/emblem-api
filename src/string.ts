export const urlHandleToId = (urlHandle: string) => {
  return urlHandle
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.substr(1))
    .join(" ");
};

export const idToUrlHandle = (id: string = "") => {
  return id.toLowerCase().split(" ").join("-");
};

export const removeRomanNumerals = (string: string) => {
  return string.replace(/[IVX]+/g, "").trim();
};
