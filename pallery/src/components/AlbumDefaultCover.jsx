const AlbumDefaultCover = (props) => {
  const { paintings } = props;
  const [first, second, third] = paintings;

  if (!first)
      return <div className="w-full h-full bg-offLight dark:bg-offDark" />;

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
            <div className="w-full h-full bg-offLight dark:bg-offDark" />
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
            <div className="w-full h-full bg-offLight dark:bg-offDark" />
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbumDefaultCover;
