const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'btn bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-400 border-0',
};

const sizes = {
  sm: 'btn-sm',
  md: '',
  lg: 'px-5 py-2.5 text-base',
};

const Button = ({ variant = 'primary', size = 'md', className = '', children, ...props }) => (
  <button className={`${variants[variant]} ${sizes[size]} ${className}`} {...props}>
    {children}
  </button>
);

export default Button;


