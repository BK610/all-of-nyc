interface ButtonProps {
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function Button({
  type = "button",
  onClick,
  disabled = false,
  className,
  children,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${className} px-4 py-2 bg-nyc-orange text-white rounded-lg hover:bg-orange-700`}
    >
      {children}
    </button>
  );
}
