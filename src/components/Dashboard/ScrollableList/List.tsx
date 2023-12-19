import React from 'react';
import { List, Typography } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Edge } from '../../../apollo/interfaces';
import LoadingIndicator from '../../LoadingIndicator';
import DraggableEdge from './DraggableEdge';
import { EdgesListProps } from '../../interfaces';

export function EdgesList(props: EdgesListProps) {
  const { edges } = props;

  if (!edges) return <LoadingIndicator />;
  if (edges.length === 0)
    return (
      <Typography variant="h5" display="block" gutterBottom>
        The List is empty
      </Typography>
    );
  const { moveItem } = props;
  return (
    <DndProvider backend={HTML5Backend}>
      <List>
        {edges.map((edge: Edge, index: number) => (
          <DraggableEdge
            // disabled because has repeating ids in the array
            // eslint-disable-next-line react/no-array-index-key
            key={edge.node.id + index}
            edge={edge}
            index={index}
            moveEdge={moveItem}
          />
        ))}
      </List>
    </DndProvider>
  );
}

const EdgesListMemo = React.memo(EdgesList, (prevProps, nextProps) => {
  return prevProps.edges === nextProps.edges;
});

export default EdgesListMemo;
