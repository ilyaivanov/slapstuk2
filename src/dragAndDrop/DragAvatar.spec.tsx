import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import Gallery from "../gallery/Gallery";
import LeftSidebar from "../sidebars/LeftSidebar";
import * as items from "../state";
import DragAvatar from "./DragAvatar";

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

const RenderTestSidebarGallery = ({
  initialState,
}: {
  initialState: items.RootState;
}) => {
  const [state, dispatch] = React.useReducer(items.reducer, initialState);
  items.setGlobalDispatch(dispatch);
  return (
    <>
      <LeftSidebar state={state} onResize={jest.fn()} />
      <DragAvatar state={state} />
      <Gallery
        allItems={state.items}
        nodeSelected="HOME"
        itemBeingPlayed={undefined}
        dragState={state.dragState}
      />
    </>
  );
};

describe("Sidebar", () => {
  beforeEach(() => {
    render(
      <RenderTestSidebarGallery
        initialState={{
          ...items.initialState,
          items: initialItems,
        }}
      />
    );
  });
  it("by default should not have drag avatar", () => {
    expect(query("drag-avatar")).not.toBeInTheDocument();
  });

  describe("clicking on a row and moving it for 6px away", () => {
    beforeEach(() => {
      fireEvent.mouseDown(getRowForItem("1"), {
        clientX: 0,
        clientY: 0,
      });
      fireEvent.mouseMove(document, {
        clientX: 6,
        clientY: 0,
      });
    });

    it("should NOT create a drag avatar under the mouse cursor", () => {
      expect(query("drag-avatar")).not.toBeInTheDocument();
    });

    describe("moving it for 1px more pixel", () => {
      beforeEach(() => {
        fireEvent.mouseMove(document, {
          clientX: 0,
          clientY: 7,
        });
      });

      it("should create a drag avatar under the mouse cursor", () => {
        const avatar = query("drag-avatar");
        expect(avatar).toBeInTheDocument();
        expect(avatar).toHaveStyle("left: -9px");
        expect(avatar).toHaveStyle("top: -2px");
      });

      it("on mouse up avatar should be removed", () => {
        fireEvent.mouseUp(document);
        expect(query("drag-avatar")).not.toBeInTheDocument();
      });

      it("moving mouse further should update drag avatar", () => {
        fireEvent.mouseMove(document, {
          clientX: 100,
          clientY: 100,
        });
        const avatar = query("drag-avatar");
        expect(avatar).toHaveStyle("left: 91px");
        expect(avatar).toHaveStyle("top: 91px");
      });

      it("drag destination should not be in the document", () => {
        expect(query("drag-destination")).not.toBeInTheDocument();
      });

      describe("having a target rect of height 20 at y coordinate 50", () => {
        const target = {
          getBoundingClientRect: (): DOMRect =>
            ({
              top: 50,
              height: 20,
              bottom: 70,
            } as DOMRect),
        };
        it("mouse position at 59 should draw line at 49px (top - destination height)", () => {
          fireEvent.mouseMove(getRowForItem("2"), {
            clientX: 0,
            clientY: 59,
            target,
          });
          expect(query("drag-destination")).toHaveStyle("top: 48px");
        });

        it("mouse position at 60 should draw line at 69px (bottom - destination height)", () => {
          fireEvent.mouseMove(getRowForItem("2"), {
            clientX: 0,
            clientY: 60,
            target,
          });
          expect(query("drag-destination")).toHaveStyle("top: 68px");
        });

        it("on mouse up should remove drag destination", () => {
          fireEvent.mouseMove(getRowForItem("2"), {
            clientX: 0,
            clientY: 60,
            target,
          });
          fireEvent.mouseUp(document);
          expect(query("drag-destination")).not.toBeInTheDocument();
        });
      });
    });
  });
});

describe("Having two items nested", () => {
  let initialItems: Items = {
    HOME: {
      type: "folder",
      children: ["1"],
      id: "HOME",
      title: "Home",
    },
    "1": {
      type: "folder",
      children: ["2"],
      id: "1",
      title: "First",
      isOpenFromSidebar: true,
    },
    "2": {
      type: "folder",
      children: [],
      id: "2",
      title: "Second",
    },
  };
  beforeEach(() => {
    render(
      <RenderTestSidebarGallery
        initialState={{
          ...items.initialState,
          items: initialItems,
        }}
      />
    );
  });
  it("when dragging parent after child it should show an error and do no nothing to items on mouse up", () => {
    fireEvent.mouseDown(getRowForItem("1"));
    fireEvent.mouseMove(document, {
      clientX: 100,
      clientY: 100,
    });
    fireEvent.mouseMove(getRowForItem("2"), {
      clientX: 100,
      clientY: 100,
      target: {
        getBoundingClientRect: (): Partial<DOMRect> => ({
          top: 100,
          height: 20,
        }),
      },
    });
    expect(
      screen.getByTestId("drag-destination-info").firstChild
    ).toContainHTML("Can't");
    fireEvent.mouseUp(document);
    expect(getRowForItem("1")).toBeInTheDocument();
    expect(getRowForItem("2")).toBeInTheDocument();
  });

  it("moving 1 before 1 should do nothing ", () => {
    fireEvent.mouseDown(getRowForItem("1"));
    fireEvent.mouseMove(document, {
      clientX: 100,
      clientY: 100,
    });
    fireEvent.mouseMove(getRowForItem("1"), {
      clientX: 100,
      clientY: 100,
      target: {
        getBoundingClientRect: (): Partial<DOMRect> => ({
          top: 100,
          height: 20,
        }),
      },
    });
    fireEvent.mouseUp(document);
    expect(getRowForItem("1")).toBeInTheDocument();
    expect(getRowForItem("2")).toBeInTheDocument();
  });
});

const getRowForItem = (itemId: string) => get("row-" + itemId);
const get = (testId: string | RegExp) => screen.getByTestId(testId);
const query = (testId: string | RegExp) => screen.queryByTestId(testId);
