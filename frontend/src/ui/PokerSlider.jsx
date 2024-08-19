import { useEffect, useContext, useState, useRef } from "react";
import SearchContext from "../contexts/SearchContext";
import { getPoster } from "../services/apiPhoto";
class PokerLogic {
  constructor() {
    this.poker_else = [];
    this.transform_datas = [
      "rotate(-10deg)",
      "rotate(-6deg) translate(35%, -12%)",
      "rotate(-2deg) translate(65%, -19%)",
      "rotate(2deg) translate(95%, -26%)",
      "rotate(6deg) translate(125%, -23%)",
    ];
  }

  init() {
    this.poker_else = Array.from(document.getElementsByClassName("poker"));
    this.poker_else.forEach((ele, index) => {
      ele.nums = index;
    });
  }

  move() {
    this.poker_else.forEach((ele) => {
      let nums = ele.nums;
      if (nums + 1 >= this.poker_else.length) {
        nums = 0;
        ele.style.transition = "top 0.3s ease";
      } else {
        nums += 1;
        ele.style.transition = "transform 0.3s ease, top 0.3s ease";
      }

      ele.style.zIndex = nums;
      ele.style.transform = this.transform_datas[nums];
      ele.nums = nums;
    });
  }
}

function getSliderPoster(dirsItem) {
  const names = [];
  dirsItem.dirName.forEach((dirItem) => {
    dirItem.children.forEach((dir) => {
      names.push((dir?.name || "").split("-")[0]);
    });
  });
  return names;
}

const PokerSlider = () => {
  const { dirs } = useContext(SearchContext);
  const [names, setNames] = useState(
    getSliderPoster(dirs) ? getSliderPoster(dirs) : []
  );
  const [poster, setPoster] = useState([]);
  const nameRef = useRef(names);
  useEffect(() => {
    const poker = new PokerLogic();
    poker.init();

    const pokerTop = document.querySelector(".poker_top");
    const handleMove = () => poker.move();
    pokerTop.addEventListener("click", handleMove);

    return () => {
      pokerTop.removeEventListener("click", handleMove);
    };
  }, []);
  useEffect(() => {
    async function fetchPoster() {
      try {
        const posterPromises = nameRef.current.map((name) => {
          return getPoster(name);
        });

        const results = await Promise.all(posterPromises);

        setPoster((prevPoster) => [
          ...prevPoster,
          ...results.map((result) => result.data),
        ]);
      } catch (error) {
        console.error("Error fetching poster:", error);
        setPoster("");
      }
    }

    fetchPoster();
  }, [nameRef]);
  return (
    <div className="container">
      {/* <div className="poker poker1">
        <img
          src={poster.length > 0 ? poster[0][0]?.imagePath : ""}
          alt="Poker 5"
        />
      </div>
      <div className="poker poker2">
        <img
          src={poster.length > 0 ? poster[1]?.imagePath : ""}
          alt="Poker 4"
        />
      </div>
      <div className="poker poker3">
        <img
          src={poster.length > 0 ? poster[2][0]?.imagePath : ""}
          alt="Poker 3"
        />
      </div>
      <div className="poker poker4">
        <img
          src={poster.length > 0 ? poster[3][0]?.imagePath : ""}
          alt="Poker 2"
        />
      </div>
      <div className="poker poker5">
        <img
          src={poster.length > 0 ? poster[4][0]?.imagePath : ""}
          alt="Poker 1"
        />
      </div> */}
      {poster.length > 0 &&
        poster.map((poker, index) => {
          console.log(index);
          if (index > 4 && poster.length > index) return null;

          return (
            <div key={index} className={`poker poker${index + 1}`}>
              <img src={poker[0]?.imagePath} alt={`Poker ${index + 1}`} />
            </div>
          );
        })}
      <div className="poker_top poker5"></div>
    </div>
  );
};

export default PokerSlider;
