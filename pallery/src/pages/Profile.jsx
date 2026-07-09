import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUser, getUserPaintings, getUserAlbums } from "../api/user";
import { MdLogout } from "react-icons/md";
import Sidebar from "../components/Sidebar";
import PaintingFrame from "../components/PaintingFrame";
import FocusedPainting from "../components/FocusedPainting";
import Overlay from "../components/Overlay";
import { FaPen } from "react-icons/fa";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [paintings, setPaintings] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const [userData, paintingsData, albumsData] = await Promise.all([
          getUser(user.id),
          getUserPaintings(user.id),
          getUserAlbums(user.id),
        ]);
        setUserInfo(userData.user);
        setPaintings(paintingsData.paintings);
        setAlbums(albumsData.albums);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      moth: "long",
      day: "numeric",
    });
  };

  if (loading)
    return (
      <div className="w-full min-h-screen flex items-center justify-center dark:bg-dark dark:text-light">
        Loading...
      </div>
    );

  return (
    <div className="w-full min-h-screen dark:bg-dark dark:text-light bg-light text-black">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex justify-between items-center px-4 py-3">
        <button onClick={() => setSidebarOpen(true)}>
          <i className="fa-solid fa-bars text-xl" />
        </button>
        <button
          onClick={handleLogout}
          className="text-lg px-2 py-2 rounded-lg border-2 border-red-500 text-red-500"
        >
          <MdLogout />
        </button>
      </div>

      <div className="px-6 pb-10 flex flex-col gap-8">
        <section className="flex items-start gap-7 p-5 dark:bg-offDark bg-offLight rounded-lg w-fit">
          <div className="w-20 h-20 rounded-full bg-violet-500 flex items-center justify-center text-2xl text-white font-medium">
            {userInfo?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-medium">{userInfo?.name}</h1>
            <p className="text-sm text-gray-400">{userInfo?.email}</p>
            <p className="text-sm text-gray-400">
              Joined {formatDate(userInfo?.createdAt)}
            </p>
          </div>
          <button
            onClick={() => navigate("/profile/update")}
            className="text-sm dark:text-light text-dark"
          >
            <FaPen />
          </button>
        </section>

        <hr className="border-gray-300 dark:border-gray-700" />

        <section>
          <h2 className="text-lg font-medium mb-4">Albums ({albums.length})</h2>
          {albums.length === 0 ? (
            <p className="text-sm text-gray-500">No albums yet</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {albums.map((album) => (
                <div
                  key={album._id}
                  className="border rounded-lg p-4 flex flex-col gap-2 cursor-pointer
                            hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <p className="font-medium text-sm">{album.name}</p>
                  <p className="text-xs text-gray-500">
                    {album.paintingIds?.length || 0} paintings
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <hr className="border-gray-300 dark:border-gray-700" />

        <section>
          <h2 className="text-lg font-medium mb-4">
            Paintings ({paintings.length})
          </h2>
          {paintings.length === 0 ? (
            <p className="text-sm text-gray-500">No paintings yet</p>
          ) : (
            <div className="gallery">
              {paintings.map((painting) => (
                <PaintingFrame
                  key={painting._id}
                  painting={painting}
                  onClick={() => setSelectedPainting(painting)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedPainting && (
        <Overlay zIndex="z-30" onClick={() => setSelectedPainting(null)}>
          <FocusedPainting
            painting={selectedPainting}
            onClose={() => setSelectedPainting(null)}
            onUpdate={(updated) => {
              setPaintings(
                paintings.map((p) => (p._id === updated._id ? updated : p)),
              );
              setSelectedPainting(updated);
            }}
            onDelete={(id) => {
              setPaintings(paintings.filter((p) => p._id !== id));
              setSelectedPainting(null);
            }}
          />
        </Overlay>
      )}
    </div>
  );
};

export default Profile;
