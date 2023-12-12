import React from 'react';
import { useInView } from 'react-intersection-observer';

/**
 * A wrapper component for children of
 * VirtualScroll. Computes inline style and
 * handles whether to display props.children.
 */
interface UserNode {
  structureDefinition: {
    title: string;
  };
  id?: string;
}
interface VirtualScrollChildProps {
  height: string;
  children: UserNode;
}

function VirtualScrollChild(props: VirtualScrollChildProps) {
  const { height, children } = props;
  const [ref, inView] = useInView();
  const style = {
    height: `${height}vh`,
    overflow: 'hidden',
  };
  return (
    <div style={style} ref={ref}>
      {inView ? children.structureDefinition.title : null}
    </div>
  );
}

export default VirtualScrollChild;
