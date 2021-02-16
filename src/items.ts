import { access } from "fs";

type Action = ItemAction | ItemLoaded;

type ItemAction = {
  type: "change-item";
  itemId: string;
  newItemProps: Partial<Item>;
};

type ItemLoaded = {
  type: "item-loaded";
  itemId: string;
  items: Item[];
};

export const reducer = (state: Items, action: Action): Items => {
  if (action.type == "change-item") {
    return {
      ...state,
      [action.itemId]: {
        ...state[action.itemId],
        ...action.newItemProps,
      },
    };
  }
  if (action.type == "item-loaded") {
    const newItems = action.items.reduce(
      (ac, item) => ({ ...ac, [item.id]: item }),
      {}
    );
    return {
      ...state,
      [action.itemId]: {
        ...state[action.itemId],
        isLoading: false,
        children: action.items.map((i) => i.id),
      },
      ...newItems,
    };
  }
  return state;
};
let globalDispatch: React.Dispatch<Action>;
export const setGlobalDispatch = (dispatch: React.Dispatch<Action>) =>
  (globalDispatch = dispatch);

export const actions = {
  startLoading: (item: Item) =>
    globalDispatch({
      type: "change-item",
      itemId: item.id,
      newItemProps: {
        isLoading: true,
        isOpen: true,
      },
    }),
  finishLoading: (item: Item, subitems: Item[]) =>
    globalDispatch({
      type: "item-loaded",
      itemId: item.id,
      items: subitems,
    }),

  toggleItemInSidebar: (item: Item) =>
    globalDispatch({
      type: "change-item",
      itemId: item.id,
      newItemProps: {
        isOpen: !item.isOpen,
      },
    }),
};
