const TagCard = (props) => {
  const { children } = props;

  return (
    <div
      className="border border-dark dark:border-light text-dark dark:text-light
        rounded-sm text-center p-1 inline-block wrap-break-words m-1"
    >
      {children}
    </div>
  );
};

export default TagCard;
