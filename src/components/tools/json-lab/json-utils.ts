import * as yaml from 'js-yaml';

/**
 * 将 JSON 解析错误偏移量转换为行列号
 */
export const getErrorLocation = (jsonStr: string, errorMsg: string) => {
  const match = errorMsg.match(/at position (\d+)/);
  if (!match) return null;
  const position = parseInt(match[1], 10);
  const lines = jsonStr.substring(0, position).split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
    message: errorMsg.replace(/at position \d+/, '').replace('JSON.parse: ', '').trim(),
  };
};

// ── 命名工具 ──────────────────────────────────────────────────────────────────

function toCapitalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toCamelCase(str: string): string {
  return str.replace(/([-_][a-z0-9])/gi, ($1) =>
    $1.toUpperCase().replace('-', '').replace('_', '')
  );
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

/**
 * 递归将对象所有 key 从 snake_case 转为 camelCase
 */
export const snakeToCamelKeys = (json: any): any => {
  if (Array.isArray(json)) return json.map(snakeToCamelKeys);
  if (typeof json === 'object' && json !== null) {
    const result: Record<string, any> = {};
    for (const key in json) {
      if (Object.prototype.hasOwnProperty.call(json, key)) {
        result[toCamelCase(key)] = snakeToCamelKeys(json[key]);
      }
    }
    return result;
  }
  return json;
};

/**
 * 递归将对象所有 key 从 camelCase 转为 snake_case
 */
export const camelToSnakeKeys = (json: any): any => {
  if (Array.isArray(json)) return json.map(camelToSnakeKeys);
  if (typeof json === 'object' && json !== null) {
    const result: Record<string, any> = {};
    for (const key in json) {
      if (Object.prototype.hasOwnProperty.call(json, key)) {
        result[toSnakeCase(key)] = camelToSnakeKeys(json[key]);
      }
    }
    return result;
  }
  return json;
};

// ── Code-gen identifier helpers ───────────────────────────────────────────────

/** Split a raw JSON key on any run of non-alphanumeric chars */
function splitKey(key: string): string[] {
  return key.split(/[^a-zA-Z0-9]+/).filter(Boolean);
}

/**
 * Convert a JSON key to a valid PascalCase type/class/message name.
 * Works across TypeScript, Java, Go, Protobuf.
 * e.g. "weird keys map" → "WeirdKeysMap", "1st_level_id" → "T1stLevelId"
 */
function keyToTypeName(key: string): string {
  const parts = splitKey(key);
  if (!parts.length) return 'Type_';
  let s = parts.map(toCapitalCase).join('');
  return /^\d/.test(s) ? 'T' + s : s;
}

/**
 * Convert a JSON key to a valid camelCase field/variable name.
 * e.g. "api_version" → "apiVersion", "1st_level_id" → "f1stLevelId"
 */
function keyToCamelName(key: string): string {
  const parts = splitKey(key);
  if (!parts.length) return 'field_';
  let s = parts[0].toLowerCase() + parts.slice(1).map(toCapitalCase).join('');
  return /^\d/.test(s) ? 'f' + s : s;
}

/** Whether a TypeScript interface key needs quoting */
function needsQuotingTs(key: string): boolean {
  return !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
}

/** Sanitize a JSON key to a valid XML element name */
function sanitizeXmlTag(key: string): string {
  // Keep letters, digits, hyphens, underscores, periods — XML spec
  let s = key.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
  // Must start with a letter or underscore
  if (/^[^a-zA-Z_]/.test(s)) s = '_' + s;
  return s || '_el';
}

// ── Java POJO ─────────────────────────────────────────────────────────────────

function getJavaFieldType(value: any, fieldKey: string): string {
  if (value === null || value === undefined) return 'Object';
  const type = typeof value;
  if (type === 'string')  return 'String';
  if (type === 'number')  return Number.isInteger(value) ? 'Integer' : 'Double';
  if (type === 'boolean') return 'Boolean';
  if (Array.isArray(value)) {
    if (!value.length) return 'List<Object>';
    if (Array.isArray(value[0])) {
      // matrix → List<List<...>>
      return `List<${getJavaFieldType(value[0], fieldKey)}>`;
    }
    if (value[0] !== null && typeof value[0] === 'object') {
      return `List<${keyToTypeName(fieldKey + 'Item')}>`;
    }
    const nonNull = value.filter((v: any) => v !== null);
    if (!nonNull.length) return 'List<Object>';
    const types = new Set(nonNull.map((v: any) => getJavaFieldType(v, fieldKey)));
    return types.size === 1 ? `List<${[...types][0]}>` : 'List<Object>';
  }
  if (type === 'object') return keyToTypeName(fieldKey);
  return 'Object';
}

function generateJavaPojoRecursive(
  json: any,
  className: string,
  indent: string,
  generated: Set<string>
): string {
  const currentName = keyToTypeName(className);
  if (generated.has(currentName)) return '';
  generated.add(currentName);

  const data = Array.isArray(json)
    ? (json.find((i: any) => i !== null && typeof i === 'object' && !Array.isArray(i)) ?? {})
    : (typeof json === 'object' && json !== null ? json : {});

  let out = `${indent}@Data\n${indent}public class ${currentName} {\n`;

  for (const key of Object.keys(data)) {
    const value = data[key];
    const javaType = getJavaFieldType(value, key);
    const fieldName = keyToCamelName(key);
    // Always annotate when the Java field name differs from the original JSON key
    if (fieldName !== key) out += `${indent}  @JsonProperty("${key}")\n`;
    out += `${indent}  private ${javaType} ${fieldName};\n`;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      out += generateJavaPojoRecursive(value, key, indent + '  ', generated);
    } else if (Array.isArray(value)) {
      const firstObj = value.flat().find((i: any) => i !== null && typeof i === 'object' && !Array.isArray(i));
      if (firstObj) out += generateJavaPojoRecursive(firstObj, key + 'Item', indent + '  ', generated);
    }
  }

  out += `${indent}}\n`;
  return out;
}

