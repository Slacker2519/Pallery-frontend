const ImageFrame = (props) => {
    const { illustration, onClick } = props;

    return (
        <div>
            <button
                onClick={ onClick }
                className="mb-1">
                <img
                    id={illustration.id}
                    src={illustration.imageUrl}
                    alt={illustration.description}
                    className="illustration"
                />
            </button>
        </div>
    );
}

export default ImageFrame;