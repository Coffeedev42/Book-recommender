function Button({ type = "primary", icon, label, onClick, className }) {
    const styles = {
        primary:
            "py-3 px-4 cursor-pointer bg-[#D55414] text-white active:bg-[#D55414]/90",
        secondary:
            "py-3 px-4 cursor-pointer  bg-white border active:bg-gray-200/90  border-[#D55414] text-[#D55414] p-2",
        disabled: "bg-gray-200 text-gray-400 p-2 cursor-not-allowed",
        iconed: "cursor-pointer bg-[#D55414] text-white active:bg-[#D55414]/90",
        iconed: "cursor-pointer bg-red-200 text-red-500",
    };
    return (
        <button
            className={`flex item-center gap-2 justify-center text-nowrap rounded-full ${styles[type]} ${className}`}
            onClick={type !== "disabled" ? onClick : () => {}}
        >
            {icon}
            {label}
        </button>
    );
}

export default Button;
