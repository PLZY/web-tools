import { MavenNode } from './types';

/**
 * 解析 Maven dependency:tree 的输出文本 (支持 -Dverbose)
 */
export const parseMavenTree = (text: string): MavenNode[] => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const rootNodes: MavenNode[] = [];
  const stack: MavenNode[] = [];

  lines.forEach((line, index) => {
    // 1. 清理 [INFO] 前缀
    let cleanLine = line.replace(/^\[INFO\]\s*/, '');
    
    // 2. 根节点检测
    const treeMarkerIndex = cleanLine.search(/(\+-|\\-)/);
    
    // 强制第一行为根节点
    if (index === 0 && treeMarkerIndex === -1) {
       const parts = cleanLine.split(':');
       if(parts.length < 3) return;

       const root: MavenNode = {
         id: `root-${index}`,
         groupId: parts[0] || "unknown",
         artifactId: parts[1] || "unknown",
         type: parts[2] || "jar",
         version: parts[3] || "unknown",
         children: [],
         rawLine: cleanLine,
         depth: 0,
         isConflict: false,
         isDuplicate: false,
         isManaged: false
       };
       rootNodes.push(root);
       
       stack.length = 0;
       stack.push(root);
       return;
    }

    // 如果不是第一行但没有 marker，可能是其他信息，跳过或视为根节点
    if (treeMarkerIndex === -1) {
       // 如果已经有根节点了，这种行通常是干扰信息，跳过
       if (rootNodes.length > 0) return;

       // 否则当作根节点
       const parts = cleanLine.split(':');
       if(parts.length < 3) return;
       const root: MavenNode = {
         id: `root-${index}`,
         groupId: parts[0] || "unknown",
         artifactId: parts[1] || "unknown",
         type: parts[2] || "jar",
         version: parts[3] || "unknown",
         children: [],
         rawLine: cleanLine,
         depth: 0,
         isConflict: false, isDuplicate: false, isManaged: false
       };
       rootNodes.push(root);
       stack.push(root);
       return;
    }

    // 3. 树节点检测
    // 计算深度: 每个 "|  " 或 "   " 为一级，3个字符
    const depth = Math.floor(treeMarkerIndex / 3) + 1;

    // 提取依赖信息字符串
    // cleanLine: "|  +- org.springframework:spring-core:jar:5.3.20:compile"
    // depString: "org.springframework:spring-core:jar:5.3.20:compile"
    // verbose mode: "(org.slf4j:slf4j-api:jar:1.7.25:compile - omitted for duplicate)"
    let depString = cleanLine.substring(treeMarkerIndex + 3).trim();

    // 如果整行被括号包围，先去掉括号
    if (depString.startsWith('(') && depString.endsWith(')')) {
        depString = depString.substring(1, depString.length - 1);
    }
    
    // 4. 状态解析 (Verbose Mode)
    let conflictWinner = undefined;
    let managedVersion = undefined;
    let isConflict = false;
    let isDuplicate = false;
    let isManaged = false;

    // Maven verbose output 可能会把整个节点包在括号里，也可能只是后缀
    // Case 1: (com.example:lib:jar:1.0:compile - omitted for duplicate)
    // Case 2: com.example:lib:jar:1.0:compile (version managed from 0.9)
    
    // 检查是否是整行被括号包围 (Duplicate / Conflict often appears this way)
    if (depString.startsWith('(') && depString.endsWith(')')) {
        depString = depString.substring(1, depString.length - 1); // Remove outer parens
    }

    // 分割主要的依赖部分和后面的注释部分
    // 注意：依赖部分通常没有空格，注释部分有空格 " - omitted..." 或 " (version...)"
    // 先尝试按 " - " 分割 (用于 conflict/duplicate)
    let comment = "";
    if (depString.includes(" - omitted")) {
        const splitIndex = depString.indexOf(" - omitted");
        comment = depString.substring(splitIndex);
        depString = depString.substring(0, splitIndex).trim();
    } else if (depString.includes(" (version managed")) {
        const splitIndex = depString.indexOf(" (version managed");
        comment = depString.substring(splitIndex); // include (
        depString = depString.substring(0, splitIndex).trim();
    } else if (depString.includes(" (")) {
        // Fallback for other comments
        const splitIndex = depString.indexOf(" (");
        comment = depString.substring(splitIndex);
        depString = depString.substring(0, splitIndex).trim();
    }

    // 解析注释内容
    if (comment) {
        if (comment.includes('omitted for conflict')) {
            isConflict = true;
            // 兼容更多格式的冲突提取，如 "omitted for conflict with 1.2.3" 或 "(omitted for conflict with 1.2.3)"
            const match = comment.match(/with\s+([\w\.\-]+)/);
            if (match) conflictWinner = match[1];
        } else if (comment.includes('omitted for duplicate')) {
            isDuplicate = true;
        } else if (comment.includes('version managed from')) {
            isManaged = true;
            // " (version managed from 1.2.3)"
            const match = comment.match(/from\s+([\w\.\-]+)/);
            if (match) managedVersion = match[1];
        }
    }

    const parts = depString.split(':');
    // 如果分割后少于3个部分（非标准GAV），尝试通过冒号提取尽可能多的信息
    if (parts.length < 3) return;

    const node: MavenNode = {
      id: `node-${index}`,
      groupId: parts[0] || "unknown",
      artifactId: parts[1] || "unknown",
      type: parts[2] || "jar",
      version: parts[3] || "unknown",
      scope: parts.length > 4 ? parts[4] : undefined,
      children: [],
      rawLine: line,
      depth: depth,
      isConflict,
      isDuplicate,
      isManaged,
      conflictWinner,
      managedVersion
    };

    // 5. 维护堆栈以建立父子关系
    
    // 如果没有 root，创建一个虚拟 root (防御性编程)
    if (rootNodes.length === 0) {
        const dummyRoot: MavenNode = {
            id: 'root-dummy',
            groupId: 'unknown',
            artifactId: 'root',
            version: '0.0.0',
            type: 'pom',
            children: [],
            depth: 0,
            rawLine: 'root',
            isConflict: false, isDuplicate: false, isManaged: false
        };
        rootNodes.push(dummyRoot);
        stack.push(dummyRoot);
    }

    // 找到正确的父节点：栈顶节点的 depth 必须比当前节点 depth 小 1
    // 如果栈顶 depth >= 当前 depth，说明栈顶是兄弟或侄子，弹出
    while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
      stack.pop();
    }

    // 现在栈顶应该是父节点
    if (stack.length > 0) {
      stack[stack.length - 1].children.push(node);
    } else {
        // 如果栈空了（理论上不应该，因为有 root），只能挂到最近的 root
        rootNodes[rootNodes.length - 1].children.push(node);
    }
    
    // 将当前节点推入栈，作为可能的父节点
    stack.push(node);
  });

  return rootNodes;
};
