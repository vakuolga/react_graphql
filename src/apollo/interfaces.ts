interface EdgeNode {
  id: string;
  structureDefinition: {
    title: string;
  };
}

export interface Edge {
  cursor: string;
  node: EdgeNode;
}
export interface PageData {
  Admin: {
    Tree: {
      GetContentNodes: {
        edges: Edge[];
        pageInfo: {
          endCursor: string;
          hasNextPage: boolean;
        };
      };
    };
  };
}

export interface AuthData {
  Auth: {
    loginJwt: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface UserNodesQueryVariables {
  after: null | string;
  first: number;
}
