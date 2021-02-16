type valueof<T> = T[keyof T];

type Item = {
  id: string;
  title: string;
  children: string[];
  isOpen?: boolean;
};
type Items = { [id: string]: Item };
