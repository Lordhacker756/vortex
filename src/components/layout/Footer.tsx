export function Footer() {
  return (
    <footer className="border-t py-4 px-6 backdrop-blur-sm bg-white/50">
      <div className="text-center text-sm text-muted-foreground">
        Created by{" "}
        <a href="https://www.github.com/Lordhacker756" target="_blank">
          ウトカルシュ 🎑
        </a>{" "}
        • {new Date().getFullYear()}
      </div>
    </footer>
  );
}
