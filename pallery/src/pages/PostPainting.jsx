import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import { createPainting } from "../api/painting.js";
import Sidebar from "../components/Sidebar.jsx";
import AnimatedPanel from "../components/AnimatedPanel.jsx";
import { FiPlusCircle } from "react-icons/fi";

const PostPainting = () => {
  const [formData, setFormData] = useState({
    name: "",
    source: "",
    tags: "",
    author: "",
    authorUrl: "",
    description: "",
    visibility: "public",
  });
  const [openSideBar, setOpenSideBar] = useState(false);
  const [painting, setPainting] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  const toggleSideBar = () => setOpenSideBar(!openSideBar);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showPreview = () => {
    fileInputRef.current.click();
  };

  const handlePaintingChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPainting(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!painting) {
      setError("Please select a painting");
      return;
    }

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
      setSuccess(true);
      setFormData({
        name: "",
        source: "",
        tags: "",
        author: "",
        authorUrl: "",
        description: "",
        visibility: "public",
      });
      setPainting(null);
      setPreview(null);
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col w-full min-h-screen
      dark:text-light dark:bg-dark bg-light overflow-y-auto overflow-hidden"
    >
      <Sidebar isOpen={openSideBar} onClose={toggleSideBar} />
      <div className="px-3 py-3">
        <button onClick={toggleSideBar}>
          <i className="fa-solid fa-bars text-xl xl:text-2xl"></i>
        </button>
      </div>

      <div className="flex justify-center items-center">
        <AnimatedPanel
          mode="create"
          preview={preview}
          formData={formData}
          onPaintingChange={handlePaintingChange}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          success={success}
          painting={painting}
          setPainting={setPainting}
          setPreview={setPreview}
        />

        <div
          className="lg:hidden flex flex-col w-full h-full max-h-screen
          p-3"
        >
          <div className="flex justify-center mb-5">
            <button
              onClick={showPreview}
              className="flex justify-center items-center w-[90vw] h-[25vh]
              border rounded-lg bg-offLight dark:bg-offDark text-4xl"
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
              placeholder="Painting name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg text-sm"
            />
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
            className="rounded-lg border text-base bg-violet-500 text-light"
          >
            {!error ? (loading ? "Posting..." : "Post") : error}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostPainting;
