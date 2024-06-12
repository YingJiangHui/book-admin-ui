namespace System {
  type InitialState = {
    name: string;
    user?: API.User.Current & { currentLib: API.Library.Instance };
    token?: string | null;
  };
}
