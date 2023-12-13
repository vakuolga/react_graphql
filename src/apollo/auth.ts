import { gql, DocumentNode } from '@apollo/client';

/**
 * Mutations
 */

const LOGIN: DocumentNode = gql`
  mutation Login($loginJwtInput2: LoginJwtInput!) {
    Auth {
      loginJwt(input: $loginJwtInput2) {
        jwtTokens {
          accessToken
          refreshToken
        }
      }
    }
  }
`;

export default LOGIN;
