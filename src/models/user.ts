import { getUserInfo } from '@/services/user';
import { useLocalStorageState } from 'ahooks';
import { useState } from 'react';

export default function User() {
  const [token, _setToken] = useLocalStorageState('token', {
    serializer: (value: string) => value,
    deserializer: (value: string) => value,
  });
  const [user, setUser] = useState<API.User.Current>();
  const setToken = async (t: string) => {
    _setToken(t);
    const res = await getUserInfo();
    setUser(res.data);
  };

  return {
    setToken,
    user,
  };
}
