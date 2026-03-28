import React from "react";
import ReactJson from "@microlink/react-json-view";
import { useTheme } from "next-themes";

interface JsonTreeViewerProps {
  json: any;
  filterText: string;
  onPathHover: (path: string) => void;
  onPathLeave: () => void;
  onPathClick: (path: string) => void;
}

const JsonTreeViewer: React.FC<JsonTreeViewerProps> = ({
  json,
  filterText,
  onPathHover,
  onPathLeave,
  onPathClick,
}) => {
  const { theme } = useTheme();

  const handleSelect = (selection: any) => {
    let path = "$";
    selection.namespace.forEach((p: string | number) => {
      if (typeof p === "number") {
        path += `[${p}]`;
      } else {
        path += `.${p}`;
      }
    });
    onPathClick(path);
    onPathHover(path);
  };

  return (
    <div onMouseLeave={onPathLeave} className="w-full h-full">
      <ReactJson
        src={json}
        theme={theme === "dark" ? "ocean" : "rjv-default"}
        onSelect={handleSelect}
        collapsed={false}
        displayDataTypes={false}
        displayObjectSize={false}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
};

export default JsonTreeViewer;
