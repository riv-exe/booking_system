// app/components/layout/footer.js
export default function Footer() {
  return (
    <footer className="border-t border-(--line-color) px-6 md:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-(--shuttle)" />
        <span className="font-display font-bold">
          Badminton<span className="text-(--primary)">PH</span>
        </span>
      </div>
      <p className="text-sm text-(--foreground)/50">
        © 2026 BadmintonPH. All rights reserved.
      </p>
    </footer>
  );
}