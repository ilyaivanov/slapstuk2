import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import { Styles } from "./infra/style";
import { cls, anim as fakeAnim } from "./infra";

jest.useFakeTimers();

jest.mock("./infra/animations", () => ({
  animate: (
    element: HTMLElement,
    keyframes: Styles[],
    options: KeyframeAnimationOptions
  ) => {
    return {
      id: options.id,
      reverse: jest.fn(),
      addEventListener: (type: string, callback: any) => {
        //emulates calling callback on next tick\
        setTimeout(callback, 0);
      },
    };
  },
  getAnimations: jest.fn(),
}));
(fakeAnim.getAnimations as jest.Mock).mockReturnValue([]);
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
it("show have two rows at the root", async () => {
  render(<App />);
  const firstRow = screen.getByText("First");
  const firstSubRow = await screen.queryByText("First sub");
  const secondRow = screen.getByText("Second");
  expect(firstSubRow).not.toBeInTheDocument();
  expect(secondRow).toBeInTheDocument();
});

xit("clicking on an item should open it and show children", async () => {
  render(<App />);
  const firstRow = screen.getByText("First");
  const chevron = firstRow.getElementsByClassName(cls.rowChevron)[0];
  expect(chevron).not.toHaveClass(cls.rotated);
  fireEvent.click(firstRow);
  expect(chevron).toHaveClass(cls.rotated);
  const firstSubRow = await screen.queryByText("First sub");
  expect(firstSubRow).toBeInTheDocument();
  expect(firstSubRow).toHaveStyle("padding-left: 40px");
});
