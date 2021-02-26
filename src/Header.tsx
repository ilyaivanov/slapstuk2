import { useState } from "react";
import { logout } from "./api/firebase";
import { tIds } from "./infra";
import { actions, UIOptions, UserInfo } from "./state";

interface Props {
  uiOptions: UIOptions;
  searchNode: SearchContainer;
  onSaveState: () => void;
  user?: UserInfo;
}

const Header = ({ uiOptions, searchNode, user, onSaveState }: Props) => {
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

      <button onClick={onSaveState}>save</button>

      <button
        style={{ marginLeft: "auto" }}
        onClick={() => {
          actions.assignUiOptions({
            galleryMode: uiOptions.galleryMode == "list" ? "gallery" : "list",
          });
        }}
      >
        {uiOptions.galleryMode == "list"
          ? "Switch to Gallery"
          : "Switch to List"}
      </button>
      <div style={{ position: "absolute", right: 0 }}>
        <span>{user?.username}</span>
        <button onClick={() => logout()}>logout</button>
      </div>
    </div>
  );
};
export default Header;
