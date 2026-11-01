const MiniPainting = (props) => {
  const { painting, actionIcon, onAction, faded } = props;

  return (
    <div
      className={`relative rounded-lg overflow-hidden transition-opacity duration-500
      ${faded ? "opacity-30 pointer-events-none" : "opacity-100"}`}
    >
      <img
        src={painting.url}
        alt={painting.name}
        className="w-full h-full object-cover aspect-square"
      />
      <button
        onClick={() => onAction(painting)}
        className="absolute top-1 right-1 z-10
        bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center
        text-xs border-none hover:bg-black/80 transition-colors"
      >
        {actionIcon}
      </button>
    </div>
  );
};

export default MiniPainting;
