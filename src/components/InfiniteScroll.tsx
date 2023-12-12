import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
/**
 * A container component that handles infinite scrolling.
 */
interface InfiniteScrollProps {
  listItems: JSX.Element[];
  lastItemHandler: () => void;
}
function InfiniteScroll(props: InfiniteScrollProps) {
  const { listItems, lastItemHandler } = props;
  const [lastRowRef, lastItemInView] = useInView();
  // If last item is in view, call the last row handler
  useEffect(() => {
    if (lastItemInView) lastItemHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastItemInView]);
  const elements = listItems.map((listItem, i) => {
    // use id instead of an i..
    const options = { key: i, ref: null };
    if (i === listItems.length - 1) options.ref = lastRowRef;
    return <div key={options.key}>{listItem}</div>;
  });
  return elements;
}

export default InfiniteScroll;
