import React from "react";
import { Dropdown } from "@nextui-org/react";
import { useEffect } from "react";

export default function DropdownTS(props) {
  const [menuItems, setMenuItems] = React.useState();

  useEffect(() => {
    let newItems = [];
    props.items.forEach((i) => newItems.push({ key: i, name: i }));
    setMenuItems(newItems);
  }, [props.items]);

  const [selected, setSelected] = React.useState(new Set([props.defaultValue]));

  const selectedValue = React.useMemo(
    () => Array.from(selected).join(", ").replaceAll("_", " "),
    [selected]
  );

  useEffect(() => {
    props.onChange(selectedValue);
  }, [selected]);

  return (
    <Dropdown>
      <Dropdown.Button css={{ margin: "10px" }} flat>
        {selectedValue}
      </Dropdown.Button>
      <Dropdown.Menu
        selectionMode="single"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        aria-label="Dynamic Actions"
        items={menuItems}
      >
        {(item) => (
          <Dropdown.Item
            key={item.key}
            color={item.key === "delete" ? "error" : "default"}
          >
            {item.name}
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
