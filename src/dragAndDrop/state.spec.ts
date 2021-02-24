import * as items from "../state";

const initialItems: Items = {
  HOME: {
    id: "HOME",
    type: "folder",
    title: "Home",
    children: ["1", "2"],
  },
  1: {
    id: "1",
    type: "folder",
    title: "First",
    children: [],
  },
  2: {
    id: "2",
    type: "folder",
    title: "Second",
    children: [],
  },
};

it("droping 2 before 1 should change order of items in HOME", () => {
  let state: items.RootState = {
    ...items.initialState,
    items: initialItems,
    dragState: {
      itemId: "2",
      type: "draggingItem",
    },
    dragDestination: {
      itemUnderId: "1",
      itemPosition: "before",
      left: 0,
      top: 0,
      width: 0,
    },
  };
  const dispatch = (action: items.RootAction) => {
    state = items.reducer(state, action);
  };
  items.setGlobalDispatch(dispatch);
  items.actions.completeDnd();

  expect(getHome(state.items).children).toEqual(["2", "1"]);
});

it("droping 1 after 2 should change order of items in HOME", () => {
  let state: items.RootState = {
    ...items.initialState,
    items: initialItems,
    dragState: {
      itemId: "1",
      type: "draggingItem",
    },
    dragDestination: {
      itemUnderId: "2",
      itemPosition: "after",
      left: 0,
      top: 0,
      width: 0,
    },
  };
  const dispatch = (action: items.RootAction) => {
    state = items.reducer(state, action);
  };
  items.setGlobalDispatch(dispatch);
  items.actions.completeDnd();

  expect(getHome(state.items).children).toEqual(["2", "1"]);
});

it("droping 1 inside 2 should change order of items in HOME", () => {
  let state: items.RootState = {
    ...items.initialState,
    items: initialItems,
    dragState: {
      itemId: "1",
      type: "draggingItem",
    },
    dragDestination: {
      itemUnderId: "2",
      itemPosition: "inside",
      left: 0,
      top: 0,
      width: 0,
    },
  };
  const dispatch = (action: items.RootAction) => {
    state = items.reducer(state, action);
  };
  items.setGlobalDispatch(dispatch);
  items.actions.completeDnd();

  expect(getHome(state.items).children).toEqual(["2"]);
  expect(items.getChildren("2", state.items).map((i) => i.id)).toEqual(["1"]);
});

const getHome = (items: Items): Folder => items.HOME as Folder;
