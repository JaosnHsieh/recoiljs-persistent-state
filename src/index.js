import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {
  RecoilRoot,
  useRecoilState,
  useRecoilTransactionObserver_UNSTABLE,
} from 'recoil';
import { UserInfo, currentUserIDState, currentUserId } from './state';
ReactDOM.render(
  <RecoilRoot initializeState={initializeState}>
    <CurrentUserInput />
    <UserInfo />
  </RecoilRoot>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

function CurrentUserInput() {
  PersistenceObserver();
  const [currentUserId, setCurrentUserId] = useRecoilState(currentUserIDState);

  return (
    <div>
      {currentUserId ? currentUserId : 'no current user id'}
      <input
        value={currentUserId}
        onChange={(e) => {
          setCurrentUserId(e.target.value);
        }}
      />
    </div>
  );
}

function initializeState({ set }) {
  const value = localStorage.getItem(currentUserIDState.key);
  if (value) {
    set(currentUserIDState, JSON.parse(value).value);
  }
}

function PersistenceObserver() {
  useRecoilTransactionObserver_UNSTABLE(({ snapshot }) => {
    const loadable = snapshot.getLoadable(currentUserIDState);
    if (loadable.state === 'hasValue') {
      localStorage.setItem(
        currentUserIDState.key,
        JSON.stringify({ value: loadable.contents }),
      );
    }
  });
}
