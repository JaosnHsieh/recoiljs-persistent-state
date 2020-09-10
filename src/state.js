import React from 'react';
import axios from 'axios';
import { atom, selectorFamily, selector, useRecoilValueLoadable } from 'recoil';

export const currentUserIDState = atom({
  key: 'CurrentUserIDStateKey',
  default: null,
});

const userInfoQuery = selectorFamily({
  key: 'userInfoQueryKey',
  get: (userId) => async () => {
    const response = await axios.get(`http://localhost:3000/users/${userId}`);

    return response.data;
  },
});

const currentUserInfoQuery = selector({
  key: 'currentUserInfoQueryKey',
  get: ({ get }) => {
    return get(userInfoQuery(get(currentUserIDState)));
  },
});

const friendsInfoQuery = selector({
  key: 'friendsInfoQueryKey',
  get: ({ get }) => {
    const { friendList } = get(currentUserInfoQuery);
    return friendList.map((friendId) => get(userInfoQuery(friendId)));
  },
});

export const UserInfo = () => {
  const currentUserInfoLoadable = useRecoilValueLoadable(currentUserInfoQuery);
  const friendsInfoLoadable = useRecoilValueLoadable(friendsInfoQuery);
  if (currentUserInfoLoadable.state === 'hasError') {
    return `currentUserInfoLoadable hasError`;
  }
  if (currentUserInfoLoadable.state === 'loading') {
    return `currentUserInfoLoadable loading`;
  }

  if (friendsInfoLoadable.state === 'hasError') {
    return `friendsInfoLoadable hasError`;
  }

  if (friendsInfoLoadable.state === 'loading') {
    return `friendsInfoLoadable loading`;
  }

  return (
    <div>
      <div>
        current userInfo
        <br />
        {JSON.stringify(currentUserInfoLoadable.contents)}
      </div>
      <div>
        friendsInfo <br />
        {JSON.stringify(friendsInfoLoadable.contents)}
      </div>
    </div>
  );
};
