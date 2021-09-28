import schemaBuilder from "./schemaBuilder";

const inputSchema = schemaBuilder
  .string()
  .required()
  .label("login")
  .min(6)
  .max(15);

console.log(inputSchema);
