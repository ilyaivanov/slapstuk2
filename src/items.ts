export type Item = {
  id: string;
  title: string;
  children: [];
  isOpen?: boolean;
};
type Items = { [id: string]: Item };

export const initialItems: Items = {
  HOME: {
    id: "HOME",
    title: "Home",
    children: [],
  },
};

type ItemAction = {
  type: "rename";
  itemId: string;
  newName: string;
};

export const reducer = (state: Items, action: ItemAction): Items => {
  if (action.type == "rename") {
    return {
      ...state,
      [action.itemId]: {
        ...state[action.itemId],
        title: action.newName,
      },
    };
  }
  return state;
};
let globalDispatch: React.Dispatch<ItemAction>;
export const setGlobalDispatch = (dispatch: React.Dispatch<ItemAction>) =>
  (globalDispatch = dispatch);

export const actions = {
  rename: (itemId: string, newName: string) =>
    globalDispatch({
      type: "rename",
      itemId,
      newName,
    }),
};
