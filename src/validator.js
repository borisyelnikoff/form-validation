export default function validate(data, schema) {
  if (!schema) {
    return {};
  }

  const result = {};

  Object.keys(data).forEach((prop) => {
    if (!schema[prop]) {
      return;
    }

    result[prop] = validateProperty(data[prop], schema[prop]);
  });

  return result;
}

const validationFunctions = [
  validateRequired,
  validatePassword,
  validateEmail,
  validateString,
  validateNumber,
  validateBoolean,
  validateValues,
  validateAlphabetic,
  validateAlphanum,
];

function validateProperty(input, schema) {
  if (!schema) {
    return { isValid: true };
  }

  let result;
  validationFunctions.some((func) => {
    result = func(input, schema);

    return !result.isValid;
  });

  return result;
}

function validateRequired(input, schema) {
  if (!schema || !schema.isRequired || input === 0) {
    return { isValid: true };
  }

  const result = {};
  result.isValid = !!input;
  if (!result.isValid) {
    result.error = `${getName(schema)} is required.`;
  }

  return result;
}

function validateBoolean(input, schema) {
  if (!schema || !schema.isBoolean) {
    return { isValid: true };
  }

  if (typeof input !== "boolean") {
    throw new Error("Invalid input argument. A Boolean is expected.");
  }

  const result = {};
  result.isValid = typeof input === "boolean";
  if (!result.isValid) {
    result.error = `${getName(schema)} must be a boolean value.`;
  }

  return result;
}

function validateString(input, schema) {
  if (schema && !schema.isString) {
    return { isValid: true };
  }

  if (typeof input !== "string") {
    return {
      isValid: false,
      error: `Invalid data type. A string is expected`,
    };
  }

  if (!schema) {
    return { isValid: true };
  }

  const { minLength, maxLength } = schema;
  const hasMinLength = minLength ? input.length >= minLength : true;
  const isLessThanMaxLength = maxLength ? input.length <= maxLength : true;
  const result = { isValid: hasMinLength && isLessThanMaxLength };
  if (!result.isValid) {
    result.error = `${hasMinLength ? "Max" : "Min"} length for ${getName(
      schema
    )} not met.
${createRangeMsg(minLength, maxLength)}`;
  }

  return result;
}

function validateNumber(input, schema) {
  if (!schema || !schema.isNumber) {
    return { isValid: true };
  }

  const parsedInput = Number.parseFloat(input);
  if (!parsedInput && parsedInput !== 0) {
    return {
      isValid: false,
      error: `A Number is expected for ${getName(schema)}.`,
    };
  }

  return validateRange(parsedInput, schema);
}

function validateRange(input, schema) {
  if (!schema) {
    return { isValid: true };
  }

  if (typeof input !== "number") {
    throw new Error("Invalid input argument. Number is expected.");
  }

  const { minValue, maxValue } = schema;
  const meetsMinValueBound =
    minValue || minValue === 0 ? input >= minValue : true;
  const meetsMaxValueBound =
    maxValue || maxValue === 0 ? input <= maxValue : true;
  const result = { isValid: meetsMinValueBound && meetsMaxValueBound };
  if (!result.isValid) {
    result.error = `${
      meetsMinValueBound ? "Max" : "Min"
    } value constraint not met. 
${createRangeMsg(minValue, maxValue)}`;
  }

  return result;
}

function validateEmail(input, schema) {
  if (!schema || !schema.isEmail) {
    return { isValid: true };
  }

  if (typeof input !== "string") {
    throw new Error("Invalid input argument. A string is expected.");
  }

  const emailRegex = /^[a-zA-Z]+.*@\w+[.]\w+$/;
  const result = { isValid: false };
  if (emailRegex.test(input)) {
    result.isValid = true;
  } else {
    result.error = `${getName(schema)} is not a valid e-mail.`;
  }

  return result;
}

function validatePassword(input, schema) {
  if (!schema || !schema.isPassword) {
    return { isValid: true };
  }

  if (typeof input !== "string") {
    throw new Error("Invalid input argument. A string is expected.");
  }

  const result = validateString(input, schema);
  if (!result.isValid) {
    return result;
  }

  const containsUpperCaseLetter = /[A-Z]/.test(input);
  const containsDigit = /\d/.test(input);
  const containsSpecialChar = /[^a-zA-Z0-9\s]/.test(input);
  const doesNotContainWhiteSpace = !/\s/.test(input);
  const hasValidLength =
    input.length >= schema.minLength && input.length <= schema.maxLength;

  result.isValid =
    containsUpperCaseLetter &&
    containsSpecialChar &&
    containsDigit &&
    doesNotContainWhiteSpace &&
    hasValidLength;

  if (!result.isValid) {
    result.error = `At least one upper case letter 
and special character required. No white spaces.`;
  }

  return result;
}

function validateValues(input, schema) {
  if (!schema || !schema.values || !(schema.values instanceof Array)) {
    return { isValid: true };
  }

  const result = { isValid: false };
  schema.values.some((value) => {
    result.isValid ||= input === value;

    return result.isValid;
  });

  if (!result.isValid) {
    result.error = `${getName(schema)} value does not match predefined values.`;
  }

  return result;
}

function validateAlphabetic(input, schema) {
  if (!schema || !schema.isAlphabetic) {
    return { isValid: true };
  }

  if (typeof input !== "string") {
    throw new Error("Wrong input argument. A string is expected.");
  }

  const allButLettersRegex = /[^a-zA-Z]/;
  const result = {};
  result.isValid = !allButLettersRegex.test(input);
  if (!result.isValid) {
    result.error = `${getName(schema)} accepts only alphabetic characters.`;
  }

  return result;
}

function validateAlphanum(input, schema) {
  if (!schema || !schema.isAlphanumeric) {
    return { isValid: true };
  }

  if (typeof input !== "string") {
    throw new Error("Wrong input argument. A string is expected.");
  }

  const allButAlphanumRegex = /[^a-zA-Z0-9]/;
  const result = {};
  result.isValid = !allButAlphanumRegex.test(input);
  if (!result.isValid) {
    result.error = `${getName(schema)} accepts only alphanumeric characters.`;
  }

  return result;
}

function createRangeMsg(min, max) {
  return `A range between ${min} and ${max} expected.`;
}

function getName(schema) {
  return schema.name || "input";
}
