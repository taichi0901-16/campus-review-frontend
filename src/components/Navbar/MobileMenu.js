import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* ハンバーガーボタン */}
      <button
        className="z-50 fixed top-5 right-5 flex flex-col justify-between h-[24px] w-[35px]"
        onClick={toggleMenu}
      >
        <span
          className={`block h-[2px] bg-black transition-transform duration-500 ${
            isOpen ? "translate-y-[11px] rotate-45" : ""
          }`}
        ></span>
        <span
          className={`block h-[2px] bg-black transition-all duration-500 ${
            isOpen ? "scale-x-0 translate-x-[-18px]" : ""
          }`}
        ></span>
        <span
          className={`block h-[2px] bg-black transition-transform duration-500 ${
            isOpen ? "-translate-y-[11px] -rotate-45" : ""
          }`}
        ></span>
      </button>

      {/* オーバーレイ */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 z-40"
              onClick={toggleMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* メニュー本体 */}
            <motion.ul
              className="fixed top-0 right-0 w-[300px] h-full bg-white pt-20 z-50 space-y-6"
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {["授業検索", "口コミ投稿", "大学一覧", "ログイン"].map((item, i) => (
                <motion.li
                  key={i}
                  className="pl-10 text-lg text-black"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <a href="#" onClick={toggleMenu}>{item}</a>
                </motion.li>
              ))}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileMenu;
