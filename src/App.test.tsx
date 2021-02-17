import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import { cls } from "./infra";

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

describe("Having some items on the app", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    render(<App />);
  });

  it("show have three rows", () => {
    expect(getAllRows()).toHaveLength(3);
  });

  it("First item is closed", () => {
    expect(queryChildrenContainerForItem("1")).not.toBeInTheDocument();
    expect(getChevronForItem("1")).not.toHaveClass(cls.rotated);
  });

  it("Home node should NOT have an unfocus button", () => {
    expect(queryUnfocusButton("HOME")).not.toBeInTheDocument();
  });

  //EXPAND/COLLAPSE
  describe("clicking on an item with loaded subitems", () => {
    beforeEach(() => fireEvent.click(getRowForItem("1")));
    it("opens its children", () => {
      expect(getChevronForItem("1")).toHaveClass(cls.rotated);
      const firstSubRow = queryRowForItem("1.1");
      expect(firstSubRow).toBeInTheDocument();
      expect(firstSubRow).toHaveStyle("padding-left: 40px");
    });

    describe("clicking on it again", () => {
      beforeEach(() => fireEvent.click(getRowForItem("1")));
      it("hides its children", () => {
        expect(getChevronForItem("1")).not.toHaveClass(cls.rotated);
        expect(queryRowForItem("1.1")).not.toBeInTheDocument();
      });
    });
  });

  //LOADING
  describe("clicking on an item that requires loading", () => {
    beforeEach(() => fireEvent.click(screen.getByText("Second")));

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

    describe("clicking back on 1 row", () => {
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
});

const getChevronForItem = (itemId: string) => get("chevron-" + itemId);
const getLoadingForItem = (itemId: string) => get("loading-" + itemId);
const queryChildrenContainerForItem = (itemId: string) =>
  query("children-" + itemId);
const queryRowForItem = (itemId: string) => query("row-" + itemId);
const getFocusButtonForItem = (itemId: string) => get("focus-" + itemId);
const getUnfocusButton = (itemId: string) => get("unfocus-" + itemId);
const queryUnfocusButton = (itemId: string) => query("unfocus-" + itemId);
const getRowForItem = (itemId: string) => get("row-" + itemId);
const getAllRows = () => getAll(/row-*/);

const get = (testId: string | RegExp) => screen.getByTestId(testId);
const query = (testId: string | RegExp) => screen.queryByTestId(testId);
const getAll = (testId: string | RegExp) => screen.getAllByTestId(testId);
