function Button({ type = "primary", icon, label, onClick, className }) {
    const styles = {
        primary:
            "bg-[var(--primary)] text-white  cursor-pointer active:bg-[var(--primary)]/90 rounded-full",
        secondary:
            "bg-white border active:bg-gray-200/90 cursor-pointer border-[var(--primary)] text-[var(--primary)] p-2 rounded-full",
    };
    return (
        <button
            className={`flex item-center gap-2 py-3 px-4 justify-center text-nowrap ${styles[type]} ${className}`}
            onClick={onClick}
        >
            {icon}
            {label}
        </button>
    );
}

export default Button;
