const PaintingFrame = (props) => {
  const { painting, onClick } = props;

  return (
    <div>
      <button onClick={onClick} className="mb-1">
        <img
          id={painting.id}
          src={painting.imageUrl}
          alt={painting.description}
          className="painting"
        />
      </button>
    </div>
  );
};

export default PaintingFrame;
