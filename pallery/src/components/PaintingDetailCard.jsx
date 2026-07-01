import { useState } from "react";
import Overlay from "./Overlay.jsx";
import TagCard from "./TagCard.jsx";
import SafeLink from "./SafeLink.jsx";
import { updatePainting, deletePainting } from "../api/painting.js";
import ConfirmCard from "./ConfirmCard.jsx";
import { FaPen } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";

const PaintingDetailCard = (props) => {
  const {
    isOpen,
    onClose,
    painting,
    onUpdate,
    onDelete,
    isMobile = false,
  } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: painting.name || "",
    source: painting.source || "",
    tags: painting.tags ? painting.tags.join(",") : "",
    author: painting.author || "",
    authorUrl: painting.authorUrl || "",
    description: painting.description || "",
    visibility: painting.visibility || "public",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updatePainting(painting._id, {
        ...formData,
        tags: formData.tags.split(",").map((t) => t.trim()),
      });

      onUpdate(updated);
      if (onUpdate) onUpdate(updated);
      setIsEditing(false);
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deletePainting(painting._id);
      onClose();
      if (onDelete) onDelete(painting._id);
    } catch (error) {
      console.log("delete error:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border rounded-lg p-1.5 bg-transparent text-sm";

  return (
    <div className="h-full">
      {isOpen && (
        <div className="md:hidden">
          <Overlay zIndex="z-30" onClick={onClose} />
        </div>
      )}
      <aside
        className={
          isMobile
            ? `detail-card transform-animation overflow-y-auto ${isOpen ? "translate-y-0" : "translate-y-[120%]"}`
            : "flex flex-col p-2 overflow-y-auto w-full h-full rounded-xl relative"
        }
      >
        <div className="flex justify-between items-center mb-4">
          {isEditing ? (
            <button
              className="rounded-sm text-lg"
              onClick={handleUpdate}
              disabled={loading}
            >
              <FaSave />
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="rounded-sm">
              <FaPen />
            </button>
          )}

          <button className="hidden md:inline rounded-sm" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="flex flex-col mb-4">
          <span className="text-sm font-semibold mb-1">Name:</span>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
            />
          ) : (
            <SafeLink href={painting.source}>{painting.name}</SafeLink>
          )}
        </div>

        {isEditing && (
          <div className="flex flex-col mb-4">
            <span className="text-sm font-semibold mb-1">Source link:</span>
            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        )}

        <div className="flex flex-col mb-4">
          <span className="text-sm font-semibold mb-1">Tags:</span>
          {isEditing ? (
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="comma separated"
              className={inputClass}
            />
          ) : (
            <div className="flex flex-wrap gap-1">
              {painting.tags &&
                painting.tags.map((tag, index) => (
                  <TagCard key={`${tag}-${index}`}>{tag}</TagCard>
                ))}
            </div>
          )}
        </div>

        <div className="flex flex-col mb-4">
          <span className="text-sm font-semibold mb-1">Author:</span>
          {isEditing ? (
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={inputClass}
            />
          ) : (
            <SafeLink href={painting.authorUrl}>{painting.author}</SafeLink>
          )}
        </div>

        {isEditing && (
          <div className="flex flex-col mb-4">
            <span className="text-sm font-semibold mb-1">
              Author contact link:
            </span>
            <input
              type="text"
              name="authorUrl"
              value={formData.authorUrl}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        )}

        <div className="flex flex-col mb-4">
          <span className="text-sm font-semibold mb-1">Description:</span>
          {isEditing ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={inputClass}
            />
          ) : (
            painting.description && <div>{painting.description}</div>
          )}
        </div>

        {isEditing && (
          <div className="flex flex-col mb-4">
            <span className="text-sm font-semibold mb-1">Visibility</span>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className={inputClass}
            >
              <option
                className="bg-light dark:bg-dark text-dark dark:text-light"
                value="public"
              >
                Public
              </option>
              <option
                className="bg-light dark:bg-dark text-dark dark:text-light"
                value="private"
              >
                Private
              </option>
            </select>
          </div>
        )}

        {!isEditing && (
          <div>
            Uploaded:{" "}
            {new Date(painting.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        )}

        {error && <p className="text-red-500 text-xl mt-2">{error}</p>}

        <ConfirmCard
          isOpen={isConfirmOpen}
          onConfirm={handleDelete}
          onCancel={() => {
            setIsConfirmOpen(false);
          }}
          title="Delete this painting?"
          message="This can't be undone"
        />

        <button
          className="text-red-500 text-xl absolute right-0 bottom-4"
          onClick={() => {
            setIsConfirmOpen(true);
          }}
        >
          <FaRegTrashAlt />
        </button>
      </aside>

      {isConfirmOpen && (
        <Overlay zIndex="z-50" onClick={() => setIsConfirmOpen(false)}>
          {loading && (
            <p className="text-3xl text-red-500 font-semibold">Deleting...</p>
          )}
        </Overlay>
      )}
    </div>
  );
};

export default PaintingDetailCard;
