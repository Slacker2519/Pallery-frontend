import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import AlbumDefaultCover from "../components/AlbumDefaultCover.jsx";
import { createAlbum, updateAlbum } from "../api/album";
import { FaPaintBrush } from "react-icons/fa";
import { FiPlusCircle } from "react-icons/fi";
import { FiMinusCircle } from "react-icons/fi";
import { getUserPaintings } from "../api/user.js";

const CreateAlbum = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const albumIdRef = useRef(null);
  const pendingNavRef = useRef(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);
  const [addedPaintings, setAddedPaintings] = useState([]);
  const [allPaintings, setAllPaintings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [formData, setFormData] = useState({
    name: "Untitled Album",
    description: "",
    visibility: "public",
  });

  useEffect(() => {
    if (!user) { navigate("/"); return; }
    getUserPaintings(user.id).then((data) => setAllPaintings(data.paintings || []));
  }, [user, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const saveAlbum = useCallback(async () => {
    if (!formData.name) return;

    setSaving(true);
    setSaveStatus("Saving...");
    try {
      const data = {
        name: formData.name,
        description: formData.description,
        visibility: formData.visibility,
        paintingIds: addedPaintings.map((p) => p._id),
      };
      if (!albumIdRef.current) {
        const res = await createAlbum(data);
        albumIdRef.current = res.album._id;
      } else {
        await updateAlbum(albumIdRef.current, data);
      }
      setSaveStatus("Saved ✓");
      setIsDirty(false);
    } catch {
      setSaveStatus("Failed to create album.");
    } finally {
      setSaving(false);
    }
  }, [formData, addedPaintings]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaveStatus("");
    setIsDirty(true);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverPreview(URL.createObjectURL(file));
    setIsDirty(true);
  };

  const handleAddPainting = (painting) => {
    if (addedPaintings.find((p) => p._id === painting._id)) return;
    setAddedPaintings([...addedPaintings, painting]);
    setIsDirty(true);
  };

  const handleRemovePainting = (painting) => {
    setAddedPaintings(addedPaintings.filter((p) => p._id !== painting._id));
    setIsDirty(true);
  };

  const safeNavigate = (path) => {
    if (isDirty) {
      pendingNavRef.current = path;
      setShowPrompt(true);
    } else {
      navigate(path);
    }
  };

  const handleStay = () => {
    setShowPrompt(false);
    pendingNavRef.current = null;
  };

  const handleLeave = () => {
    setShowPrompt(false);
    const path = pendingNavRef.current;
    pendingNavRef.current= null;
    setIsDirty(false);
    navigate(path);
  };

  const handleSaveAndLeave = async () => {
    await saveAlbum();
    setShowPrompt(false);
    const path = pendingNavRef.current;
    pendingNavRef.current = null;
    navigate(path);
  };

  const filteredPaintings = allPaintings.filter((painting) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
        painting.name?.toLowerCase().includes(q) ||
        painting.author?.toLowerCase().includes(q) ||
        (painting.tags ? painting.tags.join(" ") : "").toLowerCase().includes(q)
    );
  });

  const addedIds = new Set(addedPaintings.map((p) => p._id));
  const inputClass = "bg-transparent border-b border-gray-400 dark:border-gray-600 focus:outline-none " +
      "focus:border-violet-500 text-sm py-1 w-full transition-colors";

  return (
    <div className="w-full min-h-screen bg-light dark:bg-dark text-dark dark:text-light flex flex-col"
    >
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/*Top page-------------------------------------------------------------------------------------------------------*/}
      <section className="flex w-full justify-between items-center px-5 py-3 sticky top-0 bg-light dark:bg-dark z-10">
        <button onClick={() => setIsSidebarOpen(true)}>
          <i className="fa-solid fa-bars text-xl" />
        </button>
        <span className={`text-base ${saveStatus === "Failed to save" ? "text-red-400" : "text-green-500"}`}>
          {saveStatus}
        </span>
      </section>

      <div className="flex flex-col gap-4 bg-offLight dark:bg-offDark rounded-xl p-4 shadow-sm w-[95%]
      md:w-1/3 xl:w-1/3 mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 items-center mb-4">

          {/*album cover----------------------------------------------------------------------------------------------*/}
          <div className="relative w-full max-w-[200px] aspect-square lg:w-36 lg:h-36 rounded-lg overflow-hidden
          bg-gray-200 dark:bg-gray-700 shrink-0 cursor-pointer group mx-auto lg:mx-0"
               onClick={() => fileInputRef.current.click()}
          >
            {coverPreview
                ? <img src={addedPaintings} alt="cover" className="w-full h-full object-cover" />
                : <AlbumDefaultCover paintings={addedPaintings} />
            }

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity
            flex flex-col items-center justify-center gap-1">
                <FaPaintBrush className="text-white text-xl" />
                <span className="text-white text-xs">Upload cover</span>
            </div>

            <input ref={fileInputRef} type="file" accept="image/*"
                   onChange={handleCoverChange} className="hidden" />
          </div>

          {/* name----------------------------------------------------------------------------------------------------*/}
          <div className="flex flex-col gap-1 w-full lg:flex-1">
            <label className="text-xs text-gray-500 uppercase tracking-wide">Name</label>
            <input type="text" name="name" value={formData.name}
                   onChange={handleChange}
                   className={`${inputClass} text-base md:text-lg font-medium`} />
            <p className="text-xs text-gray-400 mt-1">
              {addedPaintings.length} painting{addedPaintings.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* description-----------------------------------------------------------------------------------------------*/}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 uppercase tracking-wide">Description</label>
          <textarea name="description" value={formData.description}
                    onChange={(e) => {
                      const words = e.target.value.trim().split(/\s+/).filter(Boolean);
                      if (words.length <= 300) handleChange(e);
                    }}
                    rows={3}
                    className={`${inputClass} resize-none border border-gray-400 dark:border-gray-600 rounded-lg 
                    p-2 focus:border-violet-500`}
                    placeholder="Description"
          />
          <span className="text-xs text-gray-400 text-right">
            {formData.description.trim()
            ? formData.description.trim().split(/\s+/).filter(Boolean).length
            : 0} / 300 words
          </span>
        </div>

        <div className="flex gap-3 items-end">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-gray-500 uppercase tracking-wide">Visibility</label>
            <select name="visibility" value={formData.visibility}
                    onChange={handleChange} className={`${inputClass} cursor-pointer`}>
              <option className="dark:bg-dark" value="public">Public</option>
              <option className="dark:bg-dark" value="private">Private</option>
            </select>
          </div>

          <button
              onClick={saveAlbum}
              disabled={saving || !isDirty}
              className={`text-sm px-5 py-2 rounded-lg border transition-colors shrink-0 
              ${isDirty 
                  ? "border-violet-500 text-violet-500 hover:bg-violet-500 hover:text-white"
                  : "border-gray-300 text-gray-300 cursor-not-allowed"}`}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <hr className="border-gray-300 dark:border-gray-600 mt-10 mb-3 mx-8" />

      {/*Browse & add-------------------------------------------------------------------------------------------------*/}
      <div className="flex flex-col gap-4 px-4 md:px-8 py-6 w-full">
        <section className="flex flex-col gap-4">
          <SearchBar
              width="w-full md:w-80"
              height="h-10"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSearchQuery(searchInput);
              }}
          />

          <div className="gallery">
            {filteredPaintings.map((painting) => {
              const isAdded = addedIds.has(painting._id);
              return (
                  <div
                      key={painting._id}
                      className={`relative cursor-pointer rounded-lg overflow-hidden group
                      ${isAdded ? "ring-2 ring-red-500" : ""}`}
                      onClick={() => isAdded
                          ? handleRemovePainting(painting)
                          : handleAddPainting(painting)
                      }>
                    <img
                        src={painting.url}
                        alt={painting.name}
                        className="painting w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                    transition-opacity flex items-center justify-center">
                      {isAdded
                          ? <FiMinusCircle className="text-white text-4xl" />
                          : <FiPlusCircle className="text-white text-4xl" />
                      }
                    </div>
                  </div>
              );
            })}
          </div>

          {filteredPaintings.length === 0 && (
              <p className="text-sm text-gray-400">No paintings found</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default CreateAlbum;
