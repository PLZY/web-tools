'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslation } from '@/lib/i18n';

type LogFramework = 'logback' | 'log4j2';
type LogLevel = 'INFO' | 'DEBUG' | 'WARN' | 'ERROR' | 'TRACE';

interface LogConfigState {
  appName: string;
  basePath: string;
  rootLevel: LogLevel;
  packageName: string;
  packageLevel: LogLevel;
  maxHistory: number; // days
  maxFileSize: string; // e.g., 10MB
  totalSizeCap: string; // e.g., 2GB
  useAsync: boolean;
  framework: LogFramework;
}

const DEFAULT_CONFIG: LogConfigState = {
  appName: 'my-app',
  basePath: '/var/logs/my-app',
  rootLevel: 'INFO',
  packageName: 'com.example',
  packageLevel: 'DEBUG',
  maxHistory: 30,
  maxFileSize: '10MB',
  totalSizeCap: '2GB',
  useAsync: true,
  framework: 'logback',
};

export default function LogConfigGenerator() {
  const { t } = useTranslation();
  const [config, setConfig] = useState<LogConfigState>(DEFAULT_CONFIG);
  const [generatedXml, setGeneratedXml] = useState('');

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setConfig((prev) => ({ ...prev, useAsync: checked }));
  };
    
  const handleFrameworkChange = (value: LogFramework) => {
      setConfig((prev) => ({...prev, framework: value}));
  }

  // Generate XML logic
  useEffect(() => {
    if (config.framework === 'logback') {
      setGeneratedXml(generateLogback(config, t));
    } else {
      setGeneratedXml(generateLog4j2(config, t));
    }
  }, [config, t]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedXml);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Configuration Panel */}
      <div className="space-y-6">
        <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <CardHeader>
                <CardTitle className="text-slate-950 dark:text-slate-50">{t('logback.title')}</CardTitle>
                <CardDescription className="text-muted-foreground font-medium">{t('logback.config.basic')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {/* Framework Selection */}
                 <div className="space-y-2">
                    <Label className="text-slate-950 dark:text-slate-200 font-bold">{t('logback.config.framework')}</Label>
                    <RadioGroup 
                        defaultValue={config.framework} 
                        onValueChange={(v) => handleFrameworkChange(v as LogFramework)}
                        className="flex space-x-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="logback" id="logback" />
                            <Label htmlFor="logback" className="text-slate-950 dark:text-slate-300">Logback (Spring Boot Default)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="log4j2" id="log4j2" />
                            <Label htmlFor="log4j2" className="text-slate-950 dark:text-slate-300">Log4j2</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="appName" className="text-slate-950 dark:text-slate-300">{t('logback.config.appName')}</Label>
                        <Input 
                            id="appName" 
                            name="appName" 
                            value={config.appName} 
                            onChange={handleInputChange} 
                            placeholder="e.g. order-service" 
                            className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="basePath" className="text-slate-950 dark:text-slate-300">{t('logback.config.logPath')}</Label>
                        <Input 
                            id="basePath" 
                            name="basePath" 
                            value={config.basePath} 
                            onChange={handleInputChange} 
                            placeholder="e.g. /var/logs/order" 
                            className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="rootLevel" className="text-slate-950 dark:text-slate-300">{t('logback.config.level')}</Label>
                        <Select value={config.rootLevel} onValueChange={(v) => handleSelectChange('rootLevel', v)}>
                            <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50">
                                <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="INFO">INFO</SelectItem>
                                <SelectItem value="DEBUG">DEBUG</SelectItem>
                                <SelectItem value="WARN">WARN</SelectItem>
                                <SelectItem value="ERROR">ERROR</SelectItem>
                                <SelectItem value="TRACE">TRACE</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="maxHistory" className="text-slate-950 dark:text-slate-300">{t('logback.config.maxHistory')}</Label>
                        <Input 
                            id="maxHistory" 
                            name="maxHistory" 
                            type="number"
                            value={config.maxHistory} 
                            onChange={handleInputChange} 
                            className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                     <Label className="text-slate-950 dark:text-slate-300">{t('logback.config.packageLevel')}</Label>
                     <div className="flex space-x-2">
                        <Input 
                            name="packageName" 
                            value={config.packageName} 
                            onChange={handleInputChange} 
                            placeholder="Package (e.g. com.myapp)"
                            className="flex-grow bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50"
                        />
                        <Select value={config.packageLevel} onValueChange={(v) => handleSelectChange('packageLevel', v)}>
                            <SelectTrigger className="w-[100px] bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50">
                                <SelectValue placeholder="Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="INFO">INFO</SelectItem>
                                <SelectItem value="DEBUG">DEBUG</SelectItem>
                                <SelectItem value="WARN">WARN</SelectItem>
                                <SelectItem value="ERROR">ERROR</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="maxFileSize" className="text-slate-950 dark:text-slate-300">{t('logback.config.maxFileSize')}</Label>
                        <Input 
                            id="maxFileSize" 
                            name="maxFileSize" 
                            value={config.maxFileSize} 
                            onChange={handleInputChange} 
                            placeholder="10MB" 
                            className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="totalSizeCap" className="text-slate-950 dark:text-slate-300">{t('logback.config.totalCap')}</Label>
                        <Input 
                            id="totalSizeCap" 
                            name="totalSizeCap" 
                            value={config.totalSizeCap} 
                            onChange={handleInputChange} 
                            placeholder="2GB" 
                            className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-50"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2 pt-2 text-slate-950 dark:text-slate-300">
                    <Checkbox 
                        id="useAsync" 
                        checked={config.useAsync}
                        onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="useAsync" className="cursor-pointer font-medium">
                        {t('logback.config.async')}
                    </Label>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Preview Panel */}
      <div className="space-y-6">
        <Card className="h-full flex flex-col bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex flex-col space-y-1.5">
                    <CardTitle className="text-slate-950 dark:text-slate-50">{t('logback.preview.title')}</CardTitle>
                    <CardDescription className="text-muted-foreground font-medium">
                        {config.framework === 'logback' ? 'logback-spring.xml' : 'log4j2.xml'}
                    </CardDescription>
                </div>
                <Button onClick={copyToClipboard} variant="outline" size="sm" className="font-bold border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
                    {t('common.copy')}
                </Button>
            </CardHeader>
            <CardContent className="flex-grow">
                <Textarea 
                    className="font-mono text-xs h-[600px] w-full resize-none bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-950 dark:text-slate-50" 
                    value={generatedXml} 
                    readOnly 
                />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- Helper Functions for XML Generation ---

