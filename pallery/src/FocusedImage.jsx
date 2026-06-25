import { useState } from "react";
import ImageDetailCard from './ImageDetailCard.jsx'

const FocusedImage = (props) => {
    const { image } = props;
    const [openDetail, setOpenDetail] = useState(false);

    return (
        <div className="focused-image">
            <div className="focused-image-container animate-zoomIn">
                <img
                    src={image.imageUrl}
                    alt={image.description}
                    className="max-w-[80vw] md:max-w-[55vw] max-h-[80vh] object-contain"
                />
                <button
                    className="absolute top-2 md:top-4 right-1 md:right-3 rounded-full"
                    onClick={() => setOpenDetail(!openDetail)}
                >
                    <i className="fa-solid fa-ellipsis-vertical text-xl md:text-2xl text-green-400"></i>
                </button>
            </div>
            {openDetail && (
                <div>
                    <ImageDetailCard
                        isOpen={openDetail}
                        onClose={() => setOpenDetail(false)}
                        tags={image.tag}
                        author={image.author}
                        description={image.description}
                    />
                </div>
            )}
        </div>
    );
}

export default FocusedImage;