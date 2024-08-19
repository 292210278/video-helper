function PhotoItem({ item }) {
  return (
    <div className="photo-box">
      <img id={item.id} className="photo" src={item.imagePath} />
    </div>
  );
}

export default PhotoItem;
