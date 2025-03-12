import { history } from '@umijs/max';
export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

export const toLogin = () => {
  if (window.location.pathname.indexOf('/login') === -1) {
    history.push({
      pathname: `/login?redirectTo=${window.location.pathname}${window.location.search}`,
    });
  }
};
