import { gql } from '@apollo/client';

/**
 * Mutations
 */

const LOGIN = gql`
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
