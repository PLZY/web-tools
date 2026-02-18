export interface MavenNode {
  id: string;
  groupId: string;
  artifactId: string;
  type: string; // jar, pom, etc.
  version: string;
  scope?: string; // compile, test, provided...
  children: MavenNode[];
  rawLine: string;
  depth: number;
  isConflict?: boolean; // 是否是冲突被忽略的版本 (omitted for conflict)
  isDuplicate?: boolean; // 是否是重复引用 (omitted for duplicate)
  isManaged?: boolean; // 是否是版本被管理 (version managed from)
  conflictWinner?: string; // 如果冲突，谁赢了
  managedVersion?: string; // 如果被管理，原版本是多少
}
