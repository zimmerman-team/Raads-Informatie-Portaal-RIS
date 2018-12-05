//Gets the fields border color according to the input value
//and also checks if its a required field
export function getContainerBorderColor(value, required) {
  if (value === '') {
    if (required) {
      return 'red';
    }
    return '#f4f5f7';
  } else if (value === false) {
    return '#f4f5f7';
  }
  return '#00bc1d';
}
