interface EdgeNode {
  structureDefinition: {
    title: string;
  };
}

export interface Edge {
  id: string;
  cursor: string;
  node: EdgeNode;
}

interface PageInfo {
  endCursor: string;
  hasNextPage: string;
}

export interface UserData {
  Admin: {
    Tree: {
      GetContentNodes: {
        edges: Edge[];
        pageInfo: PageInfo;
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
