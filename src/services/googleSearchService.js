import * as AppConstant from '../constants';

import * as Config from '../configs';

const get = async (q, start) => {
  try {
    const response = await Config.axios.get(AppConstant.GoogleSearch.URL, {
      params: {
        key: AppConstant.GoogleSearch.KEY,
        cx: AppConstant.GoogleSearch.CX,
        q,
        start,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default {
  get,
};
