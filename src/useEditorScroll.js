import { RefObject, useCallback, useRef } from "react";

const useEditorScroll = () => {
  const lineRef = useRef(null);
  const textRef = useRef(null);
  const preRef = useRef(null);
  const handleScrollChange = useCallback(() => {
    if (
      lineRef.current !== null &&
      textRef.current !== null &&
      preRef.current !== null
    ) {
      preRef.current.style.height = textRef.current.style.height;
      preRef.current.scrollTop = lineRef.current.scrollTop =
        textRef.current.scrollTop;
      textRef.current.scrollTop = lineRef.current.scrollTop =
        preRef.current.scrollTop;
      preRef.current.scrollLeft = textRef.current.scrollLeft;
      textRef.current.scrollLeft = preRef.current.scrollLeft;
    }
  }, [textRef, preRef, lineRef]);
  return { textRef, preRef, lineRef, handleScrollChange };
};

export default useEditorScroll;