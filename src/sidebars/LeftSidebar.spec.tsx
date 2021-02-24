import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ClassName, cls, tIds } from "../infra";
import * as items from "../state";
import LeftSidebar from "./LeftSidebar";
const initialItems: Items = {
  HOME: {
    id: "HOME",
    type: "folder",
    title: "Home",
    children: ["1", "2", "YoutubePlaylist"],
  },
  1: {
    id: "1",
    type: "folder",
    title: "First",
    children: ["1.1"],
  },
  2: {
    id: "2",
    type: "folder",
    title: "Second",
    children: [],
  },
  YoutubePlaylist: {
    type: "YTplaylist",
    id: "YoutubePlaylist",
    title: "YoutubePlaylist",
    image: "some image",
    playlistId: "playlistID",
    children: [],
  },
  "1.1": {
    id: "1.1",
    type: "folder",
    title: "First sub",
    children: [],
  },
};
const RenderTestSidebar = () => {
  const initialState: items.RootState = {
    ...items.initialState,
    items: initialItems,
  };
  const [state, dispatch] = React.useReducer(items.reducer, initialState);
  items.setGlobalDispatch(dispatch);
  return <LeftSidebar state={state} onResize={jest.fn()} />;
};

describe("Slaptuk sidebar", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    render(<RenderTestSidebar />);
  });

  describe("FIRST RENDER ", () => {
    it("First item is closed", () => {
      expect(queryChildrenContainerForItem("1")).not.toBeInTheDocument();
      expect(getChevronForItem("1")).not.toHaveClass(cls.rowChevronRotated);
    });

    it("HOME node should NOT have an unfocus button", () => {
      expect(queryUnfocusButton("HOME")).not.toBeInTheDocument();
    });
  });

  describe("EXPAND/COLLAPSE ", () => {
    describe("clicking on an item with loaded subitems", () => {
      beforeEach(() => fireEvent.click(getChevronForItem("1")));
      it("opens its children", () => {
        expect(getChevronForItem("1")).toHaveClass(cls.rowChevronRotated);
        const firstSubRow = queryRowForItem("1.1");
        expect(firstSubRow).toBeInTheDocument();
        expect(firstSubRow).toHaveStyle("padding-left: 19px");
      });

      describe("clicking on it again", () => {
        beforeEach(() => fireEvent.click(getChevronForItem("1")));
        it("hides its children", () => {
          expect(getChevronForItem("1")).not.toHaveClass(cls.rowChevronRotated);
          expect(queryRowForItem("1.1")).not.toBeInTheDocument();
        });
      });
    });
  });

  describe("FOCUS", () => {
    describe("Focusing on a first item", () => {
      beforeEach(() => fireEvent.click(getFocusButtonForItem("1")));

      it("should show its children", () => {
        expect(getRowForItem("1.1")).toBeInTheDocument();
      });
      it("should remove home", () => {
        expect(queryRowForItem("HOME")).not.toBeInTheDocument();
      });
      it("should add focused class to a first row", () => {
        expect(queryRowForItem("1")).toHaveClass(cls.rowFocused);
      });
      it("overall there should be only two rows (First and Children)", () => {
        expect(getAllRows()).toHaveLength(2);
      });

      it("there should be no chevron for item 1", () => {
        expect(queryChevronForItem("1")).not.toBeInTheDocument();
      });

      describe("clicking unfocus on 1 row", () => {
        beforeEach(() => fireEvent.click(getUnfocusButton("1")));
        it("HOME should be focused", () => {
          expect(getRowForItem("HOME")).toHaveClass(cls.rowFocused);
        });
        it("1 node should be unfocused", () => {
          expect(getRowForItem("1")).not.toHaveClass(cls.rowFocused);
        });
      });
    });

    xdescribe("Focusing on a second item", () => {
      beforeEach(() => fireEvent.click(getFocusButtonForItem("2")));

      it("should show loading indicator", () => {
        expect(getLoadingForItem("2")).toBeInTheDocument();
      });

      describe("after items have been loaded", () => {
        beforeEach(() => {
          act(() => {
            jest.runAllTimers();
          });
        });
        it("should show some items", () => {
          expect(getAllRows().length).toBeGreaterThan(1);
        });
      });
    });
  });

  describe("CHANGE SIDEBAR WIDTH AND VISIBILITY", () => {
    it("By default sidebar width is 300px", () => {
      expect(getSidebar()).toHaveStyle("width: 300px");
    });

    it("clicking on a change width indicator and dragging to 305px from left should set width to 305px", () => {
      fireEvent.mouseDown(getByClass(cls.sidebarWidthAdjuster));
      fireEvent.mouseMove(document, { clientX: 305 });
      fireEvent.mouseUp(document);
      expect(getSidebar()).toHaveStyle("width: 307px");
    });
    it("left sidebar left margin should be zero", () => {
      expect(getSidebar()).toHaveStyle("margin-left: 0px");
    });

    describe("when hiding left sidebar", () => {
      beforeEach(() => {
        act(() => {
          items.actions.assignUiOptions({
            isLeftSidebarVisible: false,
          });
        });
      });
      it("negative left margin should be set to its width (by default 300px)", () => {
        expect(getSidebar()).toHaveStyle("margin-left: -300px");
      });
    });
  });

  xdescribe("SIDEBAR CONTEXT MENU EDIT/REMOVE", () => {
    it("clicking on a first item options should show a context menu close to it", () => {
      fireEvent.click(getContextMenuIcon("1"));
      expect(getContextMenu()).toBeInTheDocument();

      fireEvent.click(document);
      expect(getContextMenu()).not.toBeInTheDocument();
    });

    describe("clicking menu button on First item", () => {
      beforeEach(() => {
        fireEvent.click(getChevronForItem("1"));
        fireEvent.click(getContextMenuIcon("1"));
      });

      describe("then clicking remove", () => {
        beforeEach(() => {
          fireEvent.click(getDeleteContextMenu());
        });
        it("should remove it and its children from the sidebar", () => {
          expect(queryRowForItem("1")).not.toBeInTheDocument();
          expect(queryRowForItem("1.1")).not.toBeInTheDocument();
        });
      });

      describe("then clicking rename", () => {
        beforeEach(() => {
          fireEvent.click(getRenameContextMenuOption());
        });
        it("should show input field with a item title value", () => {
          expect(queryRowTitleInputForItem("1")).toBeInTheDocument();
          expect(queryRowTitleInputForItem("1")).toHaveValue("First");
        });

        describe("entering new name", () => {
          beforeEach(() => {
            fireEvent.change(getRowTitleInputForItem("1"), {
              target: { value: "First New Title" },
            });
          });
          describe("and pressing enter", () => {
            beforeEach(() => {
              fireEvent.keyUp(getRowTitleInputForItem("1"), { key: "Enter" });
            });
            it("removes input and aplies new name to the first item", () => {
              expect(queryRowTitleInputForItem("1")).not.toBeInTheDocument();
              expect(getRowTextForItem("1")).toHaveTextContent(
                "First New Title"
              );
            });
          });
          describe("and bluring element", () => {
            beforeEach(() => {
              fireEvent.blur(getRowTitleInputForItem("1"));
            });
            it("removes input and aplies new name to the first item", () => {
              expect(queryRowTitleInputForItem("1")).not.toBeInTheDocument();
              expect(getRowTextForItem("1")).toHaveTextContent(
                "First New Title"
              );
            });
          });
        });
      });
    });
  });

  describe("SELECTION", () => {
    it("Clicking on a First row should select it", () => {
      expect(getRowForItem("1")).not.toHaveClass(cls.rowSelected);
      fireEvent.click(getRowForItem("1"));
      expect(getRowForItem("1")).toHaveClass(cls.rowSelected);
    });
  });

  describe("SIDEBAR HEADER ACTIONS", () => {
    it("at Home selected creating a new node adds a new node as first child of HOME with edited node", () => {
      Math.random = () => 555;
      fireEvent.click(getCreateFolderIcon());
      expect(getRowTitleInputForItem("555")).toHaveValue("New Folder");
      fireEvent.change(getRowTitleInputForItem("555"), {
        target: { value: "My Foo" },
      });
      fireEvent.keyUp(getRowTitleInputForItem("555"), { key: "Enter" });
      expect(getRowTextForItem("555")).toHaveTextContent("My Foo");
    });
  });
});

