import { useModel } from '@@/exports';
import { useLocalStorageState } from 'ahooks';

export default function CurrentLibrary() {
  const user = useModel('@@initialState', (initialState) => {
    return initialState.initialState?.user;
  });
  const [selectedLibrary, setSelectedLibrary] = useLocalStorageState<
    API.Library.Instance | undefined
  >('current-library', {
    defaultValue: () =>
      user?.managedLibraries?.filter((item) => !item.closed)[0],
  });

  return {
    selectedLibrary,
    setSelectedLibrary,
  };
}
