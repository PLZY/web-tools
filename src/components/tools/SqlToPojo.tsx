"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, RefreshCw, FileCode } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";

// --- Types ---

interface Column {
  name: string;
  type: string;
  comment?: string;
  isPrimaryKey?: boolean;
  isNullable?: boolean;
  length?: number;
}

interface TableInfo {
  tableName: string;
  className: string;
  comment?: string;
  columns: Column[];
}

interface GeneratorOptions {
  packageName: string;
  useLombok: boolean;
  useJPA: boolean;
  useSwagger: boolean;
  useValidation: boolean;
  author?: string;
}

// --- Parsing Logic ---

const SQL_TYPE_MAPPING: Record<string, string> = {
  'bigint': 'Long',
  'int': 'Integer',
  'integer': 'Integer',
  'tinyint': 'Integer',
  'smallint': 'Integer',
  'mediumint': 'Integer',
  'decimal': 'BigDecimal',
  'numeric': 'BigDecimal',
  'float': 'Float',
  'double': 'Double',
  'bool': 'Boolean',
  'boolean': 'Boolean',
  'char': 'String',
  'varchar': 'String',
  'text': 'String',
  'longtext': 'String',
  'mediumtext': 'String',
  'tinytext': 'String',
  'blob': 'byte[]',
  'longblob': 'byte[]',
  'date': 'LocalDate',
  'datetime': 'LocalDateTime',
  'timestamp': 'LocalDateTime',
  'time': 'LocalTime',
  'json': 'String',
  'jsonb': 'String',
  'uuid': 'String',
  'bit': 'Boolean',
};

const toCamelCase = (str: string, pascal: boolean = false): string => {
  const camel = str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
  return pascal ? camel.charAt(0).toUpperCase() + camel.slice(1) : camel;
};

