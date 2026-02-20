import JsonLab from "@/components/tools/JsonLab";

// 使用容器布局，水平方向不超出视口，垂直方向根据内容自适应
export default function JsonLabPage() {
  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-56px)] overflow-hidden">
      <JsonLab />
    </div>
  );
}
