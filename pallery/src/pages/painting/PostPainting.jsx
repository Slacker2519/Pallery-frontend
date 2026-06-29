import { useState } from "react";
import { createPainting } from "../../api/painting.js";
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
  const [painting, setPainting] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const HandleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaintingChange = (e) => {
    const file = e.target.files[0];
    setPainting(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!painting) {
      setError("Please select an image");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("image", painting);
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
    <div className="flex justify-center items-center w-full min-h-screen dark dark:text-light dark:bg-dark">
      <AnimatedPanel />
    </div>
  );
};

export default PostPainting;
