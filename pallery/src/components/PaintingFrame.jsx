const PaintingFrame = (props) => {
  const { painting, onClick, actionButton } = props;

  return (
    <div>
      <button onClick={onClick} className="mb-1">
        <img
          id={painting.id}
          src={painting.url}
          alt={painting.name}
          className="painting"
        />
      </button>

      {actionButton && (
        <div className="absolute top-1 right-1 z-10">{actionButton}</div>
      )}
    </div>
  );
};

export default PaintingFrame;
