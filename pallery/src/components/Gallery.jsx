import { useState, useEffect } from "react";
import { getAllPaintings } from "../api/painting.js";
import PaintingFrame from "./PaintingFrame.jsx";
import FocusedPainting from "./FocusedPainting.jsx";
import Overlay from "./Overlay.jsx";

const Gallery = (props) => {
  const [selectedPainting, setselectedPainting] = useState(null);
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = props;

  useEffect(() => {
    getAllPaintings().then((data) => {
      setPaintings(data.paintings);
      setLoading(false);
    });
  }, []);

  const filteredPainting = FindMatches(searchQuery, paintings);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="gallery">
        {filteredPainting.map((painting) => (
          <PaintingFrame
            key={painting._id}
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

function FindMatches(wordToMatch, paintings) {
  if (!wordToMatch) return paintings;

  const searchWord = wordToMatch.toLowerCase();

  return paintings.filter((painting) => {
    const tags = painting.tags.join(" ").toLowerCase();
    const author = painting.author.toLowerCase();
    const description = painting.description.toLowerCase() || "";

    return (
      tags.includes(searchWord) ||
      author.includes(searchWord) ||
      description.includes(searchWord)
    );
  });
}

export default Gallery;