const parseDDL = (ddl: string): TableInfo | null => {
  try {
    const tableNameMatch = ddl.match(/create\s+table\s+(?:if\s+not\s+exists\s+)?[`"]?(\w+)[`"]?/i);
    if (!tableNameMatch) return null;
    const tableName = tableNameMatch[1];

    const tableCommentMatch = ddl.match(/\)\s*(?:.*?)comment\s*=\s*['"]([^'"]*)['"]/i);
    const tableComment = tableCommentMatch ? tableCommentMatch[1] : undefined;

    const startIndex = ddl.indexOf('(');
    const endIndex = ddl.lastIndexOf(')');
    if (startIndex === -1 || endIndex === -1) return null;

    const columnsContent = ddl.substring(startIndex + 1, endIndex);
    const columnLines = columnsContent.split(/,(?![^(]*\))/);

    const columns: Column[] = [];
    let primaryKeyColumnName: string | null = null;

    const pkMatch = columnsContent.match(/primary\s+key\s*\([`"]?(\w+)[`"]?\)/i);
    if (pkMatch) {
      primaryKeyColumnName = pkMatch[1];
    }

    columnLines.forEach(line => {
      line = line.trim();
      if (!line || line.toUpperCase().startsWith('PRIMARY KEY') || line.toUpperCase().startsWith('KEY') || line.toUpperCase().startsWith('INDEX') || line.toUpperCase().startsWith('UNIQUE KEY') || line.toUpperCase().startsWith('CONSTRAINT')) {
        return;
      }

      const parts = line.split(/\s+/);
      let name = parts[0]?.replace(/[`"]/g, '');
      let typeStr = parts[1];
      
      if (!name || !typeStr) return;

      const typeMatch = typeStr.match(/(\w+)(?:\(.*\))?/);
      const rawType = typeMatch ? typeMatch[1].toLowerCase() : 'varchar';
      
      const javaType = SQL_TYPE_MAPPING[rawType] || 'String';

      const commentMatch = line.match(/comment\s+['"]([^'"]*)['"]/i);
      const comment = commentMatch ? commentMatch[1] : undefined;
      const isNullable = !line.match(/not\s+null/i);
      const isInlinePK = line.match(/primary\s+key/i);

      columns.push({
        name,
        type: javaType,
        comment,
        isPrimaryKey: !!isInlinePK || name === primaryKeyColumnName,
        isNullable
      });
    });

    return {
      tableName,
      className: toCamelCase(tableName, true),
      comment: tableComment,
      columns
    };
  } catch (e) {
    return null;
  }
};

const generateJavaCode = (table: TableInfo, options: GeneratorOptions): string => {
  const { packageName, useLombok, useJPA, useSwagger, useValidation, author } = options;
  const lines: string[] = [];

  if (packageName) {
    lines.push(`package ${packageName};`);
    lines.push('');
  }

  const imports = new Set<string>();
  if (useLombok) {
    imports.add('import lombok.Data;');
    imports.add('import lombok.Builder;');
    imports.add('import lombok.NoArgsConstructor;');
    imports.add('import lombok.AllArgsConstructor;');
  }
  if (useJPA) {
    imports.add('import jakarta.persistence.*;');
  }
  if (useSwagger) {
    imports.add('import io.swagger.v3.oas.annotations.media.Schema;');
  }
  if (useValidation) {
    imports.add('import jakarta.validation.constraints.*;');
  }
  
  if (table.columns.some(c => c.type === 'BigDecimal')) imports.add('import java.math.BigDecimal;');
  if (table.columns.some(c => c.type === 'LocalDate')) imports.add('import java.time.LocalDate;');
  if (table.columns.some(c => c.type === 'LocalDateTime')) imports.add('import java.time.LocalDateTime;');
  if (table.columns.some(c => c.type === 'LocalTime')) imports.add('import java.time.LocalTime;');

  Array.from(imports).sort().forEach(i => lines.push(i));
  if (imports.size > 0) lines.push('');

  lines.push('/**');
  lines.push(` * ${table.comment || table.tableName}`);
  if (author) {
    lines.push(` * @author ${author}`);
  }
  lines.push(' */');

  if (useLombok) {
    lines.push('@Data');
    lines.push('@Builder');
    lines.push('@NoArgsConstructor');
    lines.push('@AllArgsConstructor');
  }
  if (useJPA) {
    lines.push('@Entity');
    lines.push(`@Table(name = "${table.tableName}")`);
  }
  if (useSwagger) {
    lines.push(`@Schema(description = "${table.comment || table.tableName}")`);
  }

  lines.push(`public class ${table.className} {`);
  lines.push('');

  table.columns.forEach(col => {
    const fieldName = toCamelCase(col.name);

    if (col.comment) {
      lines.push(`    /**`);
      lines.push(`     * ${col.comment}`);
      lines.push(`     */`);
      if (useSwagger) {
        lines.push(`    @Schema(description = "${col.comment}")`);
      }
    }

    if (useJPA) {
      if (col.isPrimaryKey) {
        lines.push(`    @Id`);
        if (['Long', 'Integer'].includes(col.type)) {
          lines.push(`    @GeneratedValue(strategy = GenerationType.IDENTITY)`);
        }
      }
      lines.push(`    @Column(name = "${col.name}")`);
    }

    if (useValidation) {
      if (!col.isNullable && !col.isPrimaryKey) {
        lines.push(`    @NotNull`);
      }
      if (col.type === 'String' && col.length) {
         lines.push(`    @Size(max = ${col.length})`);
      }
    }

    lines.push(`    private ${col.type} ${fieldName};`);
    lines.push('');
  });

  if (!useLombok) {
     lines.push(`    // Getters and Setters omitted (Lombok disabled)`);
  }

  lines.push('}');

  return lines.join('\n');
};

const DEFAULT_DDL = `CREATE TABLE \`users\` (
  \`id\` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'User ID',
  \`username\` varchar(50) NOT NULL COMMENT 'Username',
  \`email\` varchar(100) DEFAULT NULL COMMENT 'Email Address',
  \`created_at\` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation Time',
  \`status\` tinyint(4) DEFAULT '1' COMMENT 'Status: 0-Disabled, 1-Enabled',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='User Information Table';`;

export default function SqlToPojo() {
  const { t } = useTranslation();
  const [ddl, setDdl] = useState(DEFAULT_DDL);
  const [generatedCode, setGeneratedCode] = useState("");
  const [options, setOptions] = useState<GeneratorOptions>({
    packageName: "com.example.entity",
    useLombok: true,
    useJPA: true,
    useSwagger: true,
    useValidation: false,
    author: "DogUpUp",
  });

  const handleGenerate = useCallback(() => {
    if (!ddl.trim()) {
      setGeneratedCode("");
      return;
    }

    const tableInfo = parseDDL(ddl);
    if (tableInfo) {
      const code = generateJavaCode(tableInfo, options);
      setGeneratedCode(code);
    } else {
      setGeneratedCode("// Error: Could not parse SQL DDL. Please check the syntax.");
    }
  }, [ddl, options]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success(t('common.copy'));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-950 dark:text-slate-50">
              <FileCode className="h-5 w-5" />
              {t('sql.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              className="font-mono text-sm h-[400px] bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50"
              placeholder={t('sql.input.placeholder')}
              value={ddl}
              onChange={(e) => setDdl(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-950 dark:text-slate-50">Generator Settings</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="package" className="text-slate-950 dark:text-slate-300 font-bold">Package Name</Label>
              <Input 
                id="package" 
                value={options.packageName} 
                onChange={(e) => setOptions({...options, packageName: e.target.value})} 
                className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="author" className="text-slate-950 dark:text-slate-300 font-bold">Author</Label>
              <Input 
                id="author" 
                value={options.author} 
                onChange={(e) => setOptions({...options, author: e.target.value})} 
                className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="lombok" 
                checked={options.useLombok} 
                onCheckedChange={(c) => setOptions({...options, useLombok: !!c})}
              />
              <Label htmlFor="lombok" className="text-slate-950 dark:text-slate-300 font-medium cursor-pointer">{t('sql.config.lombok')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="jpa" 
                checked={options.useJPA} 
                onCheckedChange={(c) => setOptions({...options, useJPA: !!c})}
              />
              <Label htmlFor="jpa" className="text-slate-950 dark:text-slate-300 font-medium cursor-pointer">Use JPA Annotations</Label>
            </div>
             <div className="flex items-center space-x-2">
              <Checkbox 
                id="swagger" 
                checked={options.useSwagger} 
                onCheckedChange={(c) => setOptions({...options, useSwagger: !!c})}
              />
              <Label htmlFor="swagger" className="text-slate-950 dark:text-slate-300 font-medium cursor-pointer">{t('sql.config.swagger')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="validation" 
                checked={options.useValidation} 
                onCheckedChange={(c) => setOptions({...options, useValidation: !!c})}
              />
              <Label htmlFor="validation" className="text-slate-950 dark:text-slate-300 font-medium cursor-pointer">Jakarta Validation</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="h-full flex flex-col bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-slate-950 dark:text-slate-50">{t('sql.result.title')}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleGenerate} className="font-bold border-slate-300 dark:border-slate-700">
                <RefreshCw className="mr-2 h-4 w-4" />
                Regen
              </Button>
              <Button size="sm" onClick={copyToClipboard} className="bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-bold hover:opacity-90">
                <Copy className="mr-2 h-4 w-4" />
                {t('common.copy')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-[500px]">
            <Textarea
              className="font-mono text-sm h-full min-h-[500px] bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50 resize-none"
              readOnly
              value={generatedCode}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
