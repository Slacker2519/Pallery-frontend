import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import AlbumDefaultCover from "./AlbumDefaultCover";

const CoverPicker = ({ paintings, selectedId, onSelect, onClose }) =>
    createPortal(
        <>
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[98]"
                onClick={onClose}
            />
            <div className="fixed inset-0 flex items-center justify-center z-[99] pointer-events-none p-4">
                <div
                    className="pointer-events-auto w-full max-w-lg max-h-[80vh] flex flex-col gap-4 p-5
                    rounded-xl border border-dark dark:border-light bg-light dark:bg-dark
                    text-dark dark:text-light shadow-lg"
                >
                    <div className="flex justify-between items-center">
                        <p className="font-medium text-sm">Choose cover</p>
                        <button onClick={onClose} aria-label="Close" className="p-1">
                            <FiX />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 overflow-y-auto p-1">
                        <button
                            onClick={() => onSelect(null)}
                            className={`relative aspect-square p-0 overflow-hidden rounded-lg
                            ${selectedId === null ? "ring-2 ring-violet-500" : ""}`}
                        >
                            <AlbumDefaultCover paintings={paintings} />
                            <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] py-0.5">
                                Default
                            </span>
                        </button>

                        {paintings.map((painting) => (
                            <button
                                key={painting._id}
                                onClick={() => onSelect(painting._id)}
                                className={`aspect-square p-0 overflow-hidden rounded-lg
                                ${selectedId === painting._id ? "ring-2 ring-violet-500" : ""}`}
                            >
                                <img
                                    src={painting.url}
                                    alt={painting.name}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>,
        document.body,
    );

export default CoverPicker;