export const generateJavaPojo = (json: any): string => {
  const generated = new Set<string>();
  return (
    `import lombok.Data;\nimport com.fasterxml.jackson.annotation.JsonProperty;\nimport java.util.List;\n\n` +
    generateJavaPojoRecursive(json, 'RootObject', '', generated)
  );
};

// ── TypeScript Interface ──────────────────────────────────────────────────────

function getTsFieldType(value: any, key: string, output: string[], generated: Set<string>): string {
  if (value === null) return 'null';
  const type = typeof value;
  if (type === 'string')  return 'string';
  if (type === 'number')  return 'number';
  if (type === 'boolean') return 'boolean';

  if (Array.isArray(value)) {
    if (!value.length) return 'any[]';

    // Matrix: array of arrays
    if (Array.isArray(value[0])) {
      const flat = value.flat().filter((v: any) => !Array.isArray(v));
      const types = [...new Set(flat.map((v: any) => v === null ? 'null' : typeof v))];
      const elem = types.length === 1 ? types[0] : `(${types.join(' | ')})`;
      return `${elem}[][]`;
    }

    // Array of objects: merge all items to build complete interface with optional markers
    const objs = value.filter((v: any) => v !== null && typeof v === 'object' && !Array.isArray(v));
    if (objs.length > 0) {
      // Collect all keys and their occurrence count; merge array values across items
      const keyMeta = new Map<string, { firstVal: any; count: number; mergedArr: any[] }>();
      for (const obj of objs) {
        for (const [k, v] of Object.entries(obj)) {
          if (!keyMeta.has(k)) {
            keyMeta.set(k, { firstVal: v, count: 1, mergedArr: Array.isArray(v) ? [...(v as any[])] : [] });
          } else {
            const m = keyMeta.get(k)!;
            m.count++;
            if (Array.isArray(v)) m.mergedArr.push(...(v as any[]));
          }
        }
      }
      // Build merged schema: use merged array values so element-type union covers all items
      const merged: Record<string, any> = {};
      const optionalKeys = new Map<string, boolean>();
      for (const [k, m] of keyMeta) {
        merged[k] = m.mergedArr.length > 0 ? m.mergedArr : m.firstVal;
        optionalKeys.set(k, m.count < objs.length);
      }
      const itemName = keyToTypeName(key + 'Item');
      generateTsInterfaceRecursive(merged, itemName, output, generated, optionalKeys);
      return `${itemName}[]`;
    }

    // Primitive (possibly mixed) array — union type
    const types = [...new Set(value.map((v: any) => v === null ? 'null' : typeof v))];
    const elem = types.length === 1 ? types[0] : `(${types.join(' | ')})`;
    return `${elem}[]`;
  }

  if (type === 'object') {
    const ifName = keyToTypeName(key);
    generateTsInterfaceRecursive(value, ifName, output, generated);
    return ifName;
  }
  return 'any';
}

