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
  >('current-library');

  useEffect(() => {
    if (user?.managedLibraries)
      setSelectedLibrary(
        user?.managedLibraries?.filter((item) => !item.closed)[0],
      );
  }, [user?.managedLibraries]);

  return {
    selectedLibrary,
    setSelectedLibrary,
  };
}
