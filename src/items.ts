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

const itemsReducer = (items: Items, action: RootAction): Items => {
  if (action.type == "change-item") {
    return {
      ...items,
      [action.payload.id]: {
        ...items[action.payload.id],
        ...action.payload,
      },
    };
  }
  if (action.type == "item-delete") {
    const parent = Object.values(items).find(
      (item) => item.children.indexOf(action.payload) >= 0
    );
    if (parent) {
      let copy = { ...items };
      //do not delete actual item, if it is focused I wan't it to still be display
      //Althought I don't want to save selectedITem to backend which is removed
      // delete copy[action.itemId];
      copy[parent.id] = {
        ...parent,
        children: parent.children.filter((id) => id != action.payload),
      };
      return copy;
    } else return items;
  }
  if (action.type == "item-loaded") {
    const newItems = action.payload.items.reduce(
      (ac, item) => ({ ...ac, [item.id]: item }),
      {}
    );
    return {
      ...items,
      [action.payload.itemId]: {
        ...items[action.payload.itemId],
        isLoading: false,
        children: action.payload.items.map((i) => i.id),
      },
      ...newItems,
    };
  }
  return items;
};

export const reducer = (state: RootState, action: RootAction): RootState => {
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
        ...action.payload,
      },
    };
  }
  if (action.type == "change-ui-state") {
    return {
      ...state,
      uiState: {
        ...state.uiState,
        ...action.payload,
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
          itemBeingRenamed: action.payload,
          newName: state.items[action.payload].title,
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
            newName: action.payload,
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
        payload: {
          id: renameState.itemBeingRenamed,
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
  if (action.type == "item-create") {
    const { selectedNode } = state.uiOptions;
    const newNode: Item = {
      id: Math.random() + "",
      children: [],
      title: "New Folder",
    };

    return {
      ...state,
      items: {
        ...state.items,
        [selectedNode]: {
          ...state.items[selectedNode],
          children: [newNode.id].concat(state.items[selectedNode].children),
        },
        [newNode.id]: newNode,
      },
      uiState: {
        ...state.uiState,
        renameState: {
          itemBeingRenamed: newNode.id,
          newName: newNode.title,
        },
      },
    };
  }
  return state;
};

type ActionPayload<ActionStringType, PayloadType> = {
  type: ActionStringType;
  payload: PayloadType;
};

type Action<ActionStringType> = {
  type: ActionStringType;
};

type RootAction =
  | ActionPayload<"change-item", Partial<Item> & { id: string }>
  | ActionPayload<"item-loaded", { itemId: string; items: Item[] }>
  | ActionPayload<"change-ui-options", Partial<UIOptions>>
  | ActionPayload<"change-ui-state", Partial<UIState>>
  | ActionPayload<"item-start-rename", string>
  | ActionPayload<"item-set-new-name", string>
  | Action<"item-apply-rename">
  | ActionPayload<"item-delete", string>
  | Action<"item-create">;

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
      payload: {
        id: item.id,
        isLoading: true,
      },
    });
  },

  finishLoading: (item: Item, subitems: Item[]) =>
    globalDispatch({
      type: "item-loaded",
      payload: { itemId: item.id, items: subitems },
    }),

  toggleItemInSidebar: (item: Item) =>
    globalDispatch({
      type: "change-item",
      payload: { id: item.id, isOpen: !item.isOpen },
    }),

  focusItem: (item: Item) => {
    if (item.children.length == 0) {
      actions.startLoading(item);
    }
    actions.assignUiOptions({ focusedNode: item.id });
  },

  unfocus: () => actions.assignUiOptions({ focusedNode: "HOME" }),

  setSidebarWidth: (leftSidebarWidth: number) =>
    actions.assignUiOptions({ leftSidebarWidth }),

  assignUiState: (uiState: Partial<UIState>) =>
    globalDispatch({ type: "change-ui-state", payload: uiState }),

  assignUiOptions: (options: Partial<UIOptions>) =>
    globalDispatch({ type: "change-ui-options", payload: options }),

  selectItem: (selectedNode: string) =>
    actions.assignUiOptions({ selectedNode }),

  deleteItem: (itemId: string) =>
    globalDispatch({ type: "item-delete", payload: itemId }),

  startRenameItem: (itemId: string) =>
    globalDispatch({ type: "item-start-rename", payload: itemId }),

  setNewName: (name: string) =>
    globalDispatch({ type: "item-set-new-name", payload: name }),

  addNewForder: () => globalDispatch({ type: "item-create" }),

  finishRenamingItem: () => globalDispatch({ type: "item-apply-rename" }),

  cancelRenamingItem: () =>
    globalDispatch({
      type: "change-ui-state",
      payload: { renameState: undefined },
    }),
};

//Yes, I know, global dispatch and accesing it from compoents with any props nor context
//This is fine, since actions never change, I do not need to mess with a passing actions to props
//Inspired by Elm when only data is passed around, all actions are global
let globalDispatch: React.Dispatch<RootAction>;
export const setGlobalDispatch = (dispatch: React.Dispatch<RootAction>) =>
  (globalDispatch = dispatch);