function generateTsInterfaceRecursive(
  json: any,
  interfaceName: string,
  output: string[],
  generated: Set<string>,
  optionalKeys?: Map<string, boolean>,
): void {
  if (generated.has(interfaceName)) return;
  generated.add(interfaceName);

  let body = `interface ${interfaceName} {\n`;
  for (const key of Object.keys(json)) {
    const value = json[key];
    const tsType = getTsFieldType(value, key, output, generated);
    // Quote keys that are not valid JS identifiers
    const k = needsQuotingTs(key) ? `"${key.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"` : key;
    const opt = optionalKeys?.get(key) ? '?' : '';
    body += `  ${k}${opt}: ${tsType};\n`;
  }
  body += `}\n`;
  // Push AFTER recursing: nested interfaces appear before the interface that references them
  output.push(body);
}

export const generateTsInterface = (json: any): string => {
  const output: string[] = [];
  const generated = new Set<string>();
  generateTsInterfaceRecursive(json, 'RootObject', output, generated);
  return output.join('\n');
};

// ── Shared: merge all objects in an array ────────────────────────────────────

/**
 * Merge all object items in an array into a per-key value-sample list.
 * Keys absent from some items are marked as optional.
 */
function mergeArrayItems(arr: any[]): { data: Record<string, any[]>; optional: Set<string> } {
  const objs = arr.filter((v): v is Record<string, any> =>
    v !== null && typeof v === 'object' && !Array.isArray(v)
  );
  if (!objs.length) return { data: {}, optional: new Set() };

  const keyCount = new Map<string, number>();
  const keyValues = new Map<string, any[]>();
  for (const obj of objs) {
    for (const [k, v] of Object.entries(obj)) {
      keyCount.set(k, (keyCount.get(k) ?? 0) + 1);
      if (!keyValues.has(k)) keyValues.set(k, []);
      keyValues.get(k)!.push(v);
    }
  }

  const data: Record<string, any[]> = {};
  const optional = new Set<string>();
  for (const [k, count] of keyCount) {
    data[k] = keyValues.get(k)!;
    if (count < objs.length) optional.add(k);
  }
  return { data, optional };
}

// ── Go Struct ─────────────────────────────────────────────────────────────────

function getGoFieldType(value: any, keyName: string): string {
  if (value === null || value === undefined) return 'interface{}';
  const type = typeof value;
  if (type === 'string')  return 'string';
  if (type === 'number')  return Number.isInteger(value) ? 'int64' : 'float64';
  if (type === 'boolean') return 'bool';
  if (Array.isArray(value)) {
    if (!value.length) return '[]interface{}';
    if (Array.isArray(value[0])) return `[]${getGoFieldType(value[0], keyName)}`;
    if (value[0] !== null && typeof value[0] === 'object') {
      return `[]${keyToTypeName(keyName + 'Item')}`;
    }
    const nonNull = value.filter((v: any) => v !== null);
    if (!nonNull.length) return '[]interface{}';
    const types = new Set(nonNull.map((v: any) => getGoFieldType(v, keyName)));
    return types.size === 1 ? `[]${[...types][0]}` : '[]interface{}';
  }
  if (type === 'object') return keyToTypeName(keyName);
  return 'interface{}';
}

