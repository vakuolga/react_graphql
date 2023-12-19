import { Observable } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import getRefreshToken from '../utils';

const createErrorLink = () => {
  return onError(({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach((err) => {
        if (err.extensions?.code === 'UNAUTHENTICATED') {
          return new Observable((observer) => {
            getRefreshToken()
              .then((newTokens) => {
                if (newTokens) {
                  const oldHeaders = operation.getContext().headers;
                  operation.setContext({
                    headers: {
                      ...oldHeaders,
                      authorization: newTokens.accessToken,
                    },
                  });
                  const subscriber = {
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                  };
                  forward(operation).subscribe(subscriber);
                } else {
                  observer.error(
                    new Error('Error: Missing refreshToken or accountId')
                  );
                }
              })
              .catch((refreshError) => {
                observer.error(refreshError);
              });
          });
        }
        return undefined;
      });
    }
    return new Observable((observer) => {
      const subscriber = {
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      };
      forward(operation).subscribe(subscriber);
    });
  });
};

const ErrorLink = createErrorLink();

export default ErrorLink;
