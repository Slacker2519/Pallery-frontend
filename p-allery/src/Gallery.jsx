import { useState } from "react";
import Images from "./images.js"
import ImageFrame from "./ImageFrame.jsx"
import FocusedImage from "./FocusedImage.jsx";
import Overlay from "./Overlay";

const Gallery = (props) => {
    const [ selectedImage, setSelectedImage ] = useState(null);
    const { searchQuery } = props;

    const filteredImages = FindMatches(searchQuery);

    return (
        <div>
            <div className="gallery">
                {filteredImages.map((illust) => (
                    <ImageFrame
                        key={illust.id}
                        illustration={ illust }
                        onClick={() => setSelectedImage(illust)}
                    />
                ))}
            </div>

            {selectedImage && (
                <Overlay zIndex="z-20" onClick={() => setSelectedImage(null)}>
                    <FocusedImage image={selectedImage} />
                </Overlay>
            )}
        </div>
    );
}

function FindMatches(wordToMatch) {
    if (!wordToMatch) return Images;

    const searchWord = wordToMatch.toLowerCase();

    return Images.filter(image => {
        const tags = image.tag.join(' ').toLowerCase();
        const author = image.author.toLowerCase();
        const description = image.description.toLowerCase();

        return tags.includes(searchWord) ||
            author.includes(searchWord) ||
            description.includes(searchWord);
    });
}

export default Gallery;