function generateLogback(config: LogConfigState, t: (k: string) => string): string {
    const asyncAppender = config.useAsync ? `
    <!-- ${t('logback.xml.asyncAppender')} -->
    <appender name="ASYNC_FILE" class="ch.qos.logback.classic.AsyncAppender">
        <!-- ${t('logback.xml.asyncDesc1')} -->
        <discardingThreshold>0</discardingThreshold>
        <!-- ${t('logback.xml.asyncDesc2')} -->
        <queueSize>512</queueSize>
        <!-- ${t('logback.xml.asyncDesc3')} -->
        <appender-ref ref="FILE"/>
    </appender>` : '';

    const rootAppenderRef = config.useAsync ? 'ASYNC_FILE' : 'FILE';

    // We use a helper to escape \${} in template literals
    const V = (name: string) => `\${${name}}`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<configuration scan="true" scanPeriod="60 seconds" debug="false">

    <!-- ${t('logback.xml.appName')} -->
    <property name="APP_NAME" value="${config.appName}" />
    <!-- ${t('logback.xml.logPath')} -->
    <property name="LOG_PATH" value="${config.basePath}" />
    <!-- ${t('logback.xml.maxHistory')} -->
    <property name="MAX_HISTORY" value="${config.maxHistory}" />
    <!-- ${t('logback.xml.maxFileSize')} -->
    <property name="MAX_FILE_SIZE" value="${config.maxFileSize}" />
    <!-- ${t('logback.xml.totalCap')} -->
    <property name="TOTAL_SIZE_CAP" value="${config.totalSizeCap}" />

    <!-- ${t('logback.xml.consolePattern')} -->
    <property name="CONSOLE_LOG_PATTERN" value="%clr(%d{yyyy-MM-dd HH:mm:ss.SSS}){faint} %clr(%5p) %clr(${V('PID:- ')}){magenta} %clr(---){faint} %clr([%15.15t]){faint} %clr(%-40.40logger{39}){cyan} %clr(:){faint} %m%n%wEx"/>
    <!-- ${t('logback.xml.filePattern')} -->
    <property name="FILE_LOG_PATTERN" value="%d{yyyy-MM-dd HH:mm:ss.SSS} %5p ${V('PID:- ')} --- [%t] %-40.40logger{39} : %m%n%wEx"/>

    <!-- ${t('logback.xml.consoleAppender')} -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>${V('CONSOLE_LOG_PATTERN')}</pattern>
            <charset>UTF-8</charset>
        </encoder>
    </appender>

    <!-- ${t('logback.xml.fileAppender')} -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${V('LOG_PATH')}/${V('APP_NAME')}.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- ${t('logback.xml.rollingFormat')}: logs/app.2023-10-01.0.log -->
            <fileNamePattern>${V('LOG_PATH')}/${V('APP_NAME')}.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <!-- ${t('logback.xml.maxHistory')} -->
            <maxHistory>${V('MAX_HISTORY')}</maxHistory>
            <!-- ${t('logback.xml.totalCap')} -->
            <totalSizeCap>${V('TOTAL_SIZE_CAP')}</totalSizeCap>
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>${V('MAX_FILE_SIZE')}</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
        </rollingPolicy>
        <encoder>
            <pattern>${V('FILE_LOG_PATTERN')}</pattern>
            <charset>UTF-8</charset>
        </encoder>
    </appender>
    ${asyncAppender}

    <!-- ${t('logback.xml.packageLevel')} -->
    <logger name="${config.packageName}" level="${config.packageLevel}" />

    <!-- ${t('logback.xml.rootLevel')} -->
    <root level="${config.rootLevel}">
        <appender-ref ref="CONSOLE" />
        <appender-ref ref="${rootAppenderRef}" />
    </root>

</configuration>`;
}

function generateLog4j2(config: LogConfigState, t: (k: string) => string): string {
    const asyncAppender = config.useAsync ? `
        <!-- ${t('logback.xml.asyncAppender')} -->
        <Async name="AsyncFile">
            <AppenderRef ref="RollingFile"/>
            <LinkedTransferQueue/> <!-- 使用无锁队列 -->
            <discardingThreshold>0</discardingThreshold>
        </Async>` : '';

    const rootAppenderRef = config.useAsync ? 'AsyncFile' : 'RollingFile';
    
    // We use a helper to escape \${} in template literals
    const V = (name: string) => `\${${name}}`;

    // Construct the file pattern carefully to avoid template literal confusion
    const dateLookup = '$' + '{date:yyyy-MM}';
    const filePattern = `${V('LOG_PATH')}/${dateLookup}/${V('APP_NAME')}-%d{yyyy-MM-dd}-%i.log.gz`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<!-- monitorInterval: ${t('logback.xml.monitorInterval')} -->
<Configuration status="WARN" monitorInterval="60">

    <Properties>
        <Property name="APP_NAME">${config.appName}</Property>
        <Property name="LOG_PATH">${config.basePath}</Property>
        <Property name="LOG_PATTERN">%d{yyyy-MM-dd HH:mm:ss.SSS} %5p ${V('sys:PID')} --- [%15.15t] %-40.40c{1.} : %m%n%xwEx</Property>
        <Property name="CONSOLE_PATTERN">%style{%d{yyyy-MM-dd HH:mm:ss.SSS}}{dim} %highlight{%5p} %style{${V('sys:PID')}}{magenta} %style{---}{dim} %style{[%15.15t]}{dim} %style{%-40.40c{1.}}{cyan} %style{:}{dim} %m%n%xwEx</Property>
    </Properties>

    <Appenders>
        <!-- ${t('logback.appender.console')} -->
        <Console name="Console" target="SYSTEM_OUT">
            <PatternLayout pattern="${V('CONSOLE_PATTERN')}" charset="UTF-8"/>
        </Console>

        <!-- ${t('logback.appender.file')} -->
        <RollingFile name="RollingFile" fileName="${V('LOG_PATH')}/${V('APP_NAME')}.log"
                     filePattern="${filePattern}">
            <PatternLayout pattern="${V('LOG_PATTERN')}" charset="UTF-8"/>
            <Policies>
                <!-- 按时间滚动: 每天 -->
                <TimeBasedTriggeringPolicy interval="1" modulate="true"/>
                <!-- 按大小滚动: 超过大小 -->
                <SizeBasedTriggeringPolicy size="${config.maxFileSize}"/>
            </Policies>
            <!-- ${t('logback.xml.maxHistory')} -->
            <DefaultRolloverStrategy max="30">
                <Delete basePath="${V('LOG_PATH')}" maxDepth="2">
                    <IfFileName glob="*/${V('APP_NAME')}-*.log.gz" />
                    <IfLastModified age="${config.maxHistory}d" />
                </Delete>
            </DefaultRolloverStrategy>
        </RollingFile>
        ${asyncAppender}
    </Appenders>

    <Loggers>
        <!-- ${t('logback.xml.packageLevel')} -->
        <Logger name="${config.packageName}" level="${config.packageLevel}" additivity="false">
            <AppenderRef ref="Console"/>
            <AppenderRef ref="${rootAppenderRef}"/>
        </Logger>

        <!-- ${t('logback.xml.rootLevel')} -->
        <Root level="${config.rootLevel}">
            <AppenderRef ref="Console"/>
            <AppenderRef ref="${rootAppenderRef}"/>
        </Root>
    </Loggers>

</Configuration>`;
}
