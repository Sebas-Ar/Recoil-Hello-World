import {
  selectorFamily,
  useRecoilValue,
  useSetRecoilState,
  atom,
  selector,
} from 'recoil';

const myDBQuery = ({ userID }) => {
  const userList = [
    {
      id: 0,
      name: 'amigo 0',
      friendList: [1, 2],
    },
    {
      id: 1,
      name: 'amigo 1',
      friendList: [0],
    },
    {
      id: 2,
      name: 'amigo 2',
      friendList: [0],
    },
  ];
  return userList.filter((user) => user.id === userID)[0];
};

const currentUserIDState = atom({
  key: 'CurrentUserID',
  default: 0,
});

const userInfoQuery = selectorFamily({
  key: 'UserInfoQuery',
  get: (userID) => () => {
    const response = myDBQuery({ userID });
    console.log('response: ', response);
    if (response.error) {
      throw response.error;
    }
    return response;
  },
});

const currentUserInfoQuery = selector({
  key: 'CurrentUserInfoQuery',
  get: ({ get }) => get(userInfoQuery(get(currentUserIDState))),
});

const friendsInfoQuery = selector({
  key: 'FriendsInfoQuery',
  get: ({ get }) => {
    const { friendList } = get(currentUserInfoQuery);
    console.log('friendList: ', friendList);
    return friendList.map((friendID) => get(userInfoQuery(friendID)));
  },
});

function CurrentUserInfo() {
  const currentUser = useRecoilValue(currentUserInfoQuery);
  const friends = useRecoilValue(friendsInfoQuery);
  const setCurrentUserID = useSetRecoilState(currentUserIDState);
  return (
    <div>
      <h1>Test</h1>
      <h1>{currentUser.name}</h1>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id} onClick={() => setCurrentUserID(friend.id)}>
            {friend.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CurrentUserInfo;
