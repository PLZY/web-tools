"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/lib/i18n";
import { toast } from "sonner";
import {
  convertKeysToCamelCase,
  unescapeJsonString,
  numbersToString,
  generateJavaPojo,
  formatJson,
} from "@/components/tools/json-lab/json-utils";

export default function TextFormatter() {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('{\n  "user_id": 12345,\n  "user_name": "DogUpUp",\n  "order_details": {\n    "order_id": "SN-20231027-001",\n    "price_amount": 99.9\n  },\n  "escaped_json": "{\\"message\\": \\"This is an escaped string.\\"}"\n}');
  const [outputText, setOutputText] = useState("");

  const handleFormat = useCallback(() => {
    if (!inputText.trim()) {
      setOutputText("");
      return;
    }
    try {
      const parsed = JSON.parse(inputText);
      setOutputText(JSON.stringify(parsed, null, 2));
    } catch (e: any) {
      toast.error("格式化错误: " + e.message);
      setOutputText("无效的JSON");
    }
  }, [inputText, t]);

  const handleMinify = useCallback(() => {
    if (!inputText.trim()) {
      setOutputText("");
      return;
    }
    try {
      const parsed = JSON.parse(inputText);
      setOutputText(JSON.stringify(parsed));
    } catch (e: any) {
      toast.error("压缩错误: " + e.message);
      setOutputText("无效的JSON");
    }
  }, [inputText, t]);

  const handleClear = useCallback(() => {
    setInputText("");
    setOutputText("");
  }, []);

  const handleSnakeToCamel = useCallback(() => {
    try {
      const parsed = JSON.parse(inputText);
      const result = convertKeysToCamelCase(parsed);
      const formattedResult = formatJson(result);
      setInputText(formattedResult);
      setOutputText(formattedResult);
    } catch (e: any) {
      toast.error("转换失败: " + e.message);
    }
  }, [inputText]);

  const handleUnescape = useCallback(() => {
    try {
      const result = unescapeJsonString(inputText);
      setInputText(result);
      setOutputText(result);
    } catch (e: any) {
      toast.error("Unescape失败: " + e.message);
    }
  }, [inputText]);

  const handleNumbersToString = useCallback(() => {
    try {
      const parsed = JSON.parse(inputText);
      const result = numbersToString(parsed);
      const formattedResult = formatJson(result);
      setInputText(formattedResult);
      setOutputText(formattedResult);
    } catch (e: any) {
      toast.error("转换失败: " + e.message);
    }
  }, [inputText]);

  const handleGeneratePojo = useCallback(() => {
    try {
      const parsed = JSON.parse(inputText);
      const result = generateJavaPojo(parsed);
      setOutputText(result);
    } catch (e: any) {
      toast.error("生成POJO失败: " + e.message);
    }
  }, [inputText]);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="space-y-4">
        <Textarea
          className="font-mono text-sm h-[400px] bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50"
          placeholder="在此处粘贴您的JSON文本..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleFormat}>格式化</Button>
          <Button onClick={handleMinify}>压缩</Button>
          <Button onClick={handleClear} variant="outline">清空</Button>
          <Button onClick={handleSnakeToCamel} variant="outline">Snake to Camel</Button>
          <Button onClick={handleUnescape} variant="outline">Unescape</Button>
          <Button onClick={handleNumbersToString} variant="outline">Number to String</Button>
          <Button onClick={handleGeneratePojo} variant="outline">生成Java POJO</Button>
        </div>
      </div>
      <div className="space-y-4">
        <pre className="w-full h-[400px] bg-slate-900 dark:bg-slate-950 text-white dark:text-slate-50 p-4 rounded-md overflow-auto font-mono text-sm">
          <code>{outputText}</code>
        </pre>
      </div>
    </div>
  );
}
