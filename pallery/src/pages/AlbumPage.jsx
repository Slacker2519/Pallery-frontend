import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAlbum } from "../api/album";
import { FaPen, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import PaintingFrame from "../components/PaintingFrame";
import FocusedPainting from "../components/FocusedPainting";
import Overlay from "../components/Overlay";
import AlbumDefaultCover from "../components/AlbumDefaultCover";

const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

const AlbumPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();


    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [album, setAlbum] = useState(null);
    const [paintings, setPaintings] = useState([]);
    const [selectedPainting, setSelectedPainting] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [ascending, setAscending] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAlbum(id);
                const order = data.album.paintingIds || [];
                const sorted = [...(data.paintings || [])].sort(
                    (a, b) => order.indexOf(a._id) - order.indexOf(b._id),
                );
                setAlbum(data.album);
                setPaintings(sorted);
            } catch (e) {
                console.error(e);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const isOwner = user && album && album.ownerId === user.id;
    const coverPainting = paintings.find((p) => p._id === album?.coverPaintingId);

    const visiblePaintings = useMemo(() => {
        const q = searchInput.trim().toLowerCase();

        const filtered = paintings.filter((p) => {
            if (!q) return true;
            return (
                p.name?.toLowerCase().includes(q) ||
                p.author?.toLowerCase().includes(q) ||
                (p.tags ? p.tags.join(" ") : "").toLowerCase().includes(q)
            );
        });

        return [...filtered].sort((a, b) => {
            const result =
                sortBy === "name"
                    ? (a.name || "").localeCompare(b.name || "")
                    : new Date(a.createdAt) - new Date(b.createdAt);
            return ascending ? result : -result;
        });
    }, [paintings, searchInput, sortBy, ascending]);

    if (loading)
        return (
            <div className="w-full min-h-screen flex items-center justify-center dark:bg-dark dark:text-light">
                Loading...
            </div>
        );

    if (notFound || !album)
        return (
            <div className="w-full min-h-screen flex flex-col gap-3 items-center justify-center dark:bg-dark
                dark:text-light"
            >
                <p>Album not found</p>
                <button onClick={() => navigate("/profile")}>Back to profile</button>
            </div>
        );

    return (
        <div className="w-full min-h-screen dark:bg-dark dark:text-light bg-light text-black">
            {/*Top bar------------------------------------------------------------------------------------------------*/}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex justify-between items-center px-4 py-3">
                <button onClick={() => setSidebarOpen(true)}>
                    <i className="fa-solid fa-bars text-xl" />
                </button>
            </div>

            <div className="px-6 pb-10 flex flex-col gap-8">
                {/*Details card---------------------------------------------------------------------------------------*/}
                <section className="relative flex gap-5 p-5 pr-14 dark:bg-offDark bg-offLight rounded-lg
                    w-full max-w-xl"
                >
                    <div className="w-28 sm:w-40 aspect-square rounded-lg overflow-hidden bg-gray-200
                        dark:bg-gray-700 shrink-0"
                    >
                        {coverPainting ? (
                            <img
                                src={coverPainting.url}
                                alt={album.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <AlbumDefaultCover paintings={paintings} />
                        )}
                    </div>

                    <div className="flex flex-col gap-1 min-w-0">
                        <h1 className="text-2xl font-medium break-words">{album.name}</h1>
                        {album.description && (
                            <p className="text-sm text-gray-400 break-words">
                                {album.description}
                            </p>
                        )}
                        <p className="text-sm text-gray-400 mt-1">
                            {paintings.length} painting{paintings.length !== 1 ? "s" : ""}
                            {" · "}
                            {album.visibility === "private" ? "Private" : "Public"}
                        </p>
                        {album.createdAt && (
                            <p className="text-sm text-gray-400">Created {formatDate(album.createdAt)}</p>
                        )}
                    </div>

                    {isOwner && (
                        <button
                            onClick={() => navigate(`/profile/albums/${album._id}/edit`)}
                            className="absolute top-3 right-3 text-sm"
                            aria-label="Edit album"
                        >
                            <FaPen />
                        </button>
                    )}
                </section>

                <hr className="border-gray-300 dark:border-gray-600" />

                {/*Paintings section----------------------------------------------------------------------------------*/}
                <section className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-lg font-medium">
                            Paintings ({visiblePaintings.length})
                        </h2>

                        <div className="flex flex-wrap items-center gap-2">
                            <SearchBar
                                width="w-full md:w-72"
                                height="h-10"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="h-10 bg-transparent border border-gray-400 dark:border-gray-600
                                rounded-lg px-2 text-sm cursor-pointer"
                            >
                                <option className="dark:bg-dark" value="date">Date</option>
                                <option className="dark:bg-dark" value="name">Name</option>
                            </select>

                            <button
                                onClick={() => setAscending(!ascending)}
                                aria-label="Reverse sort order"
                                className="h-10 w-10 flex items-center justify-center"
                            >
                                {ascending ? <FaSortAmountUp /> : <FaSortAmountDown />}
                            </button>
                        </div>
                    </div>

                    <div className="gallery">
                        {visiblePaintings.map((painting) => (
                            <PaintingFrame
                                key={painting._id}
                                painting={painting}
                                onClick={() => setSelectedPainting(painting)}
                            />
                        ))}
                    </div>

                    {visiblePaintings.length === 0 && (
                        <p className="text-sm text-gray-400">
                            {paintings.length === 0
                                ? "No paintings in this album yet"
                                : "No paintings found"}
                        </p>
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
                        onDelete={(paintingId) => {
                            setPaintings(paintings.filter((p) => p._id !== paintingId));
                            setSelectedPainting(null);
                        }}
                    />
                </Overlay>
            )}
        </div>
    );
};

export default AlbumPage;