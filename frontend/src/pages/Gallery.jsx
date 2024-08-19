import { useContext, useEffect, useState } from "react";

import PhotoItem from "../ui/PhotoItem";
import Modal from "../ui/Modal";
import { useSearchParams, useLocation } from "react-router-dom";

import Transition from "../ui/Transition";
import ConfigContext from "../contexts/ConfigContext";

function Gallery() {
  const { picturePath, videoPath } = useContext(ConfigContext);

  const dirPath = picturePath;
  const [photoItems, setPhotoItem] = useState([]);
  const [SearchParams] = useSearchParams();
  const id = SearchParams.get("id");

  const dirName = SearchParams.get("dirName");
  const location = useLocation();
  const { nameNoNet, nameByUser } = location.state;
  const name = nameNoNet ? nameNoNet : nameByUser;

  useEffect(
    function () {
      async function getImages() {
        try {
          const response = await fetch(`http://localhost:3000/uploadFolder`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              folderPath: dirPath,
              name: name,
              id: id,
              dirName: dirName,
              hardlinkPath: videoPath,
            }),
          });
          const data = await response.json();

          setPhotoItem(data);
        } catch (err) {
          console.error(err);
        }
      }
      getImages();
    },
    [name, dirName, id, dirPath, videoPath]
  );

  return (
    <Transition>
      <Modal>
        <div className="gallery-page">
          <Modal.Open opens="img">
            <div className="gallery">
              {!photoItems.error &&
                photoItems.map((item) => (
                  <PhotoItem item={item} key={item.id} />
                ))}
            </div>
          </Modal.Open>
        </div>
        <Modal.Window name="img" type="img">
          <img alt="" className="scale" />
        </Modal.Window>
      </Modal>
    </Transition>
  );
}

export default Gallery;
