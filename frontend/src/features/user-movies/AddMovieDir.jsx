import Modal from "../../ui/Modal";
import CreateMovieForm from "./CreateMovieForm";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";

function AddMovieDir({ type }) {
  return (
    <Modal>
      <Modal.Open opens="dir-form">
        <motion.div
          whileHover={{ scale: [null, 1.1, 1.05] }}
          transition={{ duration: 0.3 }}
        >
          <div className="movie-dir-item">
            <FaPlus className="add" />
          </div>
        </motion.div>
      </Modal.Open>
      <Modal.Window name="dir-form">
        <CreateMovieForm type={type} />
      </Modal.Window>
    </Modal>
  );
}

export default AddMovieDir;
