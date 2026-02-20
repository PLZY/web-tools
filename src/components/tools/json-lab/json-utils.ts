import * as yaml from 'js-yaml';
import * as convert from 'xml-js';

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
  return str.replace(/([-_][a-z])/gi, ($1) =>
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

// ── Java POJO ─────────────────────────────────────────────────────────────────

function getJavaType(value: any): string {
  const type = typeof value;
  if (type === 'string') return 'String';
  if (type === 'number') return Number.isInteger(value) ? 'Integer' : 'Double';
  if (type === 'boolean') return 'Boolean';
  if (Array.isArray(value)) {
    if (value.length > 0) {
      if (typeof value[0] === 'object' && value[0] !== null && !Array.isArray(value[0])) {
        return `List<${toCapitalCase(Object.keys(value[0])[0] || 'Object')}>`;
      }
      return `List<${getJavaType(value[0])}>`;
    }
    return 'List<Object>';
  }
  if (type === 'object' && value !== null) {
    const keys = Object.keys(value);
    return keys.length > 0 ? toCapitalCase(keys[0]) : 'Object';
  }
  return 'Object';
}

function generateJavaPojoRecursive(
  json: any,
  className: string,
  indent: string = '',
  generatedClasses: Set<string>
): string {
  let javaPojo = '';
  const currentClassName = toCapitalCase(className);
  if (generatedClasses.has(currentClassName)) return '';
  generatedClasses.add(currentClassName);

  javaPojo += `${indent}@Data\n`;
  javaPojo += `${indent}public class ${currentClassName} {\n`;

  if (Array.isArray(json)) {
    if (json.length > 0) {
      const itemType = getJavaType(json[0]);
      const itemClassName = toCapitalCase(className) + 'Item';
      javaPojo += `${indent}  private List<${itemType}> items;\n`;
      if (typeof json[0] === 'object' && json[0] !== null && !Array.isArray(json[0])) {
        javaPojo += generateJavaPojoRecursive(json[0], itemClassName, indent + '  ', generatedClasses);
      }
    }
  } else if (typeof json === 'object' && json !== null) {
    for (const key in json) {
      if (Object.prototype.hasOwnProperty.call(json, key)) {
        const value = json[key];
        const javaType = getJavaType(value);
        const fieldName = toCamelCase(key);
        if (fieldName !== key) javaPojo += `${indent}  @JsonProperty("${key}")\n`;
        javaPojo += `${indent}  private ${javaType} ${fieldName};\n`;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          javaPojo += generateJavaPojoRecursive(value, key, indent + '  ', generatedClasses);
        } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
          javaPojo += generateJavaPojoRecursive(value[0], key + 'Item', indent + '  ', generatedClasses);
        }
      }
    }
  }
  javaPojo += `${indent}}\n`;
  return javaPojo;
}

export const generateJavaPojo = (json: any): string => {
  const generatedClasses = new Set<string>();
  return (
    `import lombok.Data;\nimport com.fasterxml.jackson.annotation.JsonProperty;\nimport java.util.List;\n\n` +
    generateJavaPojoRecursive(json, 'RootObject', '', generatedClasses)
  );
};

// ── TypeScript Interface ───────────────────────────────────────────────────────

function getTsType(value: any): string {
  const type = typeof value;
  if (type === 'string') return 'string';
  if (type === 'number') return 'number';
  if (type === 'boolean') return 'boolean';
  if (Array.isArray(value)) {
    if (value.length > 0) {
      if (typeof value[0] === 'object' && value[0] !== null) {
        return `${toCapitalCase(Object.keys(value[0])[0] || 'Item')}[]`;
      }
      return `${getTsType(value[0])}[]`;
    }
    return 'any[]';
  }
  if (type === 'object' && value !== null) {
    const keys = Object.keys(value);
    return keys.length > 0 ? toCapitalCase(keys[0]) : 'any';
  }
  return 'any';
}

function generateTsInterfaceRecursive(
  json: any,
  interfaceName: string,
  generatedInterfaces: Set<string>
): string {
  let tsInterface = '';
  const currentInterfaceName = toCapitalCase(interfaceName);
  if (generatedInterfaces.has(currentInterfaceName)) return '';
  generatedInterfaces.add(currentInterfaceName);

  tsInterface += `interface ${currentInterfaceName} {\n`;

  if (Array.isArray(json)) {
    if (json.length > 0) {
      const itemType = getTsType(json[0]);
      const itemInterfaceName = currentInterfaceName + 'Item';
      tsInterface += `  [key: string]: ${itemType};\n`;
      if (typeof json[0] === 'object' && json[0] !== null && !Array.isArray(json[0])) {
        tsInterface += generateTsInterfaceRecursive(json[0], itemInterfaceName, generatedInterfaces);
      }
    } else {
      tsInterface += `  [key: string]: any;\n`;
    }
  } else if (typeof json === 'object' && json !== null) {
    for (const key in json) {
      if (Object.prototype.hasOwnProperty.call(json, key)) {
        const value = json[key];
        const tsType = getTsType(value);
        tsInterface += `  ${key}: ${tsType};\n`;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          tsInterface += generateTsInterfaceRecursive(value, key, generatedInterfaces);
        } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
          tsInterface += generateTsInterfaceRecursive(value[0], key + 'Item', generatedInterfaces);
        }
      }
    }
  } else {
    return `type ${currentInterfaceName} = ${typeof json};\n`;
  }

  tsInterface += `}\n`;
  return tsInterface;
}

