import { colors } from "./infra";
import * as search from "./api/search";
import { LoadingItemsReponse } from "./api/search";

export type RootState = {
  items: Items;
  //UI options are consious user UI choices (width of sidebar)
  uiOptions: UIOptions;
  //UI state is technical state not directly relevant to functional requirements (is mouse down or not)
  uiState: UIState;

  dragState?: DragState;
  dragDestination?: DragDestination;
};

const defaultItems: Items = {
  HOME: {
    type: "folder",
    children: [],
    id: "HOME",
    title: "Home",
  },
  SEARCH: {
    type: "search",
    searchTerm: "",
    children: [],
    id: "SEARCH",
    title: "Search",
  },
};

export const initialState: RootState = {
  items: defaultItems,
  uiOptions: {
    focusedNode: "HOME",
    selectedNode: "HOME",
    leftSidebarWidth: 300,
    isLeftSidebarVisible: true,
  },
  uiState: {
    isMouseDownOnAdjuster: false,
    appState: "Loading",
  },
};

export type UIOptions = {
  focusedNode: string;
  selectedNode: string;
  itemIdBeingPlayed?: string;
  leftSidebarWidth: number;
  isLeftSidebarVisible: boolean;
};

export type UIState = {
  isMouseDownOnAdjuster: boolean;
  appState: GlobalAppState;
  contextMenu?: ContextMenu;
  renameState?: RenameState;
  user?: UserInfo;
};

