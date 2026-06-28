const SafeLink = ({ href, children, className, ...props }) => {
  const handleClick = (e) => {
    if (!href) e.preventDefault();
  };

  return (
    <a
      href={href || "#"}
      target={href ? "_blank" : "_self"}
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
};

export default SafeLink;
