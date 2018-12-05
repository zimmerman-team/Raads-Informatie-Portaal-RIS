// turns dutch string date to ISO string date, for sorting
export function dutchDateToIso(dat) {
  const date = dat.trim();
  const firstPart = date.substring(0, date.indexOf('-'));
  const middlePart = date.substring(date.indexOf('-'), date.lastIndexOf('-') + 1);
  const lastPart = date.substring(date.lastIndexOf('-') + 1);
  return lastPart.concat(middlePart).concat(firstPart);
}