export type UserInfo = {
  id: string;
  username: string;
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

export type DropPlacement = "after" | "before" | "inside" | "instead";

export type DragDestination = {
  itemUnderId: string;
  itemPosition: DropPlacement;
  width: number;
  top: number;
  left: number;
};

export type DragState =
  | {
      type: "mouseDownNoDrag";
      itemId: string;
      point: Point;
    }
  | {
      type: "draggingItem";
      itemId: string;
    };

export type GlobalAppState = "Loading" | "Loaded";

const itemsReducer = (items: Items, action: RootAction): Items => {
  if (action.type == "change-item") {
    return assignItem(items, action.payload.id, (item) => ({
      ...item,
      ...action.payload,
    }));
  }
  if (action.type == "item-delete") {
    const parent = getParent(action.payload, items);
    if (parent && isContainer(parent)) {
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
    const { payload } = action;
    const item = items[payload.itemId];
    if (isContainer(item)) {
      const newItems = payload.items.reduce(
        (ac, i) => ({ ...ac, [i.id]: i }),
        {}
      );
      return {
        ...items,
        [item.id]: {
          ...item,
          isLoading: false,
          children: item.children.concat(payload.items.map((i) => i.id)),
          nextPageToken: payload.nextPageToken,
        },
        ...newItems,
      };
    }
  }
  if (action.type === "item-move") {
    const { itemToMove, relativePosition, itemToMoveTo } = action.payload;
    if (relativePosition === "instead")
      return setItemOnPlaceOf(items, itemToMove, itemToMoveTo);
    else return drop(items, itemToMove, itemToMoveTo, relativePosition);
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
      id: action.payload,
      type: "folder",
      children: [],
      title: "New Folder",
    };
    const selectedNodeItem = state.items[selectedNode];
    if (isContainer(selectedNodeItem)) {
      return {
        ...state,
        items: {
          ...state.items,
          [selectedNode]: {
            ...selectedNodeItem,
            children: [newNode.id].concat(selectedNodeItem.children),
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
  }

  if (action.type === "user-state-loaded") {
    const { payload } = action;
    const items = payload ? JSON.parse(payload.itemsSerialized) : defaultItems;
    //@ts-expect-error
    global.items = items;
    // console.log(Object.keys(items).length);
    const selectedNode = payload ? payload.selectedItemId : "HOME";
    return {
      ...state,
      items,
      uiOptions: {
        ...state.uiOptions,
        selectedNode,
      },
      uiState: {
        ...state.uiState,
        appState: "Loaded",
      },
    };
  }
  if (action.type === "player/playNext") {
    const { itemIdBeingPlayed } = state.uiOptions;
    if (itemIdBeingPlayed) {
      const parent = getParent(itemIdBeingPlayed, state.items);
      if (parent) {
        const childre = getChildren(parent.id, state.items).map((i) => i.id);
        const nextItemIndex = childre.indexOf(itemIdBeingPlayed);
        if (nextItemIndex < childre.length - 1) {
          const nextItemId = childre[nextItemIndex + 1];
          return {
            ...state,
            uiOptions: {
              ...state.uiOptions,
              itemIdBeingPlayed: nextItemId,
            },
          };
        }
      }
    }
  }
  if (action.type === "player/play") {
    return {
      ...state,
      uiOptions: {
        ...state.uiOptions,
        itemIdBeingPlayed: action.payload,
      },
    };
  }
  if (action.type === "dnd/setDragState") {
    return { ...state, dragState: action.payload };
  }
  if (action.type === "dnd/setDragDestination") {
    return { ...state, dragDestination: action.payload };
  }
  if (action.type === "dnd/completeDrag") {
    console.log("dnd/completeDrag");
    const newItems =
      state.dragDestination && state.dragState
        ? itemsReducer(state.items, {
            type: "item-move",
            payload: {
              itemToMove: state.dragState.itemId,
              itemToMoveTo: state.dragDestination.itemUnderId,
              relativePosition: state.dragDestination.itemPosition,
            },
          })
        : state.items;
    return {
      ...state,
      items: newItems,
      dragDestination: undefined,
      dragState: undefined,
    };
  }
  return state;
};

type ActionPayload<ActionStringType, PayloadType> = {
  type: ActionStringType;
  payload: PayloadType;
};

type ActionPlain<ActionStringType> = {
  type: ActionStringType;
};

type ItemModification<ItemType extends Item> = Partial<ItemType> & {
  id: string;
};

export type ItemMovement = {
  itemToMove: string;
  itemToMoveTo: string;
  relativePosition: DropPlacement;
};

export type RootAction =
  | ActionPayload<"change-item", ItemModification<Item>>
  | ActionPayload<"change-ui-options", Partial<UIOptions>>
  | ActionPayload<"change-ui-state", Partial<UIState>>
  | ActionPayload<
      "item-loaded",
      { itemId: string; items: Item[]; nextPageToken: string | undefined }
    >
  | ActionPayload<"item-start-rename", string>
  | ActionPayload<"item-set-new-name", string>
  | ActionPlain<"item-apply-rename">
  | ActionPayload<"item-delete", string>
  | ActionPayload<"item-create", string>
  | ActionPayload<"item-move", ItemMovement>
  | ActionPayload<"user-state-loaded", PersistedState>
  | ActionPayload<"dnd/setDragState", DragState | undefined>
  | ActionPayload<"dnd/setDragDestination", DragDestination | undefined>
  | ActionPlain<"dnd/completeDrag">
  | ActionPayload<"player/play", string>
  | ActionPlain<"player/playNext">;

export const actions = {
  assignItem: <T extends Item>(itemModification: ItemModification<T>) =>
    globalDispatch({
      type: "change-item",
      payload: itemModification as any,
    }),

  searchForItems: (searchNode: SearchContainer) => {
    actions.assignItem<SearchContainer>(searchNode);
    actions.selectItem("SEARCH");
    search.loadItemChildren(searchNode).then((response) => {
      actions.finishLoading(searchNode, response);
    });
  },

  loadItem: (item: Item) => {
    actions.assignItem<SearchContainer>({
      id: item.id,
      isLoading: true,
    });
    search.loadItemChildren(item).then((response) => {
      actions.finishLoading(item, response);
    });
  },

  finishLoading: (item: Item, response: LoadingItemsReponse) =>
    globalDispatch({
      type: "item-loaded",
      payload: {
        itemId: item.id,
        items: response.items,
        nextPageToken: response.nextPageToken,
      },
    }),

  toggleItemInSidebar: (item: ItemContainer) =>
    globalDispatch({
      type: "change-item",
      payload: { id: item.id, isOpenFromSidebar: !item.isOpenFromSidebar },
    }),

  toggleItemInGallery: (item: ItemContainer) =>
    globalDispatch({
      type: "change-item",
      payload: {
        id: item.id,
        isCollapsedInGallery: !item.isCollapsedInGallery,
      },
    }),

  focusItem: (itemId: string) => {
    // if (isContainer(item) && item.children.length == 0) {
    //   actions.startLoading(item);
    // }
    actions.assignUiOptions({ focusedNode: itemId });
  },

  unfocus: () => actions.assignUiOptions({ focusedNode: "HOME" }),

  setSidebarWidth: (leftSidebarWidth: number) =>
    actions.assignUiOptions({ leftSidebarWidth }),

  assignUiState: (uiState: Partial<UIState>) =>
    globalDispatch({ type: "change-ui-state", payload: uiState }),

  assignUiOptions: (options: Partial<UIOptions>) =>
    globalDispatch({ type: "change-ui-options", payload: options }),

  selectItem: (selectedNode: string) => {
    // if (isNeedsToBeLoaded()) {
    //   actions.startLoading(item);
    // }
    actions.assignUiOptions({ selectedNode });
  },

  deleteItem: (itemId: string) =>
    globalDispatch({ type: "item-delete", payload: itemId }),

  startRenameItem: (itemId: string) =>
    globalDispatch({ type: "item-start-rename", payload: itemId }),

  setNewName: (name: string) =>
    globalDispatch({ type: "item-set-new-name", payload: name }),

  addNewForder: () =>
    globalDispatch({ type: "item-create", payload: Math.random() + "" }),

  finishRenamingItem: () => globalDispatch({ type: "item-apply-rename" }),

  userSettingsLoaded: (state: PersistedState) =>
    globalDispatch({ type: "user-state-loaded", payload: state }),

  //Player
  playVideo: (itemId: string) =>
    globalDispatch({ type: "player/play", payload: itemId }),
  playNextVideo: () => globalDispatch({ type: "player/playNext" }),

  //Drag and drop
  mouseDownOnItem: (itemId: string, point: Point) =>
    globalDispatch({
      type: "dnd/setDragState",
      payload: {
        type: "mouseDownNoDrag",
        itemId,
        point,
      },
    }),
  setDragDestination: (dragDestination: DragDestination) =>
    globalDispatch({
      type: "dnd/setDragDestination",
      payload: dragDestination,
    }),
  startDragging: (itemId: string) =>
    globalDispatch({
      type: "dnd/setDragState",
      payload: {
        type: "draggingItem",
        itemId,
      },
    }),
  completeDnd: () => globalDispatch({ type: "dnd/completeDrag" }),
  removeDestination: () =>
    globalDispatch({
      type: "dnd/setDragDestination",
      payload: undefined,
    }),
};

//Some behaviour on top of items
export const isFolder = (item: Item): item is Folder => {
  return item.type == "folder";
};
export const isPlaylist = (item: Item): item is YoutubePlaylist => {
  return item.type == "YTplaylist";
};

export const isVideo = (item: Item): item is YoutubeVideo => {
  return item.type == "YTvideo";
};

export const isChannel = (item: Item): item is YoutubeChannel => {
  return item.type == "YTchannel";
};

export const isSearch = (item: Item): item is SearchContainer => {
  return item.type == "search";
};

export function isContainer(item: Item): item is ItemContainer {
  return (
    item.type == "YTchannel" ||
    item.type == "folder" ||
    item.type == "search" ||
    item.type == "YTplaylist"
  );
}

export const isNeedsToBeLoaded = (item: Item): boolean =>
  (isPlaylist(item) && item.children.length == 0 && !item.isLoading) ||
  (isSearch(item) && item.children.length == 0 && !item.isLoading) ||
  (isChannel(item) && item.children.length == 0 && !item.isLoading);

export const hasNextPage = (item: Item): boolean =>
  (isPlaylist(item) && !!item.nextPageToken && !item.isLoading) ||
  (isChannel(item) && !!item.nextPageToken && !item.isLoading) ||
  (isSearch(item) && !!item.nextPageToken && !item.isLoading);

export const isLoadingAnything = (item: Item): boolean => {
  return (
    (isPlaylist(item) && !!item.isLoading) ||
    (isChannel(item) && !!item.isLoading) ||
    (isSearch(item) && !!item.isLoading)
  );
};
export const isLoadingNextPage = (item: Item): boolean => {
  return (
    (isPlaylist(item) && !!item.isLoading && !!item.nextPageToken) ||
    (isChannel(item) && !!item.isLoading && !!item.nextPageToken) ||
    (isSearch(item) && !!item.isLoading && !!item.nextPageToken)
  );
};

export const isOpenAtSidebar = (item: Item) =>
  isContainer(item) &&
  (typeof item.isOpenFromSidebar != "undefined"
    ? item.isOpenFromSidebar
    : false);

export const isOpenAtGallery = (item: Item) =>
  isContainer(item) && !item.isCollapsedInGallery;

export const getItemColor = (item: Item): string => {
  if (isFolder(item)) return colors.folderColor;
  if (isChannel(item)) return colors.channelColor;
  if (isPlaylist(item)) return colors.playlistColor;
  if (isVideo(item)) return colors.videoColor;
  return "white";
};
export const getChildren = (itemId: string, allItems: Items): Item[] => {
  const item = allItems[itemId];
  if (isContainer(item)) return item.children.map((id) => allItems[id]);
  else return [];
};

export const getParent = (
  itemId: string,
  allItems: Items
): ItemContainer | undefined =>
  Object.values(allItems).find(
    (item) => isContainer(item) && item.children.indexOf(itemId) >= 0
  ) as ItemContainer;

export const createPersistedState = (state: RootState): PersistedState => {
  const homeNodes: Items = {};
  const traverse = (id: string) => {
    const item = state.items[id];
    homeNodes[id] = item;
    if (isContainer(item) && item.children.length > 0) {
      item.children.forEach(traverse);
    }
  };
  traverse("HOME");

  const count = (items: Items) => Object.keys(items).length;
  console.log(
    `Saving to backend ${count(homeNodes)} (from ${count(state.items)})`
  );

  //selected node might be removed, in that case point to a HOME
  const selectedItemId = homeNodes[state.uiOptions.selectedNode]
    ? state.uiOptions.selectedNode
    : "HOME";
  return {
    focusedStack: [],
    itemsSerialized: JSON.stringify(homeNodes),
    selectedItemId,
  };
};

export const getPreviewImages = (
  item: Item,
  count: number,
  allItems: Items
): string[] =>
  getChildren(item.id, allItems)
    .map((c) => getFirstImage(c, allItems))
    .filter((x) => !!x)
    .slice(0, count) as string[];

export const getFirstImage = (
  item: Item,
  allItems: Items
): string | undefined => {
  if (isFolder(item)) {
    const children = getChildren(item.id, allItems);
    return children
      .map((c) => getFirstImage(c, allItems))
      .filter((x) => !!x)[0] as string;
  }
  return getImageSrc(item) as string;
};

export const getFirstVideo = (
  item: Item,
  allItems: Items
): YoutubeVideo | undefined => {
  if (isContainer(item)) {
    const children = getChildren(item.id, allItems);
    return children
      .map((c) => getFirstVideo(c, allItems))
      .filter((x) => !!x)[0] as YoutubeVideo;
  } else if (isVideo(item)) return item;
};

export const getImageSrc = (item: Item): string | undefined => {
  if (isVideo(item))
    return `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`;
  else if (isPlaylist(item) || isChannel(item)) return item.image;
  else return undefined;
};

//Yes, I know, global dispatch and accesing it from compoents with any props nor context
//This is fine, since actions never change, I do not need to mess with a passing actions to props
//Inspired by Elm when only data is passed around, all actions are global
let globalDispatch: React.Dispatch<RootAction>;
export const setGlobalDispatch = (dispatch: React.Dispatch<RootAction>) =>
  (globalDispatch = dispatch);

///DND HELPERS

const findParentId = (items: Items, id: string) =>
  getParent(id, items)?.id as string;

export const drop = (
  items: Items,
  itemBeingDragged: string,
  itemToDropAround: string,
  howToDrop: "before" | "after" | "inside"
): Items => {
  const parentId = findParentId(items, itemBeingDragged || "");
  const copyItems = assignItem<ItemContainer>(items, parentId, (i) => ({
    children: i.children.filter((child) => child !== itemBeingDragged),
  }));
  if (howToDrop === "inside") {
    let targetIndex = 0;

    const itemToDropAroundC = copyItems[itemToDropAround] as ItemContainer;
    const newChildren = [...itemToDropAroundC.children];
    newChildren.splice(targetIndex, 0, itemBeingDragged);
    copyItems[itemToDropAround] = {
      ...itemToDropAroundC,
      children: newChildren,
    };
  } else {
    const nodeUnderParentId = findParentId(copyItems, itemToDropAround);
    if (howToDrop == "after") {
      return assignItem<ItemContainer>(copyItems, nodeUnderParentId, (i) => ({
        children: i.children
          .map((id) => (id == itemToDropAround ? [id, itemBeingDragged] : id))
          .flat(),
      }));
    } else if (howToDrop == "before") {
      return assignItem<ItemContainer>(copyItems, nodeUnderParentId, (i) => ({
        children: i.children
          .map((id) => (id == itemToDropAround ? [itemBeingDragged, id] : id))
          .flat(),
      }));
    } else {
      throw new Error();
    }
  }

  return copyItems;
};

export const setItemOnPlaceOf = (
  items: Items,
  itemBeingDragged: string,
  itemToReplace: string
): Items => {
  const parentOfItemBeingDragged = findParentId(items, itemBeingDragged || "");
  const parentTargetItemId = findParentId(items, itemToReplace || "");

  if (parentOfItemBeingDragged === parentTargetItemId) {
    const parentItem = items[parentOfItemBeingDragged] as ItemContainer;
    const parentChildren = parentItem.children;
    const targetIndex = parentChildren.indexOf(itemToReplace);
    const currentIndex = parentChildren.indexOf(itemBeingDragged);
    const dropDestination = targetIndex < currentIndex ? "before" : "after";
    return drop(items, itemBeingDragged, itemToReplace, dropDestination);
  } else {
    return drop(items, itemBeingDragged, itemToReplace, "before");
  }
};

const assignItem = <T extends Item>(
  items: Items,
  itemId: string,
  mapper: (item: T) => Partial<T>
): Items =>
  ({
    ...items,
    [itemId]: {
      ...items[itemId],
      ...mapper(items[itemId] as T),
    },
  } as Items);
