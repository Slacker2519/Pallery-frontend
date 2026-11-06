const AlbumDefaultCover = ({ paintings = [] }) => {
    const [first, second, third] = paintings;

    // 0 paintings: empty block
    if (!first) {
        return <div className="w-full h-full bg-offLight dark:bg-offDark" />;
    }

    // 1 painting: it becomes the whole cover
    if (!second) {
        return (
            <img src={first.url} alt="" className="w-full h-full object-cover" />
        );
    }

    // 2 paintings: side by side
    if (!third) {
        return (
            <div className="w-full h-full flex">
                <div className="flex-1 overflow-hidden">
                    <img src={first.url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 overflow-hidden">
                    <img src={second.url} alt="" className="w-full h-full object-cover" />
                </div>
            </div>
        );
    }

    // 3 or more: one on the left, two stacked on the right
    return (
        <div className="w-full h-full flex">
            <div className="flex-1 overflow-hidden">
                <img src={first.url} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-hidden">
                    <img src={second.url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 overflow-hidden">
                    <img src={third.url} alt="" className="w-full h-full object-cover" />
                </div>
            </div>
        </div>
    );
};

export default AlbumDefaultCover;