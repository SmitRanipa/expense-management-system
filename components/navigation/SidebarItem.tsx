import Link from "next/link";

export default function SidebarItem({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <li>
      <Link href={href}>{label}</Link>
    </li>
  );
}