/** Infer Go type from multiple value samples (union across all array items). */
function getGoFieldTypeFromSamples(samples: any[], keyName: string): string {
  const nonNull = samples.filter(v => v !== null && v !== undefined);
  if (!nonNull.length) return 'interface{}';

  // All values are arrays → merge element types across every sample array
  if (nonNull.every(Array.isArray)) {
    const allElems = (nonNull as any[][]).flat();
    if (allElems.some(Array.isArray)) return getGoFieldType(nonNull[0], keyName); // matrix: fallback to first
    const objElems = allElems.filter(v => v !== null && typeof v === 'object' && !Array.isArray(v));
    if (objElems.length) return `[]${keyToTypeName(keyName + 'Item')}`;
    const nonNullElems = allElems.filter(v => v !== null);
    if (!nonNullElems.length) return '[]interface{}';
    const elemTypes = new Set(nonNullElems.map((v: any) => getGoFieldType(v, keyName)));
    return elemTypes.size === 1 ? `[]${[...elemTypes][0]}` : '[]interface{}';
  }

  // All values are objects → named struct
  if (nonNull.every(v => typeof v === 'object' && !Array.isArray(v))) return keyToTypeName(keyName);

  // Primitives (or mixed) → unify; fall back to interface{} on conflict
  const types = new Set(nonNull.map((v: any) => getGoFieldType(v, keyName)));
  return types.size === 1 ? [...types][0] : 'interface{}';
}

function generateGoStructRecursive(
  json: any,
  structName: string,
  generated: Set<string>
): string {
  const currentName = keyToTypeName(structName);
  if (generated.has(currentName)) return '';
  generated.add(currentName);

  // Normalise input: array of objects → merge; single object → wrap each value in [].
  let fieldData: Record<string, any[]>;
  let optionalKeys: Set<string>;
  if (Array.isArray(json)) {
    const { data, optional } = mergeArrayItems(json);
    fieldData = data; optionalKeys = optional;
  } else if (typeof json === 'object' && json !== null) {
    fieldData = Object.fromEntries(Object.entries(json).map(([k, v]) => [k, [v]]));
    optionalKeys = new Set();
  } else {
    return '';
  }
  if (!Object.keys(fieldData).length) return '';

  let out = `type ${currentName} struct {\n`;
  const nested: string[] = [];

  for (const key of Object.keys(fieldData)) {
    const samples = fieldData[key];
    const goType = getGoFieldTypeFromSamples(samples, key);
    let fieldName = keyToTypeName(key);
    if (!/^[A-Za-z]/.test(fieldName)) fieldName = 'F' + fieldName;
    const omit = optionalKeys.has(key) ? ',omitempty' : '';
    out += `\t${fieldName} ${goType} \`json:"${key}${omit}"\`\n`;

    const nonNull = samples.filter(v => v !== null && v !== undefined);
    if (!nonNull.length) continue;
    if (nonNull.every((v: any) => typeof v === 'object' && !Array.isArray(v))) {
      nested.push(generateGoStructRecursive(nonNull, key, generated));
    } else if (nonNull.every(Array.isArray)) {
      const allElems = (nonNull as any[][]).flat();
      const objElems = allElems.filter(v => v !== null && typeof v === 'object' && !Array.isArray(v));
      if (objElems.length) nested.push(generateGoStructRecursive(objElems, key + 'Item', generated));
    }
  }
  out += `}\n\n`;
  return out + nested.filter(Boolean).join('');
}

