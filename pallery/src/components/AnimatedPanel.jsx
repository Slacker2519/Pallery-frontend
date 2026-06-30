import { useRef } from "react";
import { FiPlusCircle } from "react-icons/fi";

const AnimatedPanel = (props) => {
  const {
    preview,
    formData,
    onPaintingChange,
    onChange,
    onSubmit,
    loading,
    error,
    painting,
    setPainting,
    setPreview,
  } = props;

  const fileInputRef = useRef(null);
  const expanded = Boolean(painting);

  const handleChangePainting = () => {
    fileInputRef.current.click();
  };

  return (
    // container
    <div
      className="hidden lg:flex flex-col absolute left-1/2 bottom-1/2 shadow-lg rounded-xl
      border border-dark dark:border-light -translate-x-1/2 translate-y-1/2 items-center"
    >
      {/* expandable panel*/}
      <div
        className={`flex h-[50vh] rounded-t-xl bg-light dark:bg-offDark overflow-hidden transition-all duration-500
          ${expanded ? "w-[50vw]" : "justify-center items-center w-[35vw]"}`}
      >
        {/* left panel */}
        <div
          className={`flex h-full relative
            ${expanded ? "w-[70%]" : "justify-center items-center w-full"}`}
        >
          {!expanded ? (
            <button
              onClick={handleChangePainting}
              className="rounded-full text-8xl p-0"
            >
              <FiPlusCircle />
            </button>
          ) : (
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-contain"
            />
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onPaintingChange}
          className="hidden"
        />

        {/* right panel */}
        <div
          className={`overflow-hidden bg-light dark:bg-dark transition-all duration-500 flex flex-col gap-3 p-4 overflow-y-auto
            ${expanded ? "flex-1 opacity-100 delay-100 px-3" : "w-0 opacity-0 px-0"}`}
        >
          {expanded && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={onChange}
                className="border rounded-lg p-2 bg-transparent"
              />
              <input
                type="text"
                name="author"
                placeholder="Author"
                value={formData.author}
                onChange={onChange}
                className="border rounded-lg p-2 bg-transparent"
              />
              <input
                type="text"
                name="authorUrl"
                placeholder="Author URL"
                value={formData.authorUrl}
                onChange={onChange}
                className="border rounded-lg p-2 bg-transparent"
              />
              <input
                type="text"
                name="source"
                placeholder="Source URL"
                value={formData.source}
                onChange={onChange}
                className="border rounded-lg p-2 bg-transparent"
              />
              <input
                type="text"
                name="tags"
                placeholder="Tags (comma separated)"
                value={formData.tags}
                onChange={onChange}
                className="border rounded-lg p-2 bg-transparent"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={onChange}
                className="border rounded-lg p-2 bg-transparent"
                rows={2}
              />
              <select
                name="visibility"
                value={formData.visibility}
                onChange={onChange}
                className="border rounded-lg p-2 bg-transparent"
              >
                <option className="bg-light dark:bg-dark" value="public">
                  Public
                </option>
                <option className="bg-light dark:bg-dark" value="private">
                  Private
                </option>
              </select>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </>
          )}
        </div>
      </div>

      {/* bottom panel */}
      <div className="flex justify-between items-center w-full rounded-b-xl p-5 bg-light dark:bg-dark">
        <button
          onClick={() => {
            setPainting(null);
            setPreview(null);
          }}
          className={`rounded-full border w-[7vw] text-base bg-light dark:bg-offDark ${expanded ? "" : "hidden"}`}
        >
          Change
        </button>

        <button
          onClick={onSubmit}
          disabled={loading}
          className={`rounded-full border w-[7vw] text-base bg-light dark:bg-offDark ${expanded ? "" : "hidden"}`}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default AnimatedPanel;