//actions
const clickHideLeftSidebar = () => fireEvent.click(get(tIds.toggleSidebar));
const getAllRows = () => document.getElementsByClassName(cls.row);

//selectors
const getSidebar = () => getByClass(cls.leftSidebar);
const getChevronForItem = (itemId: string) => get("chevron-" + itemId);
const queryChevronForItem = (itemId: string) => query("chevron-" + itemId);
const getLoadingForItem = (itemId: string) => get("loading-" + itemId);
const queryChildrenContainerForItem = (itemId: string) =>
  query("children-" + itemId);
const queryRowForItem = (itemId: string) => query("row-" + itemId);
const queryRowTitleInputForItem = (itemId: string) =>
  query("rowTitleInput-" + itemId);
const getRowTitleInputForItem = (itemId: string) =>
  get("rowTitleInput-" + itemId);
const getFocusButtonForItem = (itemId: string) => get("circle-" + itemId);
const getUnfocusButton = (itemId: string) => get("unfocus-" + itemId);
const queryUnfocusButton = (itemId: string) => query("unfocus-" + itemId);
const getRowForItem = (itemId: string) => get("row-" + itemId);
const getRowTextForItem = (itemId: string) => get("rowText-" + itemId);

//Sidebar
const getCreateFolderIcon = () => get("sidebarCreateFolder");

//Context Menu
const getContextMenuIcon = (itemId: string) => get("menu-" + itemId);
const getContextMenu = () => getByClass(cls.contextMenu);
const getDeleteContextMenu = () => get(tIds.contextMenuDelete);
const getRenameContextMenuOption = () => get(tIds.contextMenuRename);

//infra
const get = (testId: string | RegExp) => screen.getByTestId(testId);
const query = (testId: string | RegExp) => screen.queryByTestId(testId);
const getAll = (testId: string | RegExp) => screen.getAllByTestId(testId);

const getByClass = (c: ClassName): HTMLElement =>
  document.querySelector("." + c) as HTMLElement;