export const generateGoStruct = (json: any): string => {
  const generated = new Set<string>();
  return generateGoStructRecursive(json, 'RootObject', generated);
};

// ── Protobuf ──────────────────────────────────────────────────────────────────

/** snake_case proto field name from a JSON key — no special chars, no leading digit */
function keyToProtoFieldName(key: string): string {
  const parts = splitKey(key);
  if (!parts.length) return 'field_';
  let s = parts.join('_').toLowerCase();
  return /^\d/.test(s) ? '_' + s : s;
}

function getProtoFieldType(value: any, key: string): string {
  if (value === null || value === undefined) return 'string';
  const type = typeof value;
  if (type === 'string')  return 'string';
  if (type === 'number')  return Number.isInteger(value) ? 'int64' : 'double';
  if (type === 'boolean') return 'bool';
  if (Array.isArray(value)) {
    if (!value.length) return 'repeated string';
    if (Array.isArray(value[0])) {
      // Matrix: generate a row-wrapper message
      return `repeated ${keyToTypeName(key + 'Row')}`;
    }
    if (value[0] !== null && typeof value[0] === 'object') {
      return `repeated ${keyToTypeName(key + 'Item')}`;
    }
    const nonNull = value.filter((v: any) => v !== null);
    if (!nonNull.length) return 'repeated string';
    const types = new Set(nonNull.map((v: any) => getProtoFieldType(v, key)));
    return types.size === 1 ? `repeated ${[...types][0]}` : 'repeated string';
  }
  if (type === 'object') return keyToTypeName(key);
  return 'string';
}

/** Infer Protobuf type from multiple value samples (union across all array items). */
function getProtoFieldTypeFromSamples(samples: any[], key: string): string {
  const nonNull = samples.filter(v => v !== null && v !== undefined);
  if (!nonNull.length) return 'string';

  if (nonNull.every(Array.isArray)) {
    const allElems = (nonNull as any[][]).flat();
    if (allElems.some(Array.isArray)) return `repeated ${keyToTypeName(key + 'Row')}`; // matrix
    const objElems = allElems.filter(v => v !== null && typeof v === 'object' && !Array.isArray(v));
    if (objElems.length) return `repeated ${keyToTypeName(key + 'Item')}`;
    const nonNullElems = allElems.filter(v => v !== null);
    if (!nonNullElems.length) return 'repeated string';
    const types = new Set(nonNullElems.map((v: any) => getProtoFieldType(v, key)));
    return types.size === 1 ? `repeated ${[...types][0]}` : 'repeated string';
  }

  if (nonNull.every(v => typeof v === 'object' && !Array.isArray(v))) return keyToTypeName(key);

  const types = new Set(nonNull.map((v: any) => getProtoFieldType(v, key)));
  return types.size === 1 ? [...types][0] : 'string';
}

function generateProtobufRecursive(
  json: any,
  messageName: string,
  generated: Set<string>,
  allMessages: string[]   // depth-first: nested pushed before parent
): void {
  const currentName = keyToTypeName(messageName);
  if (generated.has(currentName)) return;
  generated.add(currentName);

  let fieldData: Record<string, any[]>;
  if (Array.isArray(json)) {
    const { data } = mergeArrayItems(json);
    fieldData = data;
  } else if (typeof json === 'object' && json !== null) {
    fieldData = Object.fromEntries(Object.entries(json).map(([k, v]) => [k, [v]]));
  } else {
    return;
  }
  if (!Object.keys(fieldData).length) return;

  let out = `message ${currentName} {\n`;
  let idx = 1;

  for (const key of Object.keys(fieldData)) {
    const samples = fieldData[key];
    const protoType = getProtoFieldTypeFromSamples(samples, key);
    const fieldName = keyToProtoFieldName(key);
    out += `  ${protoType} ${fieldName} = ${idx++};\n`;

    const nonNull = samples.filter(v => v !== null && v !== undefined);
    if (!nonNull.length) continue;

    if (nonNull.every((v: any) => typeof v === 'object' && !Array.isArray(v))) {
      generateProtobufRecursive(nonNull, key, generated, allMessages);
    } else if (nonNull.every(Array.isArray)) {
      const allElems = (nonNull as any[][]).flat();
      if (allElems.some(Array.isArray)) {
        // Matrix row-wrapper
        const rowName = keyToTypeName(key + 'Row');
        if (!generated.has(rowName)) {
          generated.add(rowName);
          const innerElem = (allElems as any[][]).flat().find(v => v !== null);
          const innerType = innerElem !== undefined ? getProtoFieldType(innerElem, key) : 'double';
          allMessages.push(`message ${rowName} {\n  repeated ${innerType} values = 1;\n}`);
        }
      } else {
        const objElems = allElems.filter(v => v !== null && typeof v === 'object' && !Array.isArray(v));
        if (objElems.length) generateProtobufRecursive(objElems, key + 'Item', generated, allMessages);
      }
    }
  }
  allMessages.push(out + `}`);
}

