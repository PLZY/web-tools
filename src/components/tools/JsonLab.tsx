import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Code, LayoutDashboard, Search, XCircle, Expand } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";
import JsonTreeViewer from "@/components/tools/json-lab/JsonTreeViewer";
import { generateJavaPojo, generateTsInterface, generateGoStruct, convertKeysToCamelCase, convertKeysToSnakeCase, yamlToJson, unescapeJsonString, forceLongToString, jsonPathQuery, isDDL, minifyJson, formatJson, autoRepairJson } from "@/components/tools/json-lab/json-utils";


export default function JsonLab() {
  const { t } = useTranslation();
  const parsedRef = useRef<any>(null);
  const [jsonInput, setJsonInput] = useState<string>("{ \"name\": \"DogUpUp\", \"age\": 3, \"city\": \"Beijing\" }");
  const [formattedJson, setFormattedJson] = useState<string>("");
  const [strictMode, setStrictMode] = useState<boolean>(false);
  const [targetLanguage, setTargetLanguage] = useState<string>("java-pojo"); // java-pojo, ts-interface, go-struct
  const [filterText, setFilterText] = useState<string>("");
  const [jsonPath, setJsonPath] = useState<string>("$"); // For breadcrumbs
  const [activePill, setActivePill] = useState<string | null>(null); // For active pill highlighting

  const filteredJson = useMemo(() => {
    if (!filterText) {
      return parsedRef.current;
    }

    const lowerCaseFilter = filterText.toLowerCase();

    const filter = (data: any): any => {
      if (Array.isArray(data)) {
        const filtered = data.map(filter).filter(item => item !== undefined);
        return filtered.length > 0 ? filtered : undefined;
      }

      if (typeof data === "object" && data !== null) {
        const filtered: { [key: string]: any } = {};
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            if (key.toLowerCase().includes(lowerCaseFilter)) {
              filtered[key] = data[key];
            } else {
              const result = filter(data[key]);
              if (result !== undefined) {
                filtered[key] = result;
              }
            }
          }
        }
        return Object.keys(filtered).length > 0 ? filtered : undefined;
      }

      if (typeof data === "string" && data.toLowerCase().includes(lowerCaseFilter)) {
        return data;
      }
      
      return undefined;
    };

    return filter(parsedRef.current);
  }, [filterText, jsonInput]);

  // Placeholder Pill Action Functions
  const handleToPojo = useCallback(() => {
    setActivePill("toJava");
    try {
      const repairedJson = autoRepairJson(jsonInput);
      const parsed = JSON.parse(repairedJson);
      setFormattedJson(generateJavaPojo(parsed));
    } catch (e: any) {
      toast.error(t("jsonLab.error.parse") + ": " + e.message);
    }
  }, [jsonInput, t]);

  const handleToTs = useCallback(() => {
    setActivePill("toTs");
    try {
      const repairedJson = autoRepairJson(jsonInput);
      const parsed = JSON.parse(repairedJson);
      setFormattedJson(generateTsInterface(parsed));
    } catch (e: any) {
      toast.error(t("jsonLab.error.parse") + ": " + e.message);
    }
  }, [jsonInput, t]);

  const handleXmlToJson = useCallback(() => {
    setActivePill("xmlToJson");
    // Implement XML to JSON conversion logic here
    toast.info(t("jsonLab.pill.xmlToJson.action"));
  }, [t]);

  const handleYamlToJson = useCallback(() => {
    setActivePill("yamlToJson");
    try {
      setFormattedJson(yamlToJson(jsonInput));
    } catch (e: any) {
      toast.error(t("jsonLab.error.yaml") + ": " + e.message);
    }
  }, [jsonInput, t]);

  const handleSnakeToCamelCase = useCallback(() => {
    setActivePill("snakeToCamel");
    try {
      const repairedJson = autoRepairJson(jsonInput);
      const parsed = JSON.parse(repairedJson);
      const converted = convertKeysToCamelCase(parsed);
      setJsonInput(formatJson(converted));
      setFormattedJson(formatJson(converted));
    } catch (e: any) {
      toast.error(t("jsonLab.error.snakeToCamel") + ": " + e.message);
    }
  }, [jsonInput, t]);

  const handleCamelToSnakeCase = useCallback(() => {
    setActivePill("camelToSnake");
    try {
      const repairedJson = autoRepairJson(jsonInput);
      const parsed = JSON.parse(repairedJson);
      const converted = convertKeysToSnakeCase(parsed);
      setJsonInput(formatJson(converted));
      setFormattedJson(formatJson(converted));
    } catch (e: any) {
      toast.error(t("jsonLab.error.camelToSnake") + ": " + e.message);
    }
  }, [jsonInput, t]);

  const handleValidator = useCallback(() => {
    setActivePill("validator");
    try {
      JSON.parse(autoRepairJson(jsonInput));
      toast.success(t("jsonLab.validator.success"));
    } catch (e: any) {
      toast.error(t("jsonLab.validator.error") + ": " + e.message);
    }
  }, [jsonInput, t]);

  const handleJsonPathTester = useCallback(() => {
    setActivePill("jsonPathTester");
    const path = prompt(t("jsonLab.jsonPathTester.prompt"), jsonPath);
    if (path === null) return;
    try {
      const repairedJson = autoRepairJson(jsonInput);
      const parsed = JSON.parse(repairedJson);
      const result = jsonPathQuery(parsed, path);
      if (result !== undefined) {
        setFormattedJson(formatJson(result));
        toast.success(t("jsonLab.jsonPathTester.success"));
      } else {
        toast.error(t("jsonLab.jsonPathTester.notFound"));
      }
    } catch (e: any) {
      toast.error(t("jsonLab.error.jsonPath") + ": " + e.message);
    }
  }, [jsonInput, jsonPath, t]);

  const handleForceLongToString = useCallback(() => {
    setActivePill("forceLongToString");
    try {
      const repairedJson = autoRepairJson(jsonInput);
      const parsed = JSON.parse(repairedJson);
      const converted = forceLongToString(parsed);
      setJsonInput(formatJson(converted));
      setFormattedJson(formatJson(converted));
    } catch (e: any) {
      toast.error(t("jsonLab.error.forceLongToString") + ": " + e.message);
    }
  }, [jsonInput, t]);

  const pills = [
    { label: t("jsonLab.pill.toJava.label"), action: handleToPojo, id: "toJava" },
    { label: t("jsonLab.pill.toTs.label"), action: handleToTs, id: "toTs" },
    { label: t("jsonLab.pill.xmlToJson.label"), action: handleXmlToJson, id: "xmlToJson" },
    { label: t("jsonLab.pill.yamlToJson.label"), action: handleYamlToJson, id: "yamlToJson" },
    { label: t("jsonLab.pill.snakeToCamel.label"), action: handleSnakeToCamelCase, id: "snakeToCamel" },
    { label: t("jsonLab.pill.camelToSnake.label"), action: handleCamelToSnakeCase, id: "camelToSnake" },
    { label: t("jsonLab.pill.validator.label"), action: handleValidator, id: "validator" },
    { label: t("jsonLab.pill.jsonPathTester.label"), action: handleJsonPathTester, id: "jsonPathTester" },
    { label: t("jsonLab.pill.forceLongToString.label"), action: handleForceLongToString, id: "forceLongToString" },
    // Add more pills here (total 20+)
  ];

  const handleFormat = useCallback(() => {
    try {
      const formatted = formatJson(jsonInput);
      setFormattedJson(formatted); // Update formattedJson with formatted string
      parsedRef.current = JSON.parse(formatted); // Update parsedRef with parsed object
    } catch (e: any) {
      toast.error(t("jsonLab.error.format") + ": " + e.message);
      setFormattedJson(""); // Clear formattedJson on error
      parsedRef.current = null;
    }
  }, [jsonInput, t]);

  const handleMinify = useCallback(() => {
    if (!jsonInput.trim()) {
      setFormattedJson("");
      return;
    }
    try {
      const minified = minifyJson(jsonInput);
      setFormattedJson(minified);
    } catch (e: any) {
      toast.error(t("jsonLab.error.minify") + ": " + e.message);
      setFormattedJson("// " + t("jsonLab.error.minify") + ": " + e.message);
    }
  }, [jsonInput, t]);

  const handleUnescape = useCallback(() => {
    if (!jsonInput.trim()) {
      setJsonInput("");
      return;
    }
    try {
      const unescaped = unescapeJsonString(jsonInput);
      setJsonInput(unescaped);
      setFormattedJson(formatJson(unescaped)); // Format after unescaping for display
    } catch (e: any) {
      toast.error(t("jsonLab.error.unescape") + ": " + e.message);
    }
  }, [jsonInput, t]);

  const handleAutoRepair = useCallback(() => {
    if (!jsonInput.trim()) {
      setJsonInput("");
      return;
    }
    try {
      const repaired = autoRepairJson(jsonInput);
      setJsonInput(repaired);
      setFormattedJson(formatJson(repaired)); // Format after repairing for display
      toast.success(t("jsonLab.cockpit.autoRepairSuccess"));
    } catch (e: any) {
      toast.error(t("jsonLab.error.autoRepair") + ": " + e.message);
    }
  }, [jsonInput, t]);

  // Helper function to get a node by JSONPath


  useEffect(() => {
    try {
      const repairedJson = autoRepairJson(jsonInput);
      const parsed = JSON.parse(repairedJson);
      parsedRef.current = parsed;
      setFormattedJson(formatJson(parsed));
    } catch (e) {
      parsedRef.current = null;
      setFormattedJson(jsonInput);
    }
  }, [jsonInput]);


  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t("common.copied"));
  }, [t]);

  // This function is now responsible for showing generated code in the right panel
  const generateCode = useCallback(() => {
    try {
      const repairedJson = autoRepairJson(jsonInput);
      const parsed = JSON.parse(repairedJson);
      let generated = "";
      if (targetLanguage === "java-pojo") {
        generated = generateJavaPojo(parsed);
      } else if (targetLanguage === "ts-interface") {
        generated = generateTsInterface(parsed);
      } else if (targetLanguage === "go-struct") {
        generated = generateGoStruct(parsed);
      }
      setFormattedJson(generated);
      toast.success(t("jsonLab.generate.success"));
    } catch (e: any) {
      toast.error(t("jsonLab.error.generate") + ": " + e.message);
    }
  }, [jsonInput, targetLanguage, t]);

  const handlePath = useCallback((path: string) => {
    setJsonPath(path);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 左侧：配置驾驶舱 */}
      <div className="space-y-4">
        <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-950 dark:text-slate-50">
              <LayoutDashboard className="h-5 w-5" />
              {t("jsonLab.cockpit.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              className="font-mono text-sm h-[250px] bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50"
              placeholder={t("jsonLab.input.placeholder")}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleUnescape} variant="outline" size="sm">{t("jsonLab.cockpit.unescape")}</Button>
              <Button onClick={handleMinify} variant="outline" size="sm">{t("jsonLab.cockpit.minify")}</Button>
              <Button onClick={handleAutoRepair} variant="outline" size="sm">{t("jsonLab.cockpit.autoRepair")}</Button> {/* Auto-repair button */}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="strictMode"
                checked={strictMode}
                onCheckedChange={(c) => setStrictMode(!!c)}
              />
              <Label htmlFor="strictMode" className="text-slate-950 dark:text-slate-300 font-medium cursor-pointer">{t("jsonLab.cockpit.strictMode")}</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetLanguage" className="text-slate-950 dark:text-slate-300 font-bold">{t("jsonLab.cockpit.generateCode")}</Label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger id="targetLanguage" className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50">
                  <SelectValue placeholder={t("jsonLab.cockpit.selectTarget")}/>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50">
                  <SelectItem value="java-pojo">Java POJO</SelectItem>
                  <SelectItem value="ts-interface">TypeScript Interface</SelectItem>
                  <SelectItem value="go-struct">Go Struct</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={generateCode} className="w-full mt-2">{t("jsonLab.cockpit.generateButton")}</Button>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-950 dark:text-slate-300 font-bold">{t("jsonLab.pill.directoryTitle")}</Label>
              <div className="flex flex-wrap gap-2">
                {pills.map((pill) => (
                  <Button
                    key={pill.id}
                    variant={activePill === pill.id ? "default" : "outline"}
                    size="sm"
                    onClick={pill.action}
                    className={activePill === pill.id ? "bg-blue-600 text-white" : "border-slate-300 dark:border-slate-700"}
                  >
                    {pill.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* 右侧：交互式编辑器 */}
      <div className="space-y-4">
        <Card className="h-full flex flex-col bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-slate-950 dark:text-slate-50">{t("jsonLab.editor.title")}</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => copyToClipboard(formattedJson)} className="bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-bold hover:opacity-90">
                <Copy className="mr-2 h-4 w-4" />
                {t("common.copy")}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-[500px] flex flex-col space-y-2">
            {/* Search input for structured filtering */}
            <div className="flex items-center gap-2">
              <Input
                placeholder={t("jsonLab.editor.filterPlaceholder")}
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="flex-1 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50"
              />
              <Button variant="outline" size="sm" onClick={() => setFilterText("")}>
                <XCircle className="h-4 w-4 mr-2"/>
                {t("common.clearSearch")}
              </Button>
            </div>

            {/* Breadcrumbs for JSONPath */}
            <div className="min-h-[24px] text-sm text-muted-foreground break-all" onClick={() => copyToClipboard(jsonPath)}>
              {t("jsonLab.editor.currentPath")}: <span className="font-mono cursor-pointer hover:text-foreground">{jsonPath}</span>
            </div>

            {/* Interactive JSON Tree Viewer Placeholder */}
            <div className="flex-1 font-mono text-sm overflow-auto bg-[#0d1117] border border-slate-300 dark:border-slate-800 rounded p-2 code-stream-background scanline-filter">
              {parsedRef.current ? (
                <JsonTreeViewer
                  json={filteredJson || {}}
                  filterText={filterText}
                  onPathHover={handlePath}
                  onPathLeave={() => handlePath("$")}
                  onPathClick={handlePath}
                />
              ) : (
                <Textarea
                  className="font-mono text-sm h-full bg-slate-50 dark:bg-slate-900 border-none text-slate-950 dark:text-slate-50 resize-none focus-visible:ring-0"
                  readOnly
                  value={formattedJson} // Display error or generated code here
                />
              )}
            </div>

          </CardContent>
        </Card>


      </div>
    </div>
  );
}
