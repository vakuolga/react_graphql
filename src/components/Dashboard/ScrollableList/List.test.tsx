import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { EdgesList } from './List';

const mockEdges = [
  { node: { id: '1', structureDefinition: { title: 'Edge 1' } }, cursor: '1' },
  { node: { id: '2', structureDefinition: { title: 'Edge 2' } }, cursor: '2' },
  { node: { id: '3', structureDefinition: { title: 'Edge 3' } }, cursor: '3' },
];

test('renders LoadingIndicator when edges are not provided', () => {
  render(<EdgesList edges={null} moveItem={() => {}} />);
  expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
});

test('renders "The List is empty" message when edges array is empty', () => {
  render(<EdgesList edges={[]} moveItem={() => {}} />);
  expect(screen.getByText('The List is empty')).toBeInTheDocument();
});

test('renders list of DraggableEdge components with correct props', () => {
  const moveItemMock = jest.fn();

  render(
    <DndProvider backend={HTML5Backend}>
      <EdgesList edges={mockEdges} moveItem={moveItemMock} />
    </DndProvider>
  );

  const draggableEdges = screen.getAllByTestId('draggable-edge');

  expect(draggableEdges).toHaveLength(mockEdges.length);

  draggableEdges.forEach((draggableEdge, index) => {
    expect(draggableEdge).toHaveAttribute('data-testid', 'draggable-edge');
    expect(draggableEdge).toHaveAttribute('data-index', index.toString());

    // Проверяем, что компонент DraggableEdge получил правильные props
    expect(draggableEdge).toHaveAttribute('data-edge-id', mockEdges[index].id);
    expect(draggableEdge).toHaveAttribute(
      'data-edge-name',
      mockEdges[index].name
    );
  });
});

// Можете добавить еще тесты в зависимости от требований вашего компонента
