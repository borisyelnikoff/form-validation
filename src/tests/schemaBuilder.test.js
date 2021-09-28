import schemaBuilder from "../schemaBuilder";

const { any, boolean, string, required, email, createSchema, password } =
  schemaBuilder;

let schema = any();

describe("Validation schema builder tests.", () => {
  beforeEach(() => {
    schema = any();
  });

  describe("When called any()", () => {
    it("Should return a new schema when used as a function.", () => {
      const result = any();

      expect(result).toBeInstanceOf(createSchema);
    });

    it("Should return a new schema with no own properties.", () => {
      const result = Object.keys(schema).length;

      expect(result).toEqual(0);
    });

    it("Should return the same schema if called as a method.", () => {
      const result = schema.any();

      expect(result).toBe(schema);
    });
  });

  describe("When called boolean()", () => {
    it("Should return a new schema if called as a function.", () => {
      const result = boolean();

      expect(result).toBeInstanceOf(createSchema);
    });

    it("Should return a new schema with isBoolean property set to true when used as a function.", () => {
      const result = boolean();

      expect(result.isBoolean).toEqual(true);
    });

    it("Should return schema object with added isBoolean property set to true when used as a method.", () => {
      const result = schema.boolean();

      expect(result).toHaveProperty("isBoolean");
    });

    it("Should throw an error if different type was already selected.", () => {
      schema.number();

      expect(() => schema.boolean()).toThrowError();
    });
  });

  describe("When called string()", () => {
    it("Should create schema object with property isString set to true when used as a function.", () => {
      const result = string();

      expect(result.isString).toEqual(true);
    });

    it("Should create schema object with property isString set to true when used as a method.", () => {
      const result = schema.string();

      expect(result.isString).toEqual(true);
    });

    it("Should throw an error when different type was already selected.", () => {
      schema.number();

      expect(() => schema.string()).toThrowError();
    });
  });

  describe("When called number()", () => {
    it("Should return schema object with isNumber property set to true.", () => {
      const result = schema.number();

      expect(result.isNumber).toEqual(true);
    });

    it("Should throw an error if different type was already selected.", () => {
      schema.string();

      expect(() => schema.number()).toThrowError();
    });
  });

  describe("When called required()", () => {
    it("Should return schema with isRequired property.", () => {
      const result = schema.required();

      expect(result.isRequired).toEqual(true);
    });
  });

  describe("When chaining schema calls", () => {
    it("Should return schema of type string with min and max length, and required option.", () => {
      const result = string().min(1).max(2).required();

      expect(result.isString).toEqual(true);
      expect(result.minLength).toEqual(1);
      expect(result.maxLength).toEqual(2);
      expect(result.isRequired).toEqual(true);
    });

    it("Should return schema of type number with min and max value, required and label.", () => {
      const result = required().number().min(0).max(1).label("a");

      expect(result.isRequired).toEqual(true);
      expect(result.minValue).toEqual(0);
      expect(result.maxValue).toEqual(1);
      expect(result.label).toEqual("a");
    });

    it("Should return schema with password which length does not exceed 100 characters", () => {
      const result = password().max(101);
      const expectedMaxLength = 100;

      expect(result.isPassword).toEqual(true);
      expect(result.maxLength).toBeLessThanOrEqual(expectedMaxLength);
    });

    it("Should return schema with password which length is at least 6 characters", () => {
      const result = password().min(5);
      const expectedMinLength = 6;

      expect(result.isPassword).toEqual(true);
      expect(result.minLength).toBeGreaterThanOrEqual(expectedMinLength);
    });

    it("Should return schema with password which min length specified by argument.", () => {
      const minLength = 8;
      const result = password().min(minLength);

      expect(result.isPassword).toEqual(true);
      expect(result.minLength).toEqual(minLength);
    });

    it("Should return schema with password which max length specified by argument.", () => {
      const maxLength = 30;
      const result = password().max(maxLength);

      expect(result.isPassword).toEqual(true);
      expect(result.maxLength).toEqual(maxLength);
    });
  });

  describe("When called password()", () => {
    it("Should return schema with isPassword property set to true and default lengths.", () => {
      const result = required().password();

      expect(result.isPassword).toEqual(true);
      expect(result.minLength).toEqual(schemaBuilder.PASSWORD_MIN_LENGTH);
      expect(result.maxLength).toEqual(schemaBuilder.PASSWORD_MAX_LENGTH);
    });
  });

  describe("When called email()", () => {
    it("Should return schema with isEmail property set to true.", () => {
      const result = email();

      expect(result.isEmail).toEqual(true);
    });
  });

  describe("When called allows(values)", () => {
    it("Should return schema with values array.", () => {
      const expected = ["1", 2, "three"];

      const result = schema.allows(...expected);

      expect(result.values).toBeInstanceOf(Array);
      expect(result.values).toContain(...expected);
    });
  });
});
