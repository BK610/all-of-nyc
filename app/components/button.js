const Button = ({ type, onClick, disabled, className, children }) => {
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
};

export default Button;
