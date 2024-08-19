import { motion } from "framer-motion";

function SelectedDir({ handleClick, item }) {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="selected-dir"
        onClick={(e) => {
          handleClick(e.target.innerText);
        }}
      >
        {item}
      </div>
    </motion.div>
  );
}

export default SelectedDir;
