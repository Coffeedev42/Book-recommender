function Button({ type = "primary", icon, label, onClick }) {
  const styles = {
    primary:
      "bg-[var(--primary)] text-white p-2 cursor-pointer active:bg-[var(--primary)]/90 rounded-full",
    secondary:
      "bg-white border w-max active:bg-gray-200/90 cursor-pointer border-[var(--primary)] text-[var(--primary)] p-2 rounded-full",
  };
  return (
    <button className={styles[type]} onClick={onClick}>
      {icon}
      {label}
    </button>
  );
}

export default Button;
