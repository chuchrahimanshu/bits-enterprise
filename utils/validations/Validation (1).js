const alphanumericRegex = /^[a-zA-Z0-9]+$/;

export const validateTextField = (
  text,
  regex,
  minLength,
  maxLength,
  isNumber = false
) => {
  const validation = new RegExp(regex);

  if (!text || text.length < minLength) {
    return "Value is required.";
  }

  if (text.length > maxLength) {
    return "Value must be less than or equal to 20 characters.";
  }
  if (regex) {
    /*if (!text.match(regex)) {
      return "Value must be alphanumeric.";
    } */
    if (!validation.test(text)) {
      return "Value error";
    }
  }
  if (isNumber) {
    if (Number(text) > maxLength) return "value should be less";
    if (Number(text) < minLength) return "value should be more";
  }

  // if (!alphanumericRegex.test(text)) {
  //   return "Value must be alphanumeric.";
  // }
  //   if (isNaN(numValue) || numValue < 1) {
  //     return "Value must be a number greater than or equal to 1.";
  //   }

  //   if (numValue > 100) {
  //     return "Value must be a number less than or equal to 100.";
  //   }

  return null;
};
