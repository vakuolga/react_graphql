import { PageData, Edge } from '../apollo/interfaces';
import { FetchMoreFunction } from '@apollo/client/react/hooks/useSuspenseQuery';
import { UserNodesQueryVariables } from '../apollo/interfaces';

export interface UseInfiniteScrollProps {
  setList: React.Dispatch<React.SetStateAction<Edge[] | []>>;
  isLoggedOut: boolean;
  fetchMore: FetchMoreFunction<PageData, UserNodesQueryVariables>;
  FIRST: number;
  data: PageData | undefined;
}
