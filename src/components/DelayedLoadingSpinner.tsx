import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
    delay?: number;
    label?: string;
}

/**
 * A loading indicator that will show after a delay to avoid flickering for fast requests.
 */
const DelayedLoadingIndicator = ({ delay = 500, label = "" }: Props) => {
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoader(true);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [delay]);

    return (
        <AnimatePresence>
            {showLoader && (
                <motion.span
                    className="text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    * {label}
                </motion.span>
            )}
        </AnimatePresence>
    );
};

export default DelayedLoadingIndicator;
