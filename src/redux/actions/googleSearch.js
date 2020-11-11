import * as AppConstant from '../../constants';

import * as Services from '../../services';

export const toggleHasMore = value => {
  return {
    type: AppConstant.ActionTypes.HAS_MORE,
    payload: {
      data: value,
    },
  };
};

export const saveSearchResults = data => {
  return (dispatch, getState) => {
    dispatch({
      type: AppConstant.ActionTypes.SAVE_GOOGLE_SEARCH_RESULTS,
      payload: {
        results:
          data.queries.request[0].startIndex === 1
            ? data.items || []
            : getState().googleSearch.searchResults.concat(data.items),
        startIndex: data.queries.nextPage
          ? data.queries.nextPage[0].startIndex
          : 1,
      },
    });
  };
};

export const getSearchResults = (q, startIndex) => {
  return async dispatch => {
    try {
      let searchResults = await Services.GoogleSearchService.get(q, startIndex);
      if (searchResults.queries) {
        dispatch(
          toggleHasMore(
            searchResults.queries.request[0].count === 10 &&
              searchResults.queries.request[0].totalResults !== '0',
          ),
        );
        dispatch(saveSearchResults(searchResults));
      }
    } catch (error) {
      console.log(error);
    }
  };
};
