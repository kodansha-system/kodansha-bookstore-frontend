import React, { useEffect, useRef, useState } from "react";

interface HtmlDescriptionProps {
  html: string;
  maxHeight?: number;
}

const Description: React.FC<HtmlDescriptionProps> = ({
  html,
  maxHeight = 200,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;

    if (el) {
      setOverflowing(el.scrollHeight > maxHeight);
    }
  }, [html, maxHeight]);

  return (
    <div className="relative text-sm">
      <div
        className="overflow-hidden transition-all"
        dangerouslySetInnerHTML={{ __html: html }}
        ref={contentRef}
        style={{
          maxHeight: expanded ? "none" : `${maxHeight}px`,
        }}
      />

      {!expanded && overflowing && (
        <div className="pointer-events-none absolute inset-x-0 bottom-2 h-16 bg-gradient-to-t from-white to-transparent" />
      )}

      {overflowing && (
        <button
          className="relative z-10 mt-2 text-blue-600 hover:underline"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Thu gọn" : "Xem thêm"}
        </button>
      )}
    </div>
  );
};

export default Description;
