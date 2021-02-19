import { useState } from "react";
import { tIds } from "./infra";
import { actions, UIOptions } from "./state";

interface Props {
  uiOptions: UIOptions;
  searchNode: SearchContainer;
}

const Header = ({ uiOptions, searchNode }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div>
      <button
        data-testid={tIds.toggleSidebar}
        onClick={() =>
          actions.assignUiOptions({
            isLeftSidebarVisible: !uiOptions.isLeftSidebarVisible,
          })
        }
      >
        left
      </button>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
      />
      <button
        onClick={() =>
          actions.searchForItems({
            ...searchNode,
            id: "SEARCH",
            nextPageToken: undefined,
            searchTerm: searchTerm,
            isLoading: true,
            children: [],
          })
        }
      >
        search
      </button>
    </div>
  );
};
export default Header;
