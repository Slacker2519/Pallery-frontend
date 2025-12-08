const FocusedImage = (props) => {
    const { illustration } = props;

    return (
        <div className="flex justfify-center items-center bg-light p-2 md:p-4
                rounded-lg shadow-lg shadow-light/50 animate-zoomIn">
            <img
                src={illustration.imageUrl}
                alt={illustration.description}
                className="max-w-[80vw] max-h-[80vh] object-contain"
            />
        </div>
    );
}

export default FocusedImage;