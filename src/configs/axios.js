import Axios from 'axios';

import * as AppConstant from '../constants';

const CancelToken = Axios.CancelToken;
export let cancel;

export const axios = Axios.create({
  baseURL: AppConstant.Api.baseUrl,
  timeout: 10000,
  responseType: 'json',
  cancelToken: new CancelToken(c => {
    cancel = c;
  }),
});
