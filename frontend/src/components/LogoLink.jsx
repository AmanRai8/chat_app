import { Github } from "lucide-react";

export default function LogoLink() {
  return (
    <a
      href="https://github.com/AmanRai8/chat_app"
      target="_blank"
      rel="noopener noreferrer"
      className="relative group inline-block w-11 h-11"
    >
      <img
        src="/logo.png"
        alt="WorkTalk Logo"
        className="absolute inset-0 w-11 h-11 transition-opacity duration-300 group-hover:opacity-0"
      />

      <Github className="absolute inset-0 w-11 h-11 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </a>
  );
}
