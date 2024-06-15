import { useModel } from '@@/exports';
import { useLocalStorageState } from 'ahooks';
import { useEffect } from 'react';

export default function CurrentLibrary() {
  const user = useModel('@@initialState', (initialState) => {
    return initialState.initialState?.user;
  });
  console.log(user, 'user');
  const [selectedLibrary, setSelectedLibrary] = useLocalStorageState<
    API.Library.Instance | undefined
  >('current-library', {
    serializer: (value) => (value ? JSON.stringify(value) : ''),
    deserializer: (value) => (value ? JSON.parse(value) : undefined),
  });

  useEffect(() => {
    if (user?.managedLibraries) setSelectedLibrary(user?.managedLibraries?.[0]);
  }, [user?.managedLibraries]);

  return {
    selectedLibrary,
    setSelectedLibrary,
  };
}
