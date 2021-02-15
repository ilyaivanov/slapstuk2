import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText("Home");
  expect(linkElement).toBeInTheDocument();
  Math.random = () => 666;
  fireEvent.click(linkElement);
  expect(linkElement).toHaveTextContent("666");
});
