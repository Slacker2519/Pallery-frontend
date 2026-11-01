const AlbumDefaultCover = (props) => {
  const { paintings } = props;
  const [first, second, third] = paintings;

  if (!first)
    return (
      <div
        className="w-full h-full flex items-center justify-center
      text-gray-400 text-sm text-center px-4"
      ></div>
    );

  return (
    <div className="w-full h-full flex">
      <div className="flex-1 rounded-l-lg overflow-hidden">
        {first && (
          <img src={first.url} alt="" className="w-full h-full object-cover" />
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 rounded-tr-lg overflow-hidden">
          {second ? (
            <img
              src={second.url}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
          )}
        </div>

        <div className="flex-1 rounded-br-lg overflow-hidden">
          {third ? (
            <img
              src={third.url}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbumDefaultCover;
