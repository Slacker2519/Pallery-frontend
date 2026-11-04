import { useState, useEffect, useRef, useCallback } from "react";
import { Link, Navigate, useNavigate, useBlocker } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import AlbumDefaultCover from "../components/AlbumDefaultCover.jsx";
import CoverPicker from "../components/CoverPicker";
import { createAlbum, updateAlbum, getAlbum, deleteAlbum } from "../api/album";
import { FiPlusCircle, FiMinusCircle, FiChevronLeft } from "react-icons/fi";
import { getUserPaintings } from "../api/user.js";
import UnsavedPrompt from "../components/UnsavedPrompt.jsx";
import DeleteAlbumPrompt from "../components/DeleteAlbumPrompt.jsx";

const CreateAlbum = ({ albumId = null }) => {
  const INITIAL_FORM = {
    name:"",
    description:"",
    visibility: "public",
  }

  const buildSnapshot = (form, paintings, coverId) =>
      JSON.stringify({
        name:form.name,
        description:form.description,
        visibility:form.visibility,
        paintingIds:paintings.map((p) => p._id),
        coverPaintingId:coverId,
      });

  const { user } = useAuth();
  const navigate = useNavigate();
  const allowLeaveRef = useRef(false);

  const [currentId, setCurrentId] = useState(albumId);
  const [loading, setLoading] = useState(Boolean(albumId));
  const [loadFailed, setLoadFailed] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [addedPaintings, setAddedPaintings] = useState([]);
  const [allPaintings, setAllPaintings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [coverPaintingId, setCoverPaintingId] = useState(null);
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const coverPainting = addedPaintings.find((p) => p._id === coverPaintingId);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
      buildSnapshot(INITIAL_FORM, [], null),
  );
  const isDirty = buildSnapshot(formData, addedPaintings, coverPaintingId) !== savedSnapshot;

  // const statusText = saveStatus === "Saved" && isDirty ? "" : saveStatus;

  const blocker = useBlocker(() => isDirty && !allowLeaveRef.current);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    let ignore = false;

    const load = async () => {
      try {
        const [paintingsData, albumData] = await Promise.all([
          getUserPaintings(user.id),
          albumId ? getAlbum(albumId) : Promise.resolve(null),
        ]);
        if (ignore) return;

        const mine = paintingsData.paintings || [];
        setAllPaintings(mine);
        if (!albumData) return;

        const album = albumData.album;
        if (String(album.ownerId) !== String(user.id)) {
          setForbidden(true);
          return;
        }

        const byId = new Map(mine.map((p) => [p._id, p]));
        const added = (album.paintingIds || []).map((id) => byId.get(id)).filter(Boolean);
        const coverId = added.some((p) => p._id === album.coverPaintingId)
            ? album.coverPaintingId
            : null;
        const form = {
          name: album.name || "",
          description: album.description || "",
          visibility: album.visibility || "public",
        };

        setFormData(form);
        setAddedPaintings(added);
        setCoverPaintingId(coverId);
        setSavedSnapshot(buildSnapshot(form, added, coverId));
      } catch (error) {
        console.log(error);
        if (!ignore) setLoadFailed(true);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [user, albumId, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const saveAlbum = useCallback(async () => {
    if (!formData.name) {
      setSaveStatus("Failed to save: name is required");
      return false;
    }

    const snapshot = buildSnapshot(formData, addedPaintings, coverPaintingId);
    setSaving(true);
    setSaveStatus("Saving...");
    try {
      const data = {
        name: formData.name,
        description: formData.description,
        visibility: formData.visibility,
        paintingIds: addedPaintings.map((p) => p._id),
        coverPaintingId,
      };
      if (currentId) {
        await updateAlbum(currentId, data);
      } else {
        const res = await createAlbum(data);
        setCurrentId(res.album._id);
      }
      setSavedSnapshot(snapshot);
      setSaveStatus("Saved ✓");
      return true;
    } catch {
      setSaveStatus("Failed to save");
      return false;
    } finally {
      setSaving(false);
    }
  }, [formData, addedPaintings, coverPaintingId, currentId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaveStatus("");
  };

  const handleAddPainting = (painting) => {
    if (addedPaintings.find((p) => p._id === painting._id)) return;
    setAddedPaintings([...addedPaintings, painting]);
  };

  const handleRemovePainting = (painting) => {
    setAddedPaintings(addedPaintings.filter((p) => p._id !== painting._id));
    if (painting._id === coverPaintingId) setCoverPaintingId(null);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteAlbum(currentId);
      allowLeaveRef.current = true;
      navigate("/profile", { replace: true });
    } catch (e) {
      console.log(e);
      setDeleting(false);
      setShowDelete(false);
      setSaveStatus("Failed to delete");
    }
  };

  const handleSelectCover = (id) => {
    setCoverPaintingId(id);
    setShowCoverPicker(false);
  };

  if (forbidden) return <Navigate to={`/profile/albums/${albumId}`} replace />;

  if (loading)
    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-light dark:bg-dark
          text-dark dark:text-light"
        >
          Loading...
        </div>
    );

  if (loadFailed)
    return (
        <div className="w-full min-h-screen flex flex-col gap-3 items-center justify-center bg-light dark:bg-dark
          text-dark dark:text-light"
        >
          <p>Album not found</p>
          <Link to="/profile">Back to profile</Link>
        </div>
    )

  const addedIds = new Set(addedPaintings.map((p) => p._id));

  const filteredPaintings = allPaintings.filter((painting) => {
    const isAdded = addedIds.has(painting._id);
    if (filter === "in" && !isAdded) return false;
    if (filter === "out" && isAdded) return false;

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
        painting.name?.toLowerCase().includes(q) ||
        painting.author?.toLowerCase().includes(q) ||
        (painting.tags ? painting.tags.join(" ") : "").toLowerCase().includes(q)
    );
  });

  const inputClass = "bg-transparent border-b border-dark dark:border-light " +
      "focus:outline-none focus:border-violet-500 text-sm py-1 w-full transition-colors " +
      "placeholder:text-dark/50 dark:placeholder:text-light/50";

  return (
    <div className="w-full min-h-screen bg-light dark:bg-dark text-dark dark:text-light flex flex-col">
      {!albumId && (
        <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
        />
      )}

      {blocker.state === "blocked" && (
          <UnsavedPrompt
              onStay={() => blocker.reset()}
              onLeave={() => blocker.proceed()}
              onSaveAndLeave={async () => {
                const ok = await saveAlbum();
                if (ok) blocker.proceed();
                else blocker.reset();
              }}
              loading={saving}
          />
      )}

      {showDelete && (
          <DeleteAlbumPrompt
              loading={deleting}
              onCancel={() => setShowDelete(false)}
              onConfirm={handleDelete}
          />
      )}

      {/*Top page-------------------------------------------------------------------------------------------------------*/}
      <div className="flex items-center gap-4">
        {!albumId && (
            <button onClick={() => setIsSidebarOpen(true)}>
              <i className="fa-solid fa-bars text-xl" />
            </button>
        )}
        {currentId && (
            <Link
                to={`/profile/albums/${currentId}`}
                aria-label="Back to album"
                className="text-5xl p-4"
            >
              <FiChevronLeft />
            </Link>
        )}
      </div>

      {/*Details card-------------------------------------------------------------------------------------------------*/}
      <div className="flex flex-col gap-4 bg-light dark:bg-dark text-dark dark:text-light border border-dark
      dark:border-light rounded-xl p-4 w-[95%] md:w-1/3 xl:w-1/3 mx-auto"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center mb-4">

          {/*Album cover----------------------------------------------------------------------------------------------*/}
          <div className="flex flex-col gap-2 w-full max-w-[200px] lg:w-36 shrink-0 mx-auto lg:mx-0">
            <div className="aspect-square w-full rounded-lg overflow-hidden bg-offLight dark:bg-offDark">
              {coverPainting ? (
                  <img src={coverPainting.url} alt="cover" className="w-full h-full object-cover" />
              ) : (
                  <AlbumDefaultCover paintings={addedPaintings} />
              )}
            </div>
            <button
                onClick={() => setShowCoverPicker(true)}
                disabled={addedPaintings.length === 0}
                className="w-full text-xs border border-dark dark:border-light disabled:opacity-50"
            >
              {addedPaintings.length === 0 ? "Add paintings first" : "Choose cover"}
            </button>
          </div>

          {/* name----------------------------------------------------------------------------------------------------*/}
          <div className="flex flex-col gap-1 w-full lg:flex-1">
            <label className="text-xs text-dark dark:text-light uppercase tracking-wide">Name</label>
            <input type="text" name="name" value={formData.name}
                   placeholder="Album Name"
                   onChange={handleChange}
                   className={`${inputClass} text-base md:text-lg font-medium`} />
            <p className="text-xs text-dark dark:text-light mt-1">
              {addedPaintings.length} painting{addedPaintings.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* description-----------------------------------------------------------------------------------------------*/}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-dark dark:text-light uppercase tracking-wide">Description</label>
          <textarea name="description" value={formData.description}
                    onChange={(e) => {
                      const words = e.target.value.trim().split(/\s+/).filter(Boolean);
                      if (words.length <= 300) handleChange(e);
                    }}
                    rows={3}
                    className={`${inputClass} resize-none border rounded-lg
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
            <label className="text-xs text-dark dark:text-light uppercase tracking-wide">Visibility</label>
            <select name="visibility" value={formData.visibility}
                    onChange={handleChange} className={`${inputClass} cursor-pointer`}>
              <option className="dark:bg-dark" value="public">Public</option>
              <option className="dark:bg-dark" value="private">Private</option>
            </select>
          </div>

          <button
              onClick={saveAlbum}
              disabled={saving || !isDirty}
              className="text-sm px-5 py-2 rounded-lg shrink-0 border-none bg-violet-500 text-white
              transition-colors hover:bg-violet-600
              disabled:bg-violet-500/30 disabled:text-white/50 disabled:cursor-not-allowed
              disabled:hover:bg-violet-500/30 disabled:hover:shadow-none"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        {albumId && (
            <>
              <hr className="border-dark/20 dark:border-light/20" />
              <button
                  onClick={() => setShowDelete(true)}
                  className="self-start text-sm border border-red-500 text-red-500
                  hover:bg-red-500 hover:text-white transition-colors"
              >
                Delete album
              </button>
            </>
        )}
      </div>

      <hr className="border-gray-300 dark:border-gray-600 mt-10 mb-3 mx-8" />

      {/*Browse & add-------------------------------------------------------------------------------------------------*/}
      <div className="flex flex-col gap-4 px-4 md:px-8 py-6 w-full">
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
              width="w-full md:w-80"
              height="h-10"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSearchQuery(searchInput);
              }}
          />

          {albumId && (
              <div className="flex border border-dark dark:border-light rounded-lg overflow-hidden">
                {[
                  { value: "all", label: "All" },
                  { value: "in", label: "In album" },
                  { value: "out", label: "Not in album" },
                ].map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setFilter(option.value)}
                        className={`text-sm px-3 py-1.5 rounded-none
                    ${filter === option.value ? "bg-violet-500 text-white" : ""}`}
                    >
                      {option.label}
                    </button>
                ))}
              </div>
          )}

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
        </div>
      </div>

      {showCoverPicker && (
          <CoverPicker
              paintings={addedPaintings}
              selectedId={coverPaintingId}
              onSelect={handleSelectCover}
              onClose={() => setShowCoverPicker(false)}
          />
      )}
    </div>
  );
};

export default CreateAlbum;
