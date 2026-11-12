import { useState, useRef, useEffect } from "react";
import { useNavigate, useBlocker } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import { createPainting } from "../api/painting.js";
import Sidebar from "../components/Sidebar.jsx";
import AnimatedPanel from "../components/AnimatedPanel.jsx";
import UnsavedPrompt from "../components/UnsavedPrompt.jsx";
import { useMissingFieldFlash } from "../hooks/useMissingFieldFlash.js";
import { glowBorder } from "../utils/formGlow.js";
import { FiPlusCircle } from "react-icons/fi";

const INITIAL_FORM = {
  name: "",
  source: "",
  tags: "",
  author: "",
  authorUrl: "",
  description: "",
  visibility: "public",
};

const PostPainting = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [openSideBar, setOpenSideBar] = useState(false);
  const [painting, setPainting] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attempted, setAttempted] = useState(false); // user clicked Post while something was missing
  const [justPosted, setJustPosted] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { flash, flashClass, onFlashEnd } = useMissingFieldFlash();
  const MIN_SIDE = 400;
  const MAX_MB = 10;

  const getImageSize = (file) =>
      new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(url);
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("Couldn't read that image"));
        };
        img.src = url;
      });

  // anything the user has changed from the starting state
  const isDirty =
      painting !== null ||
      Object.keys(INITIAL_FORM).some((key) => formData[key] !== INITIAL_FORM[key]);

  const missing = [];
  if (!painting) missing.push({ field: "image", message: "Choose a painting to post" });
  if (!formData.name.trim()) missing.push({ field: "name", message: "Give your painting a name" });

  const isReady = missing.length === 0;
  const glow = isDirty ? "dirty" : justPosted ? "success" : "none";

  // red text under a field, only after a failed attempt, and only while it's still missing
  const errorFor = (field) =>
      attempted ? (missing.find((m) => m.field === field)?.message ?? null) : null;

  const blocker = useBlocker(isDirty);

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  // browser refresh / closing the tab (the browser shows its own dialog)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const toggleSideBar = () => setOpenSideBar(!openSideBar);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setJustPosted(false);
  };

  const showPreview = () => {
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const handlePaintingChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`That image is too large (max ${MAX_MB} MB)`);
      return;
    }

    try {
      const { width, height } = await getImageSize(file);
      if (Math.min(width, height) < MIN_SIDE) {
        setError(
            `That image is too small (${width}×${height}). Use at least ${MIN_SIDE}px on the shorter side.`,
        );
        return;
      }
    } catch (err) {
      setError(err.message);
      return;
    }

    setError(null);
    setPainting(file);
    setPreview(URL.createObjectURL(file));
    setJustPosted(false);
  };

  // returns true when the painting was posted
  const post = async () => {
    if (missing.length > 0) {
      setAttempted(true);
      flash(missing.map((m) => m.field));
      return false;
    }

    setError(null);
    setLoading(true);

    const data = new FormData();
    data.append("url", painting);
    data.append("name", formData.name);
    data.append("source", formData.source);
    data.append("tags", formData.tags);
    data.append("author", formData.author);
    data.append("authorUrl", formData.authorUrl);
    data.append("description", formData.description);
    data.append("visibility", formData.visibility);

    try {
      await createPainting(data);
      setFormData(INITIAL_FORM);
      setPainting(null);
      setPreview(null);
      setAttempted(false);
      setJustPosted(true);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Something went wrong");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    post();
  };

  return (
      <div
          className="flex flex-col w-full min-h-screen
      dark:text-light dark:bg-dark bg-light overflow-y-auto overflow-hidden"
      >
        <Sidebar isOpen={openSideBar} onClose={toggleSideBar} />

        {blocker.state === "blocked" && (
            <UnsavedPrompt
                title="Do you want to post this painting?"
                onStay={() => blocker.reset()}
                onLeave={() => blocker.proceed()}
                onSaveAndLeave={async () => {
                  const ok = await post();
                  if (ok) blocker.proceed();
                  else blocker.reset(); // not ready or failed: stay on the page
                }}
                loading={loading}
            />
        )}

        <div className="px-3 py-3">
          <button onClick={toggleSideBar}>
            <i className="fa-solid fa-bars text-xl xl:text-2xl"></i>
          </button>
        </div>

        <div className="flex justify-center items-center">
          {/* desktop layout */}
          <AnimatedPanel
              mode="create"
              preview={preview}
              formData={formData}
              onPaintingChange={handlePaintingChange}
              onChange={handleChange}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
              success={justPosted}
              painting={painting}
              setPainting={setPainting}
              setPreview={setPreview}
              cardClass={glowBorder(glow)}
              isReady={isReady}
              errorFor={errorFor}
              flashClass={flashClass}
              onFlashEnd={onFlashEnd}
          />

          {/* mobile layout */}
          <div
              className="lg:hidden flex flex-col w-full h-full max-h-screen
          p-3"
          >
            <div className="flex flex-col items-center mb-5">
              {/* on mobile the painting picker is the field that glows */}
              <button
                  data-field="image"
                  onClick={showPreview}
                  onAnimationEnd={() => onFlashEnd("image")}
                  className={`flex justify-center items-center w-[90vw] h-[25vh]
              border rounded-lg bg-offLight dark:bg-offDark text-4xl
              transition-[border-color,box-shadow] duration-300
              ${glowBorder(glow)} ${flashClass("image")}`}
              >
                {preview === null ? (
                    <FiPlusCircle />
                ) : (
                    <img
                        src={preview}
                        alt="preview"
                        className="w-full h-full object-contain"
                    />
                )}
              </button>

              {errorFor("image") && (
                  <p className="text-xs text-red-500 mt-2">{errorFor("image")}</p>
              )}
              {glow === "success" && (
                  <p className="text-xs text-green-500 mt-2">Painting posted ✓</p>
              )}

              <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePaintingChange}
                  className="hidden"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label className="text-sm font-semibold mb-1">Name</label>
              <input
                  type="text"
                  name="name"
                  data-field="name"
                  placeholder="Painting name"
                  value={formData.name}
                  onChange={handleChange}
                  onAnimationEnd={() => onFlashEnd("name")}
                  className={`w-full p-2 border rounded-lg text-sm ${flashClass("name")}`}
              />
              {errorFor("name") && (
                  <p className="text-xs text-red-500 mt-1">{errorFor("name")}</p>
              )}
            </div>

            <div className="flex flex-col mb-4">
              <label className="text-sm font-semibold mb-1">Source URL</label>
              <input
                  type="text"
                  name="source"
                  placeholder="Painting source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg text-sm"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label className="text-sm font-semibold mb-1">Tags</label>
              <input
                  type="text"
                  name="tags"
                  placeholder="Comma separated"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg text-sm"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label className="text-sm font-semibold mb-1">Author</label>
              <input
                  type="text"
                  name="author"
                  placeholder="Painting author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg text-sm"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label className="text-sm font-semibold mb-1">Author URL</label>
              <input
                  type="text"
                  name="authorUrl"
                  placeholder="Author URL"
                  value={formData.authorUrl}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg text-sm"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label className="text-sm font-semibold mb-1">Description</label>
              <textarea
                  name="description"
                  placeholder="Painting description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg text-sm"
              ></textarea>
            </div>

            <div className="flex flex-col mb-8">
              <label className="text-sm font-semibold mb-1">Visibility</label>
              <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg text-sm"
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

            <button
                onClick={handleSubmit}
                disabled={loading}
                aria-disabled={!isReady}
                className={`rounded-lg border-none text-base text-white transition-colors
              ${isReady
                    ? "bg-violet-500 hover:bg-violet-600"
                    : "bg-violet-500/30 cursor-not-allowed hover:shadow-none"}`}
            >
              {loading ? "Posting..." : justPosted ? "Posted ✓" : "Post"}
            </button>
            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      </div>
  );
};

export default PostPainting;