export const generateProtobuf = (json: any): string => {
  const generated = new Set<string>();
  const allMessages: string[] = [];
  generateProtobufRecursive(json, 'RootObject', generated, allMessages);
  return `syntax = "proto3";\n\npackage example;\n\n${allMessages.join('\n\n')}`;
};

// ── YAML / XML ────────────────────────────────────────────────────────────────

export const jsonToYaml = (json: any): string => {
  try {
    return yaml.dump(json);
  } catch (e: any) {
    return `# YAML 转换失败: ${e.message}`;
  }
};

function xmlEscape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function toXmlNode(value: any, key: string, indent: string): string {
  const tag = sanitizeXmlTag(key);
  if (value === null || value === undefined) return `${indent}<${tag}/>\n`;
  if (Array.isArray(value)) {
    return value.map((item: any) => toXmlNode(item, key, indent)).join('');
  }
  if (typeof value === 'object') {
    const inner = Object.keys(value).map(k => toXmlNode(value[k], k, indent + '  ')).join('');
    return `${indent}<${tag}>\n${inner}${indent}</${tag}>\n`;
  }
  return `${indent}<${tag}>${xmlEscape(String(value))}</${tag}>\n`;
}

export const jsonToXml = (json: any): string => {
  if (typeof json !== 'object' || json === null) {
    return `<?xml version="1.0" encoding="UTF-8"?>\n<root>${xmlEscape(String(json))}</root>`;
  }
  const inner = Object.keys(json).map(k => toXmlNode(json[k], k, '  ')).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${inner}</root>`;
};

// ── cURL 解析 ─────────────────────────────────────────────────────────────────

export interface CurlParseResult {
  method: string;
  url: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  body: any | null;
  bodyRaw: string | null;
}

/**
 * 将 cURL 命令解析为结构化对象
 */
export const parseCurl = (curlStr: string): CurlParseResult => {
  const result: CurlParseResult = {
    method: 'GET',
    url: '',
    headers: {},
    queryParams: {},
    body: null,
    bodyRaw: null,
  };

  // 统一处理换行续行符
  const normalized = curlStr.replace(/\\\n\s*/g, ' ').replace(/\\\r\n\s*/g, ' ');
  const tokens = normalized.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) ?? [];

  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];

    if (token === 'curl') { i++; continue; }

    // URL（不以 - 开头且没有被处理过）
    if (!token.startsWith('-') && !result.url && token !== 'curl') {
      result.url = token.replace(/^['"]|['"]$/g, '');
      i++; continue;
    }

    // -X / --request
    if (token === '-X' || token === '--request') {
      result.method = (tokens[++i] ?? 'GET').replace(/^['"]|['"]$/g, '').toUpperCase();
      i++; continue;
    }

    // -H / --header
    if (token === '-H' || token === '--header') {
      const header = (tokens[++i] ?? '').replace(/^['"]|['"]$/g, '');
      const colonIdx = header.indexOf(':');
      if (colonIdx > -1) {
        const k = header.substring(0, colonIdx).trim();
        const v = header.substring(colonIdx + 1).trim();
        result.headers[k] = v;
      }
      i++; continue;
    }

    // -d / --data / --data-raw / --data-binary
    if (token === '-d' || token === '--data' || token === '--data-raw' || token === '--data-binary') {
      const raw = (tokens[++i] ?? '').replace(/^['"]|['"]$/g, '');
      result.bodyRaw = raw;
      result.method = result.method === 'GET' ? 'POST' : result.method;
      try {
        result.body = JSON.parse(raw);
      } catch {
        // 尝试解析 form-encoded
        try {
          const params = new URLSearchParams(raw);
          const obj: Record<string, string> = {};
          params.forEach((v, k) => { obj[k] = v; });
          if (Object.keys(obj).length > 0) result.body = obj;
        } catch {
          result.body = null;
        }
      }
      i++; continue;
    }

    i++;
  }

  // 解析 URL 中的 query params
  try {
    const urlObj = new URL(result.url.startsWith('http') ? result.url : `http://placeholder${result.url}`);
    urlObj.searchParams.forEach((v, k) => { result.queryParams[k] = v; });
  } catch { /* 忽略无效 URL */ }

  return result;
};

