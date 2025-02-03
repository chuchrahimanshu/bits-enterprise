export const validateTextField = (text, validation) => {
  // console.log(validation, "validation");
  // console.log(text, "text");

  const { bRequired, iMaxLen, iMinLen, sRegex, sErrorMessage, sType, iMaxValue, iMinValue } =
    validation || "";

  if (bRequired  && text?.length == "") {
    return;
  }

  if (bRequired != 0 && text?.length == "" || !text) {
    return sErrorMessage || 'Value is required';
  }
// alert(text)
  if (sType === "ALPHA") {
    if (iMinLen && text?.length < iMinLen) {
      // alert(` min ${iMinLen}` );
      return sErrorMessage;
    }
    if (iMaxLen && text?.length > iMaxLen) {
      // alert(` max ${iMaxLen}` );
      return sErrorMessage;
    }
    if (!new RegExp(sRegex).test(text)) {
      return sErrorMessage;
    }
  }

  if (sType === "NUMERIC") {
    // alert(` min ${iMinLen}`);
    if (!new RegExp(sRegex).test(text)) {
      return "Value must contain only numeric characters.";
    }
  }

  if (sType === "NUMBER") {
    const numericValue = parseInt(text);
    if (isNaN(numericValue)) {
      return "Value must be a valid number.";
    }
    if (typeof iMinValue !== "undefined" && typeof iMaxValue !== "undefined") {
      if (numericValue < iMinValue || numericValue > iMaxValue) {
        return `Value must be inside the range ${iMinValue} to ${iMaxValue}`;
      }
    }
  }

  if (sType === "DECIMAL") {
    // alert(` min ${iMinLen}`);
    const decimalValue = parseFloat(text);
    if (isNaN(decimalValue)) {
      return "Value must be a valid decimal.";
    }
    if (typeof iMinValue !== "undefined" && typeof iMaxValue !== "undefined") {
      if (decimalValue < iMinValue || decimalValue > iMaxValue) {
        return `Value must be inside the range ${iMinValue} to ${iMaxValue}`;
      }
    }
  }

  // alert(iMinLen)
  if (sType === "ALPHANUMERIC") {
    if (iMinLen && text?.length < iMinLen) {
      return sErrorMessage;
    }
    if (iMaxLen && text?.length > iMaxLen) {
      return sErrorMessage;
    }
    if (!new RegExp(sRegex).test(text)) {
      return sErrorMessage;
    }
  }
  if (sType === "") {

    if (bRequired != 0 && text?.length == "") {
      return sErrorMessage|| "Value is required.";
    }
    
  }
// alert('ss')
  return null;
};


