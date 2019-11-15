/**
 * Libraries
 */
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { setContext } from 'apollo-link-context'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import _debounce from 'lodash/debounce'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { ApolloLink, from } from 'apollo-link'
import { logout } from './utils/auth'
/**
 * Lib
 */
import { getAccessToken, getProfileId } from './Auth'

const logOut = _debounce(logout, 1000, { leading: true, trailing: false })
/**
 * Exports
 */
export const GraphQLProvider = ApolloProvider

const getGrapQlClient = ({ graph }, handlers) => {
  const loggerMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    return forward(operation)
  })

  const postSuccessMiddleware = new ApolloLink((operation, forward) => {
    return forward(operation)
  })

  const authLink = setContext(async (_, { headers }) => {
    const accessToken = await getAccessToken()
    const profileId = await getProfileId()
    let fullHeaders = Object.assign({}, headers, graph.headers)
    if (accessToken) {
      fullHeaders = Object.assign({}, headers, graph.headers, { authorization: `Bearer ${accessToken || ''}` })
    }

    if (profileId) {
      fullHeaders = Object.assign({}, fullHeaders, { 'x-profile-id': profileId })
    }

    return {
      headers: fullHeaders
    }
  })

  // TODO: ACT based on errors. Example: unauthorized: go to /login, network: tell the user
  const errorLink = onError(({ graphQLErrors, networkError, response, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors
        .map(({ message, locations, path, ...rest }) =>
        // eslint-disable-next-line no-console
          console.log(`[GraphQL error]: Message: ${message}, 
              Location: ${JSON.stringify(locations)}, 
              Path: ${path}, Raw: ${JSON.stringify(rest)}`)
        )
    }

    if (networkError) {
      if (networkError.statusCode && networkError.statusCode === 401) {
        apolloClient.resetStore().then((response) => {
          if (typeof handlers.onNetworkError === 'function') {
            handlers.onNetworkError()
          }
        }).catch((e) => console.error(e, 'Error 401'))
      }
    }
  })

  const httpLink = new HttpLink({
    uri: graph.url
  })

  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
      __schema: {
        types: []
      }
    }
  })

  const apolloClient = new ApolloClient({
    link: from([
      loggerMiddleware,
      authLink.concat(errorLink.concat(httpLink), postSuccessMiddleware.concat(httpLink))
    ]),
    cache: new InMemoryCache({ fragmentMatcher })
  })

  apolloClient.onResetStore(async () => {
    await logOut()
    return false
  })

  return apolloClient
}

export const getClient = getGrapQlClient
