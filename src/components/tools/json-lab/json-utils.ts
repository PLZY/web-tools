import { parse, visit } from "jsonc-parser";
import * as YAML from "yaml"; // Corrected import for YAML
import { jsonrepair } from "jsonrepair";

// Anti-Crash: Safely parse a string or return an object directly.
export function safeParse(data: string | object): object {
  if (typeof data === "object") {
    return data;
  }
  if (typeof data === "string") {
    try {
      const repaired = jsonrepair(data);
      return JSON.parse(repaired);
    } catch (e) {
      console.error("safeParse failed:", e);
      // Return a structured error object or re-throw, depending on desired error handling.
      // For now, returning an object with an error message.
      return { error: true, message: "Invalid JSON input", original: data };
    }
  }
  // Fallback for other types, though the function is designed for string or object.
  return {
    error: true,
    message: `Unsupported type: ${typeof data}`,
    original: data,
  };
}

// Helper function to convert snake_case to camelCase
export function snakeToCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}

// Recursive function to apply snake_case to camelCase to all keys in an object/array
export function convertKeysToCamelCase(data: any): any {
  if (Array.isArray(data)) {
    return data.map((item) => convertKeysToCamelCase(item));
  }
  if (typeof data === "object" && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        snakeToCamelCase(key),
        convertKeysToCamelCase(value),
      ])
    );
  }
  return data;
}

// Helper function to convert camelCase to snake_case
export function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

// Recursive function to apply camelCase to snake_case to all keys in an object/array
export function convertKeysToSnakeCase(data: any): any {
  if (Array.isArray(data)) {
    return data.map((item) => convertKeysToSnakeCase(item));
  }
  if (typeof data === "object" && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        camelToSnakeCase(key),
        convertKeysToSnakeCase(value),
      ])
    );
  }
  return data;
}

// Function to convert YAML to JSON
export function yamlToJson(yamlString: string): string {
  try {
    const parsedYaml = YAML.parse(yamlString);
    return JSON.stringify(parsedYaml, null, 2);
  } catch (e: any) {
    throw new Error(`YAML parsing error: ${e.message}`);
  }
}

// Function to unescape JSON string values
// It also attempts to auto-repair the input string before unescaping.
export function unescapeJsonString(jsonString: string): string {
  let repairedString = jsonString;
  try {
    repairedString = jsonrepair(jsonString);
  } catch (e) {
    // If jsonrepair fails, we proceed with the original string and try to parse it.
    console.warn("JSON repair failed, proceeding with original string:", e);
  }

  try {
    const parsed = JSON.parse(repairedString);
    if (typeof parsed === 'string') {
      // If the parsed result is still a string, it means the original was a string literal
      // with escaped characters, e.g., "{\"key\":\"value\"}"
      // We need to parse it again to get the actual object.
      // The result of the first parse is a string, which we need to parse again
      // and then stringify to return a well-formatted JSON string.
      return JSON.stringify(JSON.parse(parsed), null, 2);
    }
    return JSON.stringify(parsed, null, 2);
  } catch (e: any) {
    throw new Error(`Unescape/Parse error: ${e.message}`);
  }
}

// Function to minify JSON string
export function minifyJson(jsonString: string): string {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed);
  } catch (e: any) {
    throw new Error(`Minify error: ${e.message}`);
  }
}

// Function to auto-format JSON (string or object) with 2-space indentation
export function formatJson(data: any): string {
  try {
    // If the input is a string, attempt to parse it. Otherwise, assume it's an object.
    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    return JSON.stringify(parsed, null, 2);
  } catch (e: any) {
    // If parsing or stringifying fails, and the original input was a string,
    // return the original string to avoid erroring out.
    if (typeof data === "string") {
      return data;
    }
    // If it was an object that couldn't be stringified, or other unexpected error, re-throw.
    throw new Error(`Format error: ${e.message}`);
  }
}

// Function to auto-repair JSON string
export function autoRepairJson(jsonString: string): string {
  try {
    return jsonrepair(jsonString);
  } catch (e: any) {
    throw new Error(`Auto-repair error: ${e.message}`);
  }
}

// Function to force Long to String for JSON values to prevent JS precision issues
export function forceLongToString(data: any): any {
  if (Array.isArray(data)) {
    return data.map(item => forceLongToString(item));
  }
  if (typeof data === "object" && data !== null) {
    const newObject: { [key: string]: any } = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        let value = data[key];
        // Check for numbers that might exceed JavaScript's safe integer limit
        if (typeof value === "number" && Math.abs(value) > Number.MAX_SAFE_INTEGER) {
          newObject[key] = String(value);
        } else {
          newObject[key] = forceLongToString(value);
        }
      }
    }
    return newObject;
  }
  return data;
}

// Function to convert all numbers to strings to prevent precision loss
export function numbersToString(data: any): any {
  if (Array.isArray(data)) {
    return data.map(item => numbersToString(item));
  }
  if (typeof data === "object" && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        if (typeof value === "number") {
          return [key, String(value)];
        }
        return [key, numbersToString(value)];
      })
    );
  }
  return data;
}

