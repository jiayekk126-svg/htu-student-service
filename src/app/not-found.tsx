import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-32 gap-4">
      <h1 className="font-heading text-6xl font-bold text-[#003366]">404</h1>
      <p className="text-muted-foreground">页面不存在</p>
      <Link
        href="/"
        className="inline-flex h-9 items-center justify-center rounded-lg bg-[#003366] px-4 text-sm font-medium text-white hover:bg-[#002244] transition-colors"
      >
        返回首页
      </Link>
    </div>
  );
}
