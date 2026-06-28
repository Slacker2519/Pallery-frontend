const Overlay = (props) => {
    const { onClick, children, zIndex } = props;

    return (
        <div
            className={`overlay ${zIndex} animate-fadeIn`}
            onClick={onClick}
        >
            <div onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

export default Overlay;