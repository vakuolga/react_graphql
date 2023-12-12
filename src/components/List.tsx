import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Edge } from '../apollo/interfaces';
import LoadingIndicator from './LoadingIndicator';

interface EdgesListProps {
  edges: Edge[];
}

const ItemType = 'EDGE';

function DraggableEdge({ edge, index, moveEdge }: any) {
  const [, drag] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem: any) => {
      if (draggedItem.index !== index) {
        moveEdge(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <ListItem
      ref={(node) => drag(drop(node))}
      key={edge.id}
      disablePadding
      sx={{ height: '30vh' }}
    >
      <ListItemButton>
        <ListItemText primary={edge.node.structureDefinition.title} />
      </ListItemButton>
    </ListItem>
  );
}

function EdgesList(props: EdgesListProps) {
  const { edges } = props;
  const [sortedEdges, setSortedEdges] = useState([]);

  useEffect(() => {
    if (edges) {
      setSortedEdges(edges);
    }
  }, [edges]);

  const moveEdge = (from: number, to: number) => {
    const updatedEdges = [...sortedEdges];
    const [movedEdge] = updatedEdges.splice(from, 1);
    updatedEdges.splice(to, 0, movedEdge);
    setSortedEdges(updatedEdges);
  };

  if (!edges) return <LoadingIndicator />;
  if (edges.length === 0)
    return (
      <Typography variant="h5" display="block" gutterBottom>
        The List is empty
      </Typography>
    );

  return (
    <DndProvider backend={HTML5Backend}>
      <List>
        {sortedEdges.map((edge: Edge, index: number) => (
          <DraggableEdge
            key={edge.id}
            edge={edge}
            index={index}
            moveEdge={moveEdge}
          />
        ))}
      </List>
    </DndProvider>
  );
}

const EdgesListMemo = React.memo(EdgesList);
export default EdgesListMemo;
