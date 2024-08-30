import Cookies from 'js-cookie';

export const getCookie = (name) => {
  return Cookies.get(name);
};
