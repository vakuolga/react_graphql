import { renderHook, act } from '@testing-library/react'
import useSortableList, { STORAGE_KEY } from './useSortableList';

const edges = [
  { node: { id: '1', structureDefinition: { title: 'Title_1' } }, cursor: 'cursor_1' },
  { node: { id: '2', structureDefinition: { title: 'Title_2' } }, cursor: 'cursor_2' },
  { node: { id: '3', structureDefinition: { title: 'Title_3' } }, cursor: 'cursor_3' },
  { node: { id: '4', structureDefinition: { title: 'Title_4' } }, cursor: 'cursor_4' },
];

test('useSortableList should handle item movements and localStorage correctly', () => {
  // Arrange
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });

  const { result } = renderHook(() => useSortableList(edges));

  act(() => {
    result.current.moveItem(0, 2);
  });

  // Assert
  expect(result.current.list).toEqual([
    edges[1],
    edges[2],
    edges[0],
    edges[3],
  ]);

  // Check localStorage
  expect(localStorageMock.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(result.current.list));
});

// Clean up localStorage after the test
afterAll(() => {
  vi.restoreAllMocks();
});
