import React from 'react';
import VirtualScrollChild from './VirtualScrollChild';
import InfiniteScroll from './InfiniteScroll';

/**
 * A wrapper component for implementing virtual and
 * infinite scrolling.
 */
interface UserNode {
  structureDefinition: {
    title: string;
  };
  id?: string;
}
interface VirtualAndInfiniteScrollProps {
  listItems: UserNode[];
  height: string;
  lastItemHandler: () => void;
}
function VirtualAndInfiniteScroll(props: VirtualAndInfiniteScrollProps) {
  const { listItems, height, lastItemHandler } = props;
  const VirtualScrollChildren = listItems.map((listItem) => (
    <VirtualScrollChild height={height} key={listItem.id}>
      {listItem}
    </VirtualScrollChild>
  ));

  return (
    <InfiniteScroll
      listItems={VirtualScrollChildren}
      lastItemHandler={lastItemHandler}
    />
  );
}

export default VirtualAndInfiniteScroll;