export const globalvalidateTextField = (textValue, validaterules) => {

  const errors = {};
  
  // /^[A-Za-z][A-Za-z]*$/
  for (const fieldName in validaterules) {
    
    const fieldValidation = validaterules[fieldName];

    const fieldTextValue = textValue[fieldName] && textValue[fieldName];
    
  
    if (fieldValidation?.bRequired == "0") {
      continue;
    }
    switch (fieldValidation?.sType) {
      case "ALPHA": {
      
        if (fieldValidation?.bRequired == 0 && fieldTextValue?.length == "") {
          break;
        }
        if (fieldValidation?.bRequired != 0 && fieldTextValue?.length == "") {
          errors[fieldName] = fieldValidation.sErrorMessage;
          break;
        }
        if (fieldValidation?.iMinLen && fieldTextValue?.length < fieldValidation?.iMinLen) {
          errors[fieldName] = fieldValidation.sErrorMessage;
          break;
        }
        if (fieldValidation?.iMaxLen && fieldTextValue?.length > fieldValidation?.iMaxLen) {
        
          errors[fieldName] = fieldValidation.sErrorMessage;
          break;
        }
        if (!new RegExp(fieldValidation?.sRegex).test(fieldTextValue)) {
          errors[fieldName] = fieldValidation.sErrorMessage;
          break;
        }
        break;
      }

      case "ALPHANUMERIC": {
        if (fieldName == "col_account") { break; }
        if (fieldValidation?.bRequired == 0 && fieldTextValue?.length == "") {
          break;
        }

        if (fieldValidation?.bRequired != 0 && fieldTextValue?.length == "") {
          errors[fieldName] = fieldValidation.sErrorMessage||"Value is required.";
          break;
        }

        // if (fieldValidation?.bRequired && ( fieldTextValue?.length === 0)) {
        //   errors[fieldName] = fieldValidation.sErrorMessage;
        //   break;
        // }

        if (fieldValidation?.iMinLen && fieldTextValue?.length < fieldValidation?.iMinLen) {
          errors[fieldName] = fieldValidation.sErrorMessage;
          break;
        }
        if (fieldValidation?.iMaxLen && fieldTextValue?.length > fieldValidation?.iMaxLen) {
          errors[fieldName] = fieldValidation.sErrorMessage;
          break;
        }
        if (!new RegExp(fieldValidation?.sRegex).test(fieldTextValue)) {
          errors[fieldName] = fieldValidation.sErrorMessage;
          break;
        }
        break;
      }
      case "DECIMAL": {
        if (fieldValidation?.bRequired && (!fieldTextValue || fieldTextValue?.length === 0)) {
          errors[fieldName] = fieldValidation.sErrorMessage;
          break;
        }
        if (!new RegExp(fieldValidation?.sRegex).test(fieldTextValue)) {
          errors[fieldName] = fieldValidation.sErrorMessage;
          break;
        }
        if (fieldTextValue?.length < fieldValidation?.iMinLen) {
          errors[fieldName] = fieldValidation.sErrorMessage;
          break;
        }
        if (fieldTextValue?.length > fieldValidation?.iMaxLen) {
          errors[fieldName] = fieldValidation.sErrorMessage;
          break;
        }
        break;
      }
      case "INTEGER": {
        if (fieldValidation?.bRequired && (!fieldTextValue || fieldTextValue?.length === 0)) {
          errors[fieldName] = fieldValidation.sErrorMessage;
          break;
        }
        if (!new RegExp(fieldValidation?.sRegex).test(fieldTextValue)) {
          errors[fieldName] = fieldValidation.sErrorMessage;
          break;
        }
        if (fieldTextValue?.length < fieldValidation?.iMinLen) {
          errors[fieldName] = fieldValidation.sErrorMessage;
          break;
        }
        if (fieldTextValue?.length > fieldValidation?.iMaxLen) {
          errors[fieldName] = fieldValidation.sErrorMessage;
          break;
        }
        break;
      }

      case "NUMERIC":{
        if (fieldValidation?.bRequired != 0 && (fieldTextValue < fieldValidation?.iMinValue)) {
          // alert(JSON.stringify(fieldName));
          // alert(fieldName)
          errors[fieldName] =  fieldValidation?.sErrorMessage;
          break;
        }
        break;
      }
      case "":{
        // alert(JSON.stringify(`${fieldName} ${fieldValidation?.bRequired} ${fieldTextValue}`));
        if (fieldValidation?.bRequired != 0) {
          // alert(fieldName)
          if(fieldValidation?.iMinLen && fieldTextValue?.length < fieldValidation?.iMinLen){
            errors[fieldName] = fieldValidation.sErrorMessage || "Value is required.";
            break
          } else if(fieldTextValue === 0){
            errors[fieldName] = fieldValidation.sErrorMessage || "Value is required.";
            break
          }
        }
      }
    }
    
  }
  return errors;
};

// export const globalvalidateTextField = (textValue, validaterules) => {
//   const errors = {};
//   for (const fieldName in validaterules) {
//     const fieldValidation = validaterules[fieldName];
//     const fieldTextValue = textValue[fieldName] && textValue[fieldName]?.trim();
//     if (fieldValidation?.bRequired == '0') {
//       continue;
//     }
//     switch (fieldValidation?.sType) {
//       case "ALPHA": {
//         if (fieldValidation?.bRequired && (!fieldTextValue || fieldTextValue?.length === 0)) {
//           errors[fieldName] = "Value is required.";
//           break;
//         }
//         if (!new RegExp(fieldValidation?.sRegex).test(fieldTextValue)) {
//           errors[fieldName] = "Value must contain only alphanumeric characters.";
//           break;
//         }
//         if (fieldTextValue?.length < fieldValidation?.iMinLen) {
//           errors[fieldName] = `Value must be at least ${fieldValidation.iMinLen} characters long.`;
//           break;
//         }
//         if (fieldTextValue?.length > fieldValidation?.iMaxLen) {
//           errors[fieldName] = `Value must be at most ${fieldValidation.iMaxLen} characters long.`;
//           break;
//         }
//         break;
//       }
//       case "NUMERIC": {
//         if (fieldValidation?.bRequired && (!fieldTextValue || fieldTextValue?.length === 0)) {
//           errors[fieldName] = "Value is required.";
//           break;
//         }
//         if (!new RegExp(fieldValidation?.sRegex).test(fieldTextValue)) {
//           errors[fieldName] = "Value must contain only alphanumeric characters.";
//           break;
//         }
//         const numericValue = parseInt(fieldTextValue);
//         if (isNaN(numericValue)) {
//           errors[fieldName] = "Value must be a valid number.";
//           break;
//         }

