"use client";

import { memo, useId } from "react";
import BookView from "./Book.view";
import type { BookProps } from "./Book.types";

/**
 * Figma: "Sections / Book" frame **22135:889706** (see Book.view.tsx).
 */
const BookContainer = memo<BookProps>((props) => {
  const headingId = useId();

  return <BookView {...props} headingId={headingId} />;
});

BookContainer.displayName = "Book";

export default BookContainer;
