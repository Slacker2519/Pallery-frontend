import { useRef } from "react";
import { FiPlusCircle } from "react-icons/fi";

const AnimatedPanel = (props) => {
  const {
    mode = "create",
    preview,
    formData,
    onPaintingChange,
    onChange,
    onSubmit,
    loading,
    error,
    painting,
    cardClass = "",
    isReady,
    errorFor,
    flashClass,
    onFlashEnd,
    success,
  } = props;

  const fileInputRef = useRef(null);
  const expanded = mode === "edit" ? true : Boolean(painting);
  const paintingToShow = preview || (mode === "edit" ? formData.url : null);

  const defaultShadow = cardClass.includes("shadow") ? "" : "shadow-lg";

  const handleChangePainting = () => {
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  return (
      // container
      <div
          className={`hidden lg:flex flex-col absolute left-1/2 bottom-1/2 rounded-xl
      border ${defaultShadow} ${cardClass} -translate-x-1/2 translate-y-1/2
      transition-[border-color,box-shadow] duration-300`}
      >
        {/* expandable panel*/}
        <div
            className={`flex h-[50vh] rounded-t-xl bg-offLight dark:bg-offDark overflow-hidden transition-all duration-500
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
                    src={paintingToShow}
                    alt="preview"
                    className={`w-full h-full object-contain hover:cursor-pointer
                ${loading ? "pointer-events-none" : ""}`}
                    onClick={handleChangePainting}
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
              className={`overflow-hidden bg-light dark:bg-dark transition-all duration-500
            flex flex-col gap-3 p-4 overflow-y-auto
            ${expanded ? "flex-1 opacity-100 delay-100 px-3" : "w-0 opacity-0 px-0"}`}
          >
            {expanded && (
                <>
                  <input
                      data-field="name"
                      onAnimationEnd={() => onFlashEnd("name")}
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={onChange}
                      className={`border rounded-lg p-2 bg-transparent ${flashClass("name")}`}
                  />
                  {errorFor("name") && (
                      <p className="text-xs text-red-500">{errorFor("name")}</p>
                  )}

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
        <div
            className="flex justify-between items-center w-full rounded-b-xl p-5
            bg-light dark:bg-dark"
        >
          {success && <p className="text-sm text-green-500">Painting posted ✓</p>}
          {!expanded && error && <p className="text-sm text-red-500">{error}</p>}

          <button
              onClick={handleChangePainting}
              disabled={loading}
              className={`rounded-full border w-[7vw] text-base bg-light dark:bg-dark
              ${expanded ? "" : "hidden"}`}
          >
            Change
          </button>

          <button
              onClick={onSubmit}
              disabled={loading}
              aria-disabled={!isReady}
              className={`rounded-full border-none w-[7vw] text-base text-white transition-colors
            ${
                  isReady
                      ? "bg-violet-500 hover:bg-violet-600"
                      : "bg-violet-500/30 cursor-not-allowed hover:shadow-none"
              }
            ${expanded ? "" : "hidden"}`}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
  );
};

export default AnimatedPanel;