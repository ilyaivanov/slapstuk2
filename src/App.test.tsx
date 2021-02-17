import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import { ClassName, cls, tIds } from "./infra";

jest.mock("./initialItems", () => ({
  HOME: {
    id: "HOME",
    title: "Home",
    children: ["1", "2"],
  },
  1: {
    id: "1",
    title: "First",
    children: ["1.1"],
  },
  2: {
    id: "2",
    title: "Second",
    children: [],
  },
  "1.1": {
    id: "1.1",
    title: "First sub",
    children: [],
  },
}));

describe("Slaptuk app", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    render(<App />);
  });

  it("show have three rows", () => {
    expect(getAllRows()).toHaveLength(3);
  });

  it("First item is closed", () => {
    expect(queryChildrenContainerForItem("1")).not.toBeInTheDocument();
    expect(getChevronForItem("1")).not.toHaveClass(cls.rowChevronRotated);
  });

  it("Home node should NOT have an unfocus button", () => {
    expect(queryUnfocusButton("HOME")).not.toBeInTheDocument();
  });

  //EXPAND/COLLAPSE
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

  //LOADING
  describe("clicking on an item that requires loading", () => {
    beforeEach(() => fireEvent.click(getChevronForItem("2")));

    it("should show a loading indicator", () => {
      expect(getLoadingForItem("2")).toBeInTheDocument();
    });

    describe("when loading finishes", () => {
      beforeEach(() => jest.runAllTimers());

      it("should show some items subitems for second", () => {
        expect(queryChildrenContainerForItem("2")).toBeInTheDocument();
      });
    });
  });

  //FOCUS
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

  describe("Focusing on a second item", () => {
    beforeEach(() => fireEvent.click(getFocusButtonForItem("2")));

    it("should show loading indicator", () => {
      expect(getLoadingForItem("2")).toBeInTheDocument();
    });

    describe("after items have been loaded", () => {
      beforeEach(() => jest.runAllTimers());
      it("should show some items", () => {
        expect(getAllRows().length).toBeGreaterThan(1);
      });
    });
  });

  //CHANGE SIDEBAR WIDTH AND VISIBILITY
  it("By default sidebar width is 300px", () => {
    expect(getSidebar()).toHaveStyle("width: 300px");
  });

  it("clicking on a change width indicator and dragging to 305px from left should set width to 305px", () => {
    fireEvent.mouseDown(getByClass(cls.sidebarWidthAdjuster));
    fireEvent.mouseMove(document, { clientX: 305 });
    fireEvent.mouseUp(document);
    expect(getSidebar()).toHaveStyle("width: 305px");
  });

  it("clicking on a sidebar adjuster should add appDuringDrag class to the app", () => {
    expect(getByClass(cls.app)).not.toHaveClass(cls.appDuringDrag);
    fireEvent.mouseDown(getByClass(cls.sidebarWidthAdjuster));
    expect(getByClass(cls.app)).toHaveClass(cls.appDuringDrag);
  });

  it("left sidebar left margin should be zero", () => {
    expect(getSidebar()).toHaveStyle("margin-left: 0px");
  });

  describe("when hiding left sidebar", () => {
    beforeEach(() => clickHideLeftSidebar());
    it("negative left margin should be set to its width (by default 300px)", () => {
      expect(getSidebar()).toHaveStyle("margin-left: -300px");
    });
  });

  //EDIT-REMOVE (via context menu)
});

//actions
const clickHideLeftSidebar = () => fireEvent.click(get(tIds.toggleSidebar));
//selectors
const getSidebar = () => getByClass(cls.leftSidebar);
const getChevronForItem = (itemId: string) => get("chevron-" + itemId);
const queryChevronForItem = (itemId: string) => query("chevron-" + itemId);
const getLoadingForItem = (itemId: string) => get("loading-" + itemId);
const queryChildrenContainerForItem = (itemId: string) =>
  query("children-" + itemId);
const queryRowForItem = (itemId: string) => query("row-" + itemId);
const getFocusButtonForItem = (itemId: string) => get("circle-" + itemId);
const getUnfocusButton = (itemId: string) => get("unfocus-" + itemId);
const queryUnfocusButton = (itemId: string) => query("unfocus-" + itemId);
const getRowForItem = (itemId: string) => get("row-" + itemId);
const getAllRows = () => getAll(/row-*/);

//infra
const get = (testId: string | RegExp) => screen.getByTestId(testId);
const query = (testId: string | RegExp) => screen.queryByTestId(testId);
const getAll = (testId: string | RegExp) => screen.getAllByTestId(testId);

const getByClass = (c: ClassName): HTMLElement =>
  document.querySelector("." + c) as HTMLElement;
