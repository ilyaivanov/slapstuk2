import { utils } from "./infra";

const item = (id: string, prefix: string, children: string[] = []) => ({
  [id]: {
    id: id,
    title: `${id} ${prefix}`,
    children,
  },
});
const openItem = (id: string, prefix: string, children: string[] = []) => ({
  [id]: {
    id: id,
    isOpen: true,
    title: `${id} ${prefix}`,
    children,
  },
});

const initialItems: Items = {
  HOME: {
    id: "HOME",
    title: "Home",
    children: ["1", "2"],
  },
  1: {
    id: "1",
    title: "First",
    isOpen: true,
    children: utils.generateNumbers(30).map((n) => "1." + n),
  },
  2: {
    id: "2",
    title: "Second",
    children: [],
  },
  ...utils
    .generateNumbers(30)
    .map((n) => item("1." + n, "First"))
    .reduce((a, i) => ({ ...a, ...i }), {}),
  ...openItem("1.5", "First", ["1.5.1", "1.5.2"]),
  ...item("1.5.1", "First s"),
  ...item("1.5.2", "First s"),
};

export default initialItems;
