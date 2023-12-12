import { gql } from '@apollo/client';

/**
 * Queries
 */

export const GET_USER = gql`
  query Viewer {
    Viewer {
      Auth {
        currentUser {
          user {
            name
            id
            activated
            email
            isDeleted
          }
        }
      }
    }
  }
`;

export const GET_USER_NODES = gql`
  query Admin($after: String, $first: Int) {
    Admin {
      Tree {
        GetContentNodes(after: $after, first: $first) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              structureDefinition {
                title
              }
            }
            cursor
          }
        }
      }
    }
  }
`;
