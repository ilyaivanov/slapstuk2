type ItemAction = {
  type: "change-item";
  itemId: string;
  newItemProps: Partial<Item>;
};

export const reducer = (state: Items, action: ItemAction): Items => {
  if (action.type == "change-item") {
    return {
      ...state,
      [action.itemId]: {
        ...state[action.itemId],
        ...action.newItemProps,
      },
    };
  }
  return state;
};
let globalDispatch: React.Dispatch<ItemAction>;
export const setGlobalDispatch = (dispatch: React.Dispatch<ItemAction>) =>
  (globalDispatch = dispatch);

export const actions = {
  hideItemInSidebar: (item: Item) =>
    globalDispatch({
      type: "change-item",
      itemId: item.id,
      newItemProps: {
        isOpen: false,
      },
    }),
  openItemInSidebar: (item: Item) =>
    globalDispatch({
      type: "change-item",
      itemId: item.id,
      newItemProps: {
        isOpen: true,
      },
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