// Function to generate Java POJO from JSON
export function generateJavaPojo(json: any, className: string = "Root") {
  let pojo = `import com.fasterxml.jackson.annotation.JsonProperty;\nimport lombok.Data;\n\n@Data\npublic class ${className} {\n`;

  for (const key in json) {
    if (Object.prototype.hasOwnProperty.call(json, key)) {
      const value = json[key];
      const fieldName = snakeToCamelCase(key);
      const JsonPropertyAnnotation = fieldName === key ? `` : `@JsonProperty("${key}")\n  `;

      if (Array.isArray(value)) {
        if (value.length > 0) {
          const arrayElementType = typeof value[0] === "object" && value[0] !== null
            ? capitalize(fieldName) + "Item"
            : getType(value[0]);
          pojo += `  ${JsonPropertyAnnotation}private List<${arrayElementType}> ${fieldName};\n`;
          if (typeof value[0] === "object" && value[0] !== null) {
            pojo += generateJavaPojo(value[0], capitalize(fieldName) + "Item");
          }
        } else {
          pojo += `  ${JsonPropertyAnnotation}private List<Object> ${fieldName};\n`;
        }
      } else if (typeof value === "object" && value !== null) {
        const nestedClassName = capitalize(fieldName);
        pojo += `  ${JsonPropertyAnnotation}private ${nestedClassName} ${fieldName};\n`;
        pojo += generateJavaPojo(value, nestedClassName);
      } else {
        pojo += `  ${JsonPropertyAnnotation}private ${getType(value)} ${fieldName};\n`;
      }
    }
  }
  pojo += `}\n\n`;
  return pojo;
}

// Function to generate TypeScript Interface from JSON
export function generateTsInterface(json: any, interfaceName: string = "RootInterface") {
  let tsInterface = `export interface ${interfaceName} {\n`;

  for (const key in json) {
    if (Object.prototype.hasOwnProperty.call(json, key)) {
      const value = json[key];
      const fieldName = key;

      if (Array.isArray(value)) {
        if (value.length > 0) {
          const arrayElementType = typeof value[0] === "object" && value[0] !== null
            ? capitalize(fieldName) + "Item"
            : getTsType(value[0]);
          tsInterface += `  ${fieldName}: ${arrayElementType}[];\n`;
          if (typeof value[0] === "object" && value[0] !== null) {
            tsInterface += generateTsInterface(value[0], capitalize(fieldName) + "Item");
          }
        } else {
          tsInterface += `  ${fieldName}: any[];\n`;
        }
      } else if (typeof value === "object" && value !== null) { // Corrected indentation and scope
        const nestedInterfaceName = capitalize(fieldName);
        tsInterface += `  ${fieldName}: ${nestedInterfaceName};\n`;
        tsInterface += generateTsInterface(value, nestedInterfaceName);
      } else {
        tsInterface += `  ${fieldName}: ${getTsType(value)};\n`;
      }
    }
  }
  tsInterface += `}\n\n`;
  return tsInterface;
}

// Function to generate Go Struct from JSON
export function generateGoStruct(json: any, structName: string = "RootStruct"): string {
  let goStruct = `type ${structName} struct {\n`;

  for (const key in json) {
    if (Object.prototype.hasOwnProperty.call(json, key)) {
      const value = json[key];
      const fieldName = capitalize(snakeToCamelCase(key));

      if (Array.isArray(value)) {
        if (value.length > 0) {
          const arrayElementType = typeof value[0] === "object" && value[0] !== null
            ? capitalize(fieldName) + "Item"
            : getGoType(value[0]);
          goStruct += `  ${fieldName} []${arrayElementType} \`json:"${key}"\`\n`;
          if (typeof value[0] === "object" && value[0] !== null) {
            goStruct += generateGoStruct(value[0], capitalize(fieldName) + "Item");
          }
        } else {
          goStruct += `  ${fieldName} []interface{} \`json:"${key}"\`\n`;
        }
      } else if (typeof value === "object" && value !== null) {
        const nestedStructName = capitalize(fieldName);
        goStruct += `  ${fieldName} ${nestedStructName} \`json:"${key}"\`\n`;
        goStruct += generateGoStruct(value, nestedStructName);
      } else {
        goStruct += `  ${fieldName} ${getGoType(value)} \`json:"${key}"\`\n`;
      }
    }
  }
  goStruct += `}\n\n`;
  return goStruct;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getType(value: any): string {
  if (typeof value === "string") return "String";
  if (typeof value === "number") {
    return Number.isInteger(value) ? "Long" : "Double"; // Use Long for integers, Double for floats
  }
  if (typeof value === "boolean") return "Boolean";
  return "Object";
}

function getTsType(value: any): string {
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  return "any";
}

function getGoType(value: any): string {
  if (typeof value === "string") return "string";
  if (typeof value === "number") {
    return Number.isInteger(value) ? "int64" : "float64";
  }
  if (typeof value === "boolean") return "bool";
  return "interface{}";
}

// Function to test JSONPath
export function jsonPathQuery(json: any, path: string): any {
  if (!json || !path) return undefined;
  if (path === "$") return json;

  // Basic JSONPath parser (simplified, not full spec)
  const parts = path.substring(2).split(/[\.\\[\\]]+/).filter(Boolean); // Remove "$.", split by . or []
  let current = json;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (Array.isArray(current) && !isNaN(Number(part))) {
      current = current[Number(part)];
    } else if (typeof current === "object" && current !== null) {
      current = current[part];
    } else {
      return undefined; // Path not found or type mismatch
    }
    if (current === undefined) return undefined;
  }
  return current;
}

// Function to detect DDL statements
export function isDDL(input: string): boolean {
  const ddlKeywords = ["CREATE TABLE", "ALTER TABLE", "DROP TABLE", "CREATE INDEX", "ALTER INDEX", "DROP INDEX", "CREATE VIEW", "ALTER VIEW", "DROP VIEW", "CREATE DATABASE", "ALTER DATABASE", "DROP DATABASE"];
  const upperCaseInput = input.toUpperCase();
  return ddlKeywords.some(keyword => upperCaseInput.includes(keyword));
}
