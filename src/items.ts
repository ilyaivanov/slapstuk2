import { utils } from "./infra";

export type RootState = {
  items: Items;
  //UI options are consious user UI choices (width of sidebar)
  uiOptions: UIOptions;
  //UI state is technical state not directly relevant to functional requirements (is mouse down or not)
  uiState: UIState;
};

type UIOptions = {
  focusedNode: string;
  selectedNode: string;
  leftSidebarWidth: number;
  isLeftSidebarVisible: boolean;
};

type UIState = {
  isMouseDownOnAdjuster: boolean;
  contextMenu?: ContextMenu;
  renameState?: RenameState;
};

export type RenameState = {
  itemBeingRenamed: string;
  newName: string;
};

export type ContextMenu = {
  x: number;
  y: number;
  itemId: string;
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
  if (action.type == "item-delete") {
    const parent = Object.values(items).find(
      (item) => item.children.indexOf(action.itemId) >= 0
    );
    if (parent) {
      let copy = { ...items };
      //do not delete actual item, if it is focused I wan't it to still be display
      //Althought I don't want to save selectedITem to backend which is removed
      // delete copy[action.itemId];
      copy[parent.id] = {
        ...parent,
        children: parent.children.filter((id) => id != action.itemId),
      };
      return copy;
    } else return items;
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
  if (
    action.type == "change-item" ||
    action.type == "item-loaded" ||
    action.type == "item-delete"
  ) {
    return {
      ...state,
      items: itemsReducer(state.items, action),
    };
  }
  if (action.type == "change-ui-options") {
    return {
      ...state,
      uiOptions: {
        ...state.uiOptions,
        ...action.options,
      },
    };
  }
  if (action.type == "change-ui-state") {
    return {
      ...state,
      uiState: {
        ...state.uiState,
        ...action.uiState,
      },
    };
  }
  if (action.type == "item-start-rename") {
    return {
      ...state,
      uiState: {
        ...state.uiState,
        renameState: {
          ...state.uiState.renameState,
          itemBeingRenamed: action.itemId,
          newName: state.items[action.itemId].title,
        },
      },
    };
  }
  if (action.type == "item-set-new-name") {
    if (state.uiState.renameState)
      return {
        ...state,
        uiState: {
          ...state.uiState,
          renameState: {
            ...state.uiState.renameState,
            newName: action.name,
          },
        },
      };
    return state;
  }
  if (action.type == "item-apply-rename") {
    const { renameState } = state.uiState;
    if (renameState) {
      const newItems = itemsReducer(state.items, {
        type: "change-item",
        itemId: renameState.itemBeingRenamed,
        newItemProps: {
          title: renameState.newName,
        },
      });
      return {
        ...state,
        items: newItems,
        uiState: {
          ...state.uiState,
          renameState: undefined,
        },
      };
    }
  }
  return state;
};

type Action =
  | ItemAction
  | ItemLoaded
  | ChangeUIOptions
  | ChangeUIState
  | StartRenamingItem
  | SetNewName
  | ApplyItemRename
  | DeleteItem;

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
type ChangeUIOptions = {
  type: "change-ui-options";
  options: Partial<UIOptions>;
};
type ChangeUIState = {
  type: "change-ui-state";
  uiState: Partial<UIState>;
};
type DeleteItem = {
  type: "item-delete";
  itemId: string;
};
type StartRenamingItem = {
  type: "item-start-rename";
  itemId: string;
};
type SetNewName = {
  type: "item-set-new-name";
  name: string;
};
type ApplyItemRename = {
  type: "item-apply-rename";
};

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
      type: "change-ui-options",
      options: { focusedNode: item.id },
    });
  },

  unfocus: () =>
    globalDispatch({
      type: "change-ui-options",
      options: { focusedNode: "HOME" },
    }),

  setSidebarWidth: (leftSidebarWidth: number) =>
    actions.assignUiOptions({ leftSidebarWidth }),

  assignUiState: (uiState: Partial<UIState>) =>
    globalDispatch({ type: "change-ui-state", uiState }),

  assignUiOptions: (options: Partial<UIOptions>) =>
    globalDispatch({ type: "change-ui-options", options }),

  selectItem: (itemId: string) =>
    globalDispatch({
      type: "change-ui-options",
      options: { selectedNode: itemId },
    }),

  deleteItem: (itemId: string) =>
    globalDispatch({ type: "item-delete", itemId }),

  startRenameItem: (itemId: string) =>
    globalDispatch({ type: "item-start-rename", itemId }),

  setNewName: (name: string) =>
    globalDispatch({ type: "item-set-new-name", name }),

  finishRenamingItem: () => globalDispatch({ type: "item-apply-rename" }),

  cancelRenamingItem: () =>
    globalDispatch({
      type: "change-ui-state",
      uiState: { renameState: undefined },
    }),
};

//Yes, I know, global dispatch and accesing it from compoents with any props nor context
//This is fine, since actions never change, I do not need to mess with a passing actions to props
//Inspired by Elm when only data is passed around, all actions are global
let globalDispatch: React.Dispatch<Action>;
export const setGlobalDispatch = (dispatch: React.Dispatch<Action>) =>
  (globalDispatch = dispatch);
