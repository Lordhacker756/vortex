export function Footer() {
  return (
    <footer className="border-t py-4 px-6 h-15 w-full backdrop-blur-sm">
      <div className="text-center text-sm text-muted-foreground">
        Created by{" "}
        <a
          className="cursor-pointer relative z-10"
          href="https://www.github.com/Lordhacker756"
          target="_blank"
        >
          ウトカルシュ 🎑
        </a>{" "}
        • {new Date().getFullYear()}
      </div>
    </footer>
  );
}
