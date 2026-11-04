import { createPortal } from 'react-dom';

const DeleteAlbumPrompt = ({ loading, onCancel, onConfirm }) =>
    createPortal(
        <>
            <div
                className="fixed inset-0 bg-back/50 backdrop-blur-sm z-[98]"
                onClick={loading ? undefined : onCancel}
            />
            <div className="fixed inset-0 flex items-center justify-center z-[99] pointer-events-none p-4">
                <div className="pointer-events-auto w-full max-w-xs flex flex-col gap-4 p-5 rounded-xl border
                        border-red-500 bg-light dark:bg-dark text-dark dark:text-light shadow-lg"
                >
                    <div className="flex flex-col gap-1">
                        <p className="font-medium text-sm">Delete this album?</p>
                        <p className="text-xs opacity-70">This can't be undone.</p>
                    </div>
                    <div className="flex jutify-end gap-2">
                        <button onClick={onCancel} disabled={loading} className="text-sm px-4 py-1.5 border">
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="text-sm px-4 py-1.5 border-none bg-red-500 text-white hover:bg-red-600"
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body,
    );

export default DeleteAlbumPrompt;