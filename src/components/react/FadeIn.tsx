import { motion } from "framer-motion";
import type { FC, PropsWithChildren } from "react";

interface FadeInProps extends PropsWithChildren {
  delay?: number;
}

const FadeIn: FC<FadeInProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.3,
            delay,
            ease: [0.21, 0.47, 0.32, 0.98]
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