//         if (typeof iMinValue !== "undefined" && typeof iMaxValue !== "undefined") {
//           if (
//             numericValue < fieldValidation.iMinValue ||
//             numericValue > fieldValidation.iMaxValue
//           ) {
//             errors[
//               fieldName
//             ] = `Value must be inside the range ${fieldValidation.iMinValue} to ${fieldValidation.iMaxValue}`;
//             break;
//           }
//         }
//         break;
//       }
//       case "NUMBER": {
//         if (fieldValidation?.bRequired && (!fieldTextValue || fieldTextValue?.length === 0)) {
//           errors[fieldName] = "Value is required.";
//           break;
//         }
//         if (!new RegExp(fieldValidation?.sRegex).test(fieldTextValue)) {
//           errors[fieldName] = "Value must contain only alphanumeric characters.";
//           break;
//         }
//         const numericValue = parseInt(fieldTextValue);
//         if (isNaN(numericValue)) {
//           errors[fieldName] = "Value must be a valid number.";
//           break;
//         }

//         if (typeof iMinValue !== "undefined" && typeof iMaxValue !== "undefined") {
//           if (
//             numericValue < fieldValidation.iMinValue ||
//             numericValue > fieldValidation.iMaxValue
//           ) {
//             errors[
//               fieldName
//             ] = `Value must be inside the range ${fieldValidation.iMinValue} to ${fieldValidation.iMaxValue}`;
//             break;
//           }
//         }
//         break;
//       }
//       case "DECIMAL": {
//         if (fieldValidation?.bRequired && (!fieldTextValue || fieldTextValue?.length === 0)) {
//           errors[fieldName] = "Value is required.";
//           break;
//         }
//         if (!new RegExp(fieldValidation?.sRegex).test(fieldTextValue)) {
//           errors[fieldName] = "Value must contain only alphanumeric characters.";
//           break;
//         }
//         const decimalValue = parseFloat(fieldTextValue);
//         if (isNaN(decimalValue)) {
//           errors[fieldName] = "Value must be a valid decimal.";
//           break;
//         }
//         if (typeof iMinValue !== "undefined" && typeof iMaxValue !== "undefined") {
//           if (
//             decimalValue < fieldValidation.iMinValue ||
//             decimalValue > fieldValidation.iMaxValue
//           ) {
//             errors[
//               fieldName
//             ] = `Value must be inside the range ${fieldValidation.iMinValue} to ${fieldValidation.iMaxValue}`;
//             break;
//           }
//         }
//         break;
//       }
//       case "ALPHANUMERIC": {
//         // console.log(fieldTextValue,'fieldTextValuefieldTextValue');
//         if (fieldValidation?.bRequired && (!fieldTextValue || fieldTextValue?.length === 0)) {
//           errors[fieldName] = "Value is required.";
//           break;
//         }
//         if (!new RegExp(fieldValidation?.sRegex).test(fieldTextValue)) {
//           errors[fieldName] = "Value must contain only alphanumeric characters.";
//           break;
//         }
//         if (fieldTextValue?.length < fieldValidation?.iMinLen) {
//           errors[fieldName] = `Value must be at least ${fieldValidation.iMinLen} characters long.`;
//           break;
//         }
//         if (fieldTextValue?.length > fieldValidation?.iMaxLen) {
//           errors[fieldName] = `Value must be at most ${fieldValidation.iMaxLen} characters long.`;
//           break;
//         }
//         break;
//       }
//     }
//   }
//   return errors;
// };
