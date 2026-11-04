import { createPortal } from 'react-dom';
import { FaXmark } from "react-icons/fa6";

const UnsavedPrompt = ({ onStay, onLeave, onSaveAndLeave, loading }) => createPortal(
    <>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-98" />
        <div className="fixed inset-0 flex items-center justify-center z-99 pointer-events-none">
            <div className="pointer-events-auto bg-light dark:bg-dark border border-gray-300
        dark:border-gray-700 rounded-xl shadow-lg p-6 w-80 flex flex-col gap-4">

                {/* header */}
                <div className="flex justify-between items-start">
                    <p className="font-medium text-sm text-dark dark:text-light">Do you want to save this album?</p>
                    <button onClick={onStay} className="text-gray-400 hover:text-gray-600 border-none p-0 ml-2">
                        <FaXmark />
                    </button>
                </div>

                <p className="text-xs text-gray-500">Your changes will be lost if you leave without saving.</p>

                {/* buttons */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onLeave}
                        className="text-sm text-red-500 px-4 py-1.5 rounded-lg border border-red-500"
                    >
                        No
                    </button>
                    <button
                        onClick={onSaveAndLeave}
                        disabled={loading}
                        className="text-sm px-4 py-1.5 rounded-lg border border-violet-500
                        text-violet-500 hover:bg-violet-500 hover:text-white transition-colors"
                    >
                        {loading ? "Saving..." : "Yes"}
                    </button>
                </div>

            </div>
        </div>
    </>,
    document.body
);

export default UnsavedPrompt;