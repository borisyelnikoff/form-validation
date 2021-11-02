import schemaBuilder from "../schemaBuilder";
import validate from "../validator";

const prop = "a";
const prop1 = "a";
const prop2 = "b";
const prop3 = "c";

describe("Data validator.", () => {
  it("Returns empty object when no schema is provided.", () => {
    const data = { [prop]: "b" };

    const result = validate(data);

    expect(result).toEqual({});
  });

  describe("Required fields validation:", () => {
    const schema = {
      [prop]: schemaBuilder.required(),
      [prop1]: schemaBuilder.required(),
      [prop2]: schemaBuilder.required(),
      [prop3]: schemaBuilder.required(),
    };

    it("Returns object with isValid as true when data is required and truthy.", () => {
      const data = { [prop]: 1 };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(true);
    });

    it("Returns object with isValid as false and error as string when data is required and falsy.", () => {
      const data = { [prop1]: null, [prop2]: undefined, [prop3]: "" };

      const result = validate(data, schema);

      expect(result[prop1].isValid).toEqual(false);
      expect(typeof result[prop1].error).toEqual("string");
      expect(result[prop2].isValid).toEqual(false);
      expect(typeof result[prop2].error).toEqual("string");
      expect(result[prop3].isValid).toEqual(false);
      expect(typeof result[prop3].error).toEqual("string");
    });

    it("Returns object with isValid as true when data equals 0.", () => {
      const data = { [prop]: 0 };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(true);
    });
  });

  describe("Password validation:", () => {
    const schema = { [prop]: schemaBuilder.password() };

    it("Returns object with isValid as true when data is a valid password.", () => {
      const pass = "Abcd3fgijk5!";
      const data = { [prop]: pass };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(true);
    });

    it("Returns object with isValid as false when data is password with no capital letter.", () => {
      const pass = "abcd3fgijk!";
      const data = { [prop]: pass };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(false);
      expect(typeof result[prop].error).toEqual("string");
    });

    it("Returns object with isValid as false when data is password with no special character.", () => {
      const pass = "Abcd3fgijk";
      const data = { [prop]: pass };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(false);
      expect(typeof result[prop].error).toEqual("string");
    });

    it("Returns object with isValid as false when data is password with white spaces.", () => {
      const pass = "Abcd3fgij k!";
      const data = { [prop]: pass };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(false);
      expect(typeof result[prop].error).toEqual("string");
    });

    it("Returns object with isValid as false when data is password without a digit.", () => {
      const pass = "Abcdfg#ij";
      const data = { [prop]: pass };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(false);
      expect(typeof result[prop].error).toEqual("string");
    });

    it("Returns object with isValid as false when data is password and is too short.", () => {
      const pass = "Abcd3#gijK!";
      const data = { [prop]: pass };
      schema[prop] = schemaBuilder.password().min(12);

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(false);
      expect(typeof result[prop].error).toEqual("string");
    });

    it("Returns object with isValid as false when data is password and is too long.", () => {
      const pass = "Abcd3fgijk!Abcd3fgijk!#$!";
      const data = { [prop]: pass };
      schema[prop] = schemaBuilder.password().max(24);

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(false);
      expect(typeof result[prop].error).toEqual("string");
    });
  });

  describe("Email validation:", () => {
    const schema = { [prop]: schemaBuilder.email() };

    it("Returns object with isValid as true when data is a valid e-mail.", () => {
      const data = { [prop]: "borys.yelnikof@gmail.com" };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(true);
    });

    it("Returns object with isValid as false when data is invalid e-mail without '@' sign.", () => {
      const data = { [prop]: "borys.yelnikofgmail.com" };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(false);
      expect(typeof result[prop].error).toEqual("string");
    });

    it("Returns object with isValid as false when data is e-mail starting with special character.", () => {
      const data = { [prop]: "!borys.yelnikof@gmail.com" };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(false);
      expect(typeof result[prop].error).toEqual("string");
    });

    it("Returns object with isValid as false when data is e-mail without a domain.", () => {
      const data = { [prop]: "borys.yelnikof@gmailcom" };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(false);
      expect(typeof result[prop].error).toEqual("string");
    });
  });

  describe("String data type validation:", () => {
    it("Returns object with isValid as true when data is a string with valid length", () => {
      const data = { [prop]: "abcde6" };
      const schema = { [prop]: schemaBuilder.string().min(3).max(6) };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(true);
    });

    it("Returns object with isValid as true when data is an empty string and are no length bounds", () => {
      const data = { [prop]: "" };
      const schema = { [prop]: schemaBuilder.string() };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(true);
    });

    it("Returns object with isValid as false when data is Number or Boolean and schema assumes a String", () => {
      const data = { [prop1]: 1, [prop2]: true };
      const schema = {
        [prop1]: schemaBuilder.string(),
        [prop2]: schemaBuilder.string(),
      };

      const result = validate(data, schema);

      expect(result[prop1].isValid).toEqual(false);
      expect(result[prop2].isValid).toEqual(false);
    });

    it("Returns object with isValid as false when data length is too short.", () => {
      const data = { [prop]: "abcd" };
      const schema = {
        [prop]: schemaBuilder.string().min(5),
      };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(false);
    });

    it("Returns object with isValid as false when data length is too long.", () => {
      const data = { [prop]: "abcdefghijk" };
      const schema = {
        [prop]: schemaBuilder.string().max(10),
      };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(false);
    });
  });

  describe("Number data type validation:", () => {
    it("Returns object with isValid as true when data is valid number.", () => {
      const data = { [prop]: 1 };
      const schema = {
        [prop1]: schemaBuilder.number(),
      };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(true);
    });

    it("Returns object with isValid as true when data is string parsable to number.", () => {
      const data = {
        [prop]: "1",
        [prop1]: "-4,5",
        [prop2]: "1.1",
        [prop3]: "2e5",
      };
      const schema = {
        [prop]: schemaBuilder.number(),
        [prop1]: schemaBuilder.number(),
        [prop2]: schemaBuilder.number(),
        [prop3]: schemaBuilder.number(),
      };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(true);
      expect(result[prop1].isValid).toEqual(true);
      expect(result[prop2].isValid).toEqual(true);
      expect(result[prop3].isValid).toEqual(true);
    });

    it("Returns object with isValid as true when data is valid number meeting value constraints.", () => {
      const data = { [prop1]: 1, [prop2]: 0, [prop3]: 1.5 };
      const schema = {
        [prop1]: schemaBuilder.number().min(0),
        [prop2]: schemaBuilder.number().max(1),
        [prop3]: schemaBuilder.number().min(1).max(2),
      };

      const result = validate(data, schema);

      expect(result[prop1].isValid).toEqual(true);
      expect(result[prop2].isValid).toEqual(true);
      expect(result[prop3].isValid).toEqual(true);
    });

    it("Returns object with isValid as false when data value lower than min.", () => {
      const data = { [prop]: -1 };
      const schema = {
        [prop]: schemaBuilder.number().min(0),
      };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(false);
    });

    it("Returns object with isValid as false when data value higher than max.", () => {
      const data = { [prop]: 1.1 };
      const schema = {
        [prop]: schemaBuilder.number().max(1),
      };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(false);
    });
  });

  describe("Boolean data types validation:", () => {
    const schema = {
      [prop]: schemaBuilder.boolean(),
      [prop1]: schemaBuilder.boolean(),
      [prop2]: schemaBuilder.boolean(),
    };

    it("Returns object with isValid as true when data is boolean type.", () => {
      const data = { [prop1]: true, [prop2]: false };

      const result = validate(data, schema);

      expect(result[prop1].isValid).toEqual(true);
      expect(result[prop2].isValid).toEqual(true);
    });

    it("Throws an error when data is string.", () => {
      const data = { [prop]: "a" };

      expect(() => validate(data, schema)).toThrowError();
    });

    it("Throws an error when data is number.", () => {
      const data = { [prop]: 1 };

      expect(() => validate(data, schema)).toThrowError();
    });

    it("Throws an error when data is object.", () => {
      const data = { [prop]: {} };

      expect(() => validate(data, schema)).toThrowError();
    });
  });

  describe("Value equality validation:", () => {
    it("Returns object with isValid as true when data is equal to predefined value.", () => {
      const data = { [prop]: 1 };
      const schema = { [prop]: schemaBuilder.allows(1) };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(true);
    });

    it("Returns object with isValid as true when data is equal to one of predefined values.", () => {
      const data = { [prop]: 1 };
      const schema = { [prop]: schemaBuilder.allows(false, "1", 1, "a") };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(true);
    });

    it("Returns object with isValid as false when data is not equal to any of predefined values.", () => {
      const data = { [prop]: "b" };
      const schema = { [prop]: schemaBuilder.allows(false, "1", 1, "a") };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(false);
    });
  });

  describe("Alphabetic data validation:", () => {
    const schema = { [prop]: schemaBuilder.alphabetic() };

    it("Returns object with isValid as true when data is string made only from alphabet letters.", () => {
      const data = { [prop]: "abcDEF" };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(true);
    });

    it("Returns object with isValid as false when data contains white spaces.", () => {
      const data = { [prop]: "abcd  edfEGAfv " };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(false);
    });

    it("Returns object with isValid as false when data contains numbers.", () => {
      const data = { [prop]: "abc1" };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(false);
    });

    it("Returns object with isValid as false when data contains special characters.", () => {
      const data = { [prop]: "abc@" };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(false);
    });
  });

  describe("Alphanum data validation:", () => {
    const schema = { [prop]: schemaBuilder.alphanum() };

    it("Returns object with isValid as true when data is valid alphanumeric string.", () => {
      const data = { [prop]: "aBc1" };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(true);
    });

    it("Returns object with isValid as false when data contains special characters.", () => {
      const data = { [prop]: "aBcDe#" };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(false);
    });

    it("Returns object with isValid as false when data contains white spaces.", () => {
      const data = { [prop]: "aBc De" };

      const result = validate(data, schema);

      expect(result[prop].isValid).toEqual(false);
    });
  });
});