export const generateTsInterface = (json: any): string => {
  const generatedInterfaces = new Set<string>();
  return generateTsInterfaceRecursive(json, 'RootObject', generatedInterfaces);
};

// ── Go Struct ─────────────────────────────────────────────────────────────────

function getGoType(value: any, keyName: string): string {
  const type = typeof value;
  if (type === 'string') return 'string';
  if (type === 'number') return Number.isInteger(value) ? 'int64' : 'float64';
  if (type === 'boolean') return 'bool';
  if (Array.isArray(value)) {
    if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
      return `[]${toCapitalCase(keyName)}Item`;
    }
    return value.length > 0 ? `[]${getGoType(value[0], keyName)}` : '[]interface{}';
  }
  if (type === 'object' && value !== null) return toCapitalCase(keyName);
  return 'interface{}';
}

function generateGoStructRecursive(
  json: any,
  structName: string,
  generatedStructs: Set<string>
): string {
  let output = '';
  const currentName = toCapitalCase(structName);
  if (generatedStructs.has(currentName)) return '';
  generatedStructs.add(currentName);

  if (typeof json !== 'object' || json === null) return '';

  const data = Array.isArray(json) ? (json[0] ?? {}) : json;

  output += `type ${currentName} struct {\n`;
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      const goType = getGoType(value, key);
      const fieldName = toCapitalCase(toCamelCase(key));
      output += `\t${fieldName} ${goType} \`json:"${key}"\`\n`;
    }
  }
  output += `}\n\n`;

  // 递归生成嵌套 struct
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        output += generateGoStructRecursive(value, key, generatedStructs);
      } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        output += generateGoStructRecursive(value[0], key + 'Item', generatedStructs);
      }
    }
  }
  return output;
}

export const generateGoStruct = (json: any): string => {
  const generatedStructs = new Set<string>();
  return generateGoStructRecursive(json, 'RootObject', generatedStructs);
};

// ── Protobuf ──────────────────────────────────────────────────────────────────

function getProtoType(value: any): string {
  const type = typeof value;
  if (type === 'string') return 'string';
  if (type === 'number') return Number.isInteger(value) ? 'int64' : 'double';
  if (type === 'boolean') return 'bool';
  if (Array.isArray(value)) {
    if (value.length > 0 && typeof value[0] === 'object') return 'repeated bytes';
    return value.length > 0 ? `repeated ${getProtoType(value[0])}` : 'repeated bytes';
  }
  if (type === 'object' && value !== null) return 'bytes';
  return 'bytes';
}

function generateProtobufRecursive(
  json: any,
  messageName: string,
  generatedMessages: Set<string>,
  nestedMessages: string[]
): string {
  const currentName = toCapitalCase(messageName);
  if (generatedMessages.has(currentName)) return '';
  generatedMessages.add(currentName);

  const data = Array.isArray(json) ? (json[0] ?? {}) : json;
  if (typeof data !== 'object' || data === null) return '';

  let output = `message ${currentName} {\n`;
  let fieldIndex = 1;

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      let protoType: string;

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        protoType = toCapitalCase(key);
        const nested = generateProtobufRecursive(value, key, generatedMessages, nestedMessages);
        if (nested) nestedMessages.push(nested);
      } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        const itemName = toCapitalCase(key) + 'Item';
        protoType = `repeated ${itemName}`;
        const nested = generateProtobufRecursive(value[0], key + 'Item', generatedMessages, nestedMessages);
        if (nested) nestedMessages.push(nested);
      } else {
        const baseType = Array.isArray(value)
          ? (value.length > 0 ? `repeated ${getProtoType(value[0])}` : 'repeated bytes')
          : getProtoType(value);
        protoType = baseType;
      }

      output += `  ${protoType} ${toSnakeCase(key)} = ${fieldIndex++};\n`;
    }
  }
  output += `}\n`;
  return output;
}

export const generateProtobuf = (json: any): string => {
  const generatedMessages = new Set<string>();
  const nestedMessages: string[] = [];
  const root = generateProtobufRecursive(json, 'RootObject', generatedMessages, nestedMessages);
  const all = [...nestedMessages, root].filter(Boolean);
  return `syntax = "proto3";\n\npackage example;\n\n${all.join('\n')}`;
};

// ── YAML / XML ────────────────────────────────────────────────────────────────

export const jsonToYaml = (json: any): string => {
  try {
    return yaml.dump(json);
  } catch (e: any) {
    return `# YAML 转换失败: ${e.message}`;
  }
};

export const jsonToXml = (json: any): string => {
  try {
    const options = { compact: true, ignoreComment: true, spaces: 2 };
    return convert.js2xml(json, options);
  } catch (e: any) {
    return `<!-- XML 转换失败: ${e.message} -->`;
  }
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
