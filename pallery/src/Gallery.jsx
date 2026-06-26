import { useState } from "react";
import Images from "./images.js";
import PaintingFrame from "./PaintingFrame.jsx";
import FocusedPainting from "./FocusedPainting.jsx";
import Overlay from "./Overlay";

const Gallery = (props) => {
  const [selectedPainting, setselectedPainting] = useState(null);
  const { searchQuery } = props;

  const filteredPainting = FindMatches(searchQuery);

  return (
    <div>
      <div className="gallery">
        {filteredPainting.map((painting, index) => (
          <PaintingFrame
            key={index}
            painting={painting}
            onClick={() => setselectedPainting(painting)}
          />
        ))}
      </div>

      {selectedPainting && (
        <Overlay zIndex="z-20" onClick={() => setselectedPainting(null)}>
          <FocusedPainting painting={selectedPainting} />
        </Overlay>
      )}
    </div>
  );
};

function FindMatches(wordToMatch) {
  if (!wordToMatch) return Images;

  const searchWord = wordToMatch.toLowerCase();

  return Images.filter((painting) => {
    const tags = painting.tag.join(" ").toLowerCase();
    const author = painting.author.toLowerCase();
    const description = painting.description.toLowerCase();

    return (
      tags.includes(searchWord) ||
      author.includes(searchWord) ||
      description.includes(searchWord)
    );
  });
}

export default Gallery;
