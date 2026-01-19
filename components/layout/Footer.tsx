export default function Footer() {
  return (
    <footer
      style={{
        padding: 12,
        borderTop: "1px solid var(--border)",
        textAlign: "center",
      }}
    >
      © {new Date().getFullYear()} Expense Management System
    </footer>
  );
}
