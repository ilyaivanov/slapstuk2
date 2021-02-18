import React from "react";
import { cls, colors, css, tIds } from "../infra";
import { actions } from "../items";
import { ContextMenu } from "../items";

type ContextMenuProps = {
  options?: ContextMenu;
};

class ContextMenuView extends React.PureComponent<ContextMenuProps> {
  componentDidMount() {
    document.addEventListener("keyup", (e) => {
      if (this.props.options && e.key == "Escape")
        actions.assignUiState({
          contextMenu: undefined,
        });
    });
    document.addEventListener("click", (e) => {
      if (this.props.options)
        actions.assignUiState({
          contextMenu: undefined,
        });
    });
  }

  renderRow = (title: string, testId: string, onClick: () => void) => (
    <div onClick={onClick} data-testid={testId} className={cls.contextMenuRow}>
      {title}
    </div>
  );

  render() {
    const { options } = this.props;
    if (!options) return null;
    return (
      <div
        style={{ top: options.y + 10, left: options.x + 15 }}
        className={cls.contextMenu}
      >
        {this.renderRow("Edit", tIds.contextMenuRename, () =>
          actions.startRenameItem(options.itemId)
        )}
        {this.renderRow("Remove", tIds.contextMenuDelete, () =>
          actions.deleteItem(options.itemId)
        )}
      </div>
    );
  }
}

css.class(cls.contextMenu, {
  position: "fixed",
  backgroundColor: colors.menu,
  boxShadow: "2px 2px 4px 2px gray",
  borderRadius: 4,
  overflow: "hidden",
});
css.class(cls.contextMenuRow, {
  padding: "4px 7px",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
});
css.hover(cls.contextMenuRow, {
  backgroundColor: "gray",
});
export default ContextMenuView;
