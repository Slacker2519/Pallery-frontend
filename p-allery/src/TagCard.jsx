const TagCard = (props) => {
    const { children } = props;

    return (
        <div className="border-1 rounded-lg text-center">
            {children}
        </div>
    );
}

export default TagCard;