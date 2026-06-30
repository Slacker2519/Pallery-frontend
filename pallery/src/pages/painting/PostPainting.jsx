import { useState } from "react";
import { createPainting } from "../../api/painting.js";
import Sidebar from "../../components/Sidebar.jsx";
import AnimatedPanel from "../../components/AnimatedPanel.jsx";

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

  const toggleSideBar = () => setOpenSideBar(!openSideBar);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    data.append("painting", painting);
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
    <div className="flex flex-col w-full min-h-screen dark dark:text-light dark:bg-dark">
      <Sidebar isOpen={openSideBar} onClose={toggleSideBar} />
      <div className="px-5 py-4">
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
      </div>
    </div>
  );
};

export default PostPainting;
