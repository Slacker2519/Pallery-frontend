import { useParams } from "react-router-dom";
import CreateAlbum from "./CreateAlbum.jsx";

const EditAlbum = () => {
    const { id } = useParams();
    return <CreateAlbum key={id} albumId={id} />;
};

export default EditAlbum;