namespace System {
  type InitialState = {
    name: string;
    user?: API.User.Current;
    token?: string | null;
  };
}
