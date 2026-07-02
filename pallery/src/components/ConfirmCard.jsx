import { createPortal } from "react-dom";

const ConfirmCard = ({ isOpen, onConfirm, onCancel, title, message }) => {
  return createPortal(
    <div
      className={`fixed top-8 left-1/2 -translate-x-1/2 z-60 transition-all duration-400
      ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}`}
    >
      <div className="bg-light dark:bg-dark border border-red-400 rounded-xl p-4 w-[50vw] md:w-[20vw] flex flex-col gap-3 shadow-lg">
        <div>
          <p className="font-medium text-sm text-dark dark:text-light">
            {title}
          </p>
          <p className="text-sm text-offDark dark:text-offLight">{message}</p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="text-sm px-3 py-1.5 text-offDark dark:text-offLight"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="text-sm px-3 py-1.5 bg-red-500 text-white rounded-lg border-none"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ConfirmCard;