/**
 * 将结构化对象生成 cURL 命令
 */
export const generateCurl = (
  method: string,
  url: string,
  headers: Record<string, string>,
  body: any
): string => {
  let cmd = `curl -X ${method.toUpperCase()} '${url}'`;
  for (const [k, v] of Object.entries(headers)) {
    cmd += ` \\\n  -H '${k}: ${v}'`;
  }
  if (body != null) {
    const bodyStr = typeof body === 'string' ? body : JSON.stringify(body, null, 2);
    cmd += ` \\\n  -d '${bodyStr}'`;
  }
  return cmd;
};

// ── 基础工具 ──────────────────────────────────────────────────────────────────

export const minifyJson = (jsonStr: string): string => {
  try { 
    return JSON.stringify(JSON.parse(jsonStr)); 
  } catch { 
    // 如果 JSON 格式不正确，则通过正则移除换行符、制表符以及多余空格，强行缩成一行
    return jsonStr.replace(/\r?\n|\r/g, '').replace(/\s{2,}/g, ' ').trim(); 
  }
};

export const formatJson = (json: any): string => {
  try { return JSON.stringify(json, null, 2); } catch { return String(json); }
};

/**
 * 简单的 JSON 自动修复：去除尾部逗号、补全引号等
 * 生产环境可替换为 json5 或 jsonrepair 库
 */
export const autoRepairJson = (jsonStr: string): string => {
  let s = jsonStr.trim();
  // 去除对象/数组末尾多余逗号
  s = s.replace(/,\s*([}\]])/g, '$1');
  // 将单引号 key/value 替换为双引号（简单场景）
  s = s.replace(/'/g, '"');
  return s;
};

// 保留的占位函数（未来实现）
export const unescapeJsonString = (str: string) => str;
export const forceLongToString = (json: any) => json;
export const arrayToObject = (json: any) => json;
export const objectToArray = (json: any) => json;
export const sortKeysAlphabetically = (json: any) => json;
export const queryStringToJson = (_query: string) => `{ "error": "not implemented" }`;
export const generateJsonSchema = (_json: any) => `{ "error": "not implemented" }`;
export const formatJsonAsMarkdownTable = (_json: any) => `| Header | Value |\n|---|---|\n| data | here |`;
export const base64DecodeJsonValues = (json: any) => json;
export const timestampToHumanReadable = (json: any) => json;
export const jsonPathQuery = (json: any, _path: string) => json;
export const isDDL = (_str: string) => false;
// 兼容旧调用：别名导出
export const convertKeysToCamelCase = snakeToCamelKeys;
export const numbersToString = (json: any) => json;
