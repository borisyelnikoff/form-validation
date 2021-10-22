const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 100;

createSchema.prototype.any = any;
createSchema.prototype.boolean = boolean;
createSchema.prototype.string = string;
createSchema.prototype.number = number;
createSchema.prototype.required = required;
createSchema.prototype.label = label;
createSchema.prototype.min = min;
createSchema.prototype.max = max;
createSchema.prototype.email = email;
createSchema.prototype.password = password;
createSchema.prototype.allows = allows;

function isSchemaType(obj) {
  return Object.prototype.isPrototypeOf.call(createSchema.prototype, obj);
}

function createSchema(self) {
  if (isSchemaType(self)) {
    return self;
  }

  return Object.create(createSchema.prototype);
}

function any() {
  return createSchema(this);
}

function boolean() {
  if (this && (this.isNumber || this.isString)) {
    throw new Error(
      "Invalid schema option. Variable type has already been selected."
    );
  }

  const schema = createSchema(this);
  schema.isBoolean = true;

  return schema;
}

function string() {
  if (this && (this.isNumber || this.isBoolean)) {
    throw new Error(
      "Invalid schema option. Variable type has already been selected."
    );
  }

  const schema = createSchema(this);
  schema.isString = true;

  return schema;
}

function number() {
  if (this && (this.isBoolean || this.isString)) {
    throw new Error(
      "Invalid schema option. Variable type has already been selected."
    );
  }

  const schema = createSchema(this);
  schema.isNumber = true;

  return schema;
}

function label(name) {
  const schema = createSchema(this);
  schema.name = name;

  return schema;
}

function required() {
  const schema = createSchema(this);
  schema.isRequired = true;

  return schema;
}

function min(value) {
  const schema = createSchema(this);
  if (schema.isNumber) {
    schema.minValue = value;
  } else if (schema.isPassword) {
    schema.minLength =
      value < PASSWORD_MIN_LENGTH ? PASSWORD_MIN_LENGTH : value;
  } else if (schema.isString) {
    schema.minLength = value;
  }

  return schema;
}

function max(value) {
  const schema = createSchema(this);
  if (schema.isNumber) {
    schema.maxValue = value;
  } else if (schema.isPassword) {
    schema.maxLength =
      value > PASSWORD_MAX_LENGTH ? PASSWORD_MAX_LENGTH : value;
  } else if (schema.isString) {
    schema.maxLength = value;
  }

  return schema;
}

function email() {
  const schema = createSchema(this);
  schema.isEmail = true;

  return schema;
}

function password() {
  const schema = createSchema(this);
  schema.isPassword = true;

  if (!schema.minLength || schema.minLength < PASSWORD_MIN_LENGTH) {
    schema.minLength = PASSWORD_MIN_LENGTH;
  }

  if (!schema.maxLength || schema.maxLength > PASSWORD_MAX_LENGTH) {
    schema.maxLength = PASSWORD_MAX_LENGTH;
  }

  return schema;
}

function allows(...values) {
  const schema = createSchema(this);
  schema.values = [...values];

  return schema;
}

function alphanum() {
  const schema = createSchema(this);
  schema.isAlphanumeric = true;

  return schema;
}

function alphabetic() {
  const schema = createSchema(this);
  schema.isAlphabetic = true;

  return schema;
}

export default {
  any,
  boolean,
  string,
  number,
  label,
  required,
  min,
  max,
  email,
  password,
  allows,
  alphanum,
  alphabetic,
  createSchema,
  isSchemaType,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
};
