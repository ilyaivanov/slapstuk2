import { utils } from "./infra";

type Action = ItemAction | ItemLoaded | FocusItem;

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
type FocusItem = {
  type: "focus-item";
  itemId: string;
};
export type RootState = {
  items: Items;
  uiOptions: UIOptions;
};
type UIOptions = {
  focusedNode: string;
};

const itemsReducer = (items: Items, action: Action): Items => {
  if (action.type == "change-item") {
    return {
      ...items,
      [action.itemId]: {
        ...items[action.itemId],
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
      ...items,
      [action.itemId]: {
        ...items[action.itemId],
        isLoading: false,
        children: action.items.map((i) => i.id),
      },
      ...newItems,
    };
  }
  return items;
};

export const reducer = (state: RootState, action: Action): RootState => {
  if (action.type == "change-item" || action.type == "item-loaded") {
    return {
      ...state,
      items: itemsReducer(state.items, action),
    };
  }
  if (action.type == "focus-item") {
    return {
      ...state,
      uiOptions: {
        ...state.uiOptions,
        focusedNode: action.itemId,
      },
    };
  }
  return state;
};
let globalDispatch: React.Dispatch<Action>;
export const setGlobalDispatch = (dispatch: React.Dispatch<Action>) =>
  (globalDispatch = dispatch);

export const actions = {
  startLoading: (item: Item) => {
    setTimeout(() => {
      const result: Item[] = utils
        .generateNumbers(Math.round(5 + Math.random() * 5))
        .map((num) => ({
          id: Math.random() + "",
          title: "Loaded item " + num,
          children: [],
        }));
      actions.finishLoading(item, result);
    }, 2000);

    globalDispatch({
      type: "change-item",
      itemId: item.id,
      newItemProps: {
        isLoading: true,
      },
    });
  },
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
  focusItem: (item: Item) => {
    if (item.children.length == 0) {
      actions.startLoading(item);
    }
    globalDispatch({
      type: "focus-item",
      itemId: item.id,
    });
  },

  unfocus: () =>
    globalDispatch({
      type: "focus-item",
      itemId: "HOME",
    }),
};
