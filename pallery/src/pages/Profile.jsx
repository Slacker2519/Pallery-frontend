import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUser, getUserPaintings, getUserAlbums } from "../api/user";
import { MdLogout } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import PaintingFrame from "../components/PaintingFrame";
import FocusedPainting from "../components/FocusedPainting";
import Overlay from "../components/Overlay";
import AddPostButton from "../components/AddPostButton";
import AlbumDefaultCover from "../components/AlbumDefaultCover";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const profileId = id || user?.id;
  const isOwner = user && profileId === user.id;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [paintings, setPaintings] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id && !user) navigate("/");
  }, [id, user, navigate]);

  useEffect(() => {
    if (!profileId) return;

    const fetchData = async () => {
      try {
        const [userData,
          paintingsData,
          albumsData] = await Promise.all([
          getUser(profileId),
          getUserPaintings(profileId),
          getUserAlbums(profileId),
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
  }, [profileId]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading)
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center
        dark:bg-dark dark:text-light"
      >
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
        {isOwner &&
            <button
              onClick={handleLogout}
              className="text-lg px-2 py-2 rounded-lg border-2 border-red-500 text-red-500"
            >
              <MdLogout />
            </button>
        }
      </div>

      <div className="px-6 pb-10 flex flex-col gap-8">
        {/*user info card------------------------------------------------------------------------------------------------*/}
        <section className="flex items-start gap-7 p-5 dark:bg-offDark bg-offLight rounded-lg w-fit">
          <div
            className="w-20 h-20 rounded-full bg-violet-500 flex items-center justify-center
            text-2xl text-white font-medium"
          >
            {userInfo?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-medium">{userInfo?.name}</h1>
            {userInfo?.email && <p className="text-sm text-gray-400">{userInfo?.email}</p>}
            <p className="text-sm text-gray-400">
              Joined {formatDate(userInfo?.createdAt)}
            </p>
          </div>
          {isOwner &&
            <button
              onClick={() => navigate("/profile/update")}
              className="text-sm dark:text-light text-dark"
            >
              <FaPen />
            </button>
          }
        </section>

        <hr className="border-gray-300 dark:border-gray-600" />

        {/*user's album section------------------------------------------------------------------------------------------*/}
        <section>
          <h2 className="text-lg font-medium mb-4">Albums ({albums.length})</h2>

          <div className="gallery">
            {isOwner &&
              <div className="break-inside-avoid mb-2">
                <AddPostButton onClick={() => navigate("/profile/albums/create")} />
              </div>
            }

            {albums.map((album) => {
              const coverPainting = paintings.find((p) => p._id === album.coverPaintingId);
              const albumPaintings = (album.paintingIds || [])
                  .map((id) => paintings.find((p) => p._id === id))
                  .filter(Boolean);
              return (
                  <div key={album._id} className="break-inside-avoid mb-2">
                    <button
                        onClick={() => navigate(`/profile/albums/${album._id}`)}
                        className="block w-full cursor-pointer"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden bg-offLight dark:bg-offDark">
                        {coverPainting ? (
                            <img src={coverPainting.url} alt={album.name} className="w-full h-full object-cover" />
                        ) : (
                            <AlbumDefaultCover paintings={albumPaintings} />
                        )}
                      </div>
                    </button>
                  </div>
              );
            })}
          </div>
        </section>

        <hr className="border-gray-300 dark:border-gray-600" />

        {/*user's paintings section--------------------------------------------------------------------------------------*/}
        <section>
          <h2 className="text-lg font-medium mb-4">
            Paintings ({paintings.length})
          </h2>

          <div className="gallery">
            {isOwner &&
              <div className="break-inside-avoid mb-2">
                <AddPostButton
                  onClick={() => navigate("/profile/paintings/post")}
                />
              </div>
            }
            {paintings.map((painting) => (
              <PaintingFrame
                key={painting._id}
                painting={painting}
                onClick={() => setSelectedPainting(painting)}
              />
            ))}
          </div>
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
