// DraggableEdge.tsx
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ListItem, ListItemText } from '@mui/material';
import { Edge } from '../../../apollo/interfaces';

interface DraggableEdgeProps {
  edge: Edge;
  index: number;
  moveEdge: (from: number, to: number) => void;
}

function DraggableEdge(props: DraggableEdgeProps) {
  const { index, edge, moveEdge } = props;
  const dragRef = React.useRef(null);
  const dropRef = React.useRef(null);

  const [, drag] = useDrag({
    type: 'EDGE',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'EDGE',
    hover: (item: { index: number }, monitor) => {
      if (!dragRef.current || !dropRef.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = dropRef.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (
        (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) ||
        (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
      ) {
        return;
      }

      moveEdge(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  drag(drop(dragRef));

  return (
    <ListItem ref={dropRef} disablePadding sx={{ height: '30vh' }}>
      <ListItemText
        ref={dragRef}
        primary={edge.node.structureDefinition.title}
      />
    </ListItem>
  );
}

export default DraggableEdge;