const SearchBar = (props) => {
  const { isHidden, width, height, value, onChange, onKeyDown } = props;

  return (
    <div
      className={`
            ${isHidden ? "hidden" : "flex"}
            ${width} ${height}
            md:flex search-bar
        `}
    >
      <i className="fa-solid fa-magnifying-glass text-xl m-2"></i>
      <input
        type="text"
        className="flex-1 outline-none bg-transparent"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default SearchBar;
