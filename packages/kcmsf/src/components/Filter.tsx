import {
  ActionIcon,
  CheckIcon,
  Combobox,
  ComboboxItem,
  Flex,
  useCombobox,
  useMantineTheme,
} from "@mantine/core";
import { IconFilterFilled } from "@tabler/icons-react";

export const Filter = ({
  active,
  label,
  data,
  value,
  onFilter,
  ...props
}: {
  active: boolean;
  label: string;
  data: ComboboxItem[];
  value?: string;
  onFilter: (value?: string) => void;
} & Parameters<typeof IconFilterFilled>[0]) => {
  const theme = useMantineTheme();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const options = data.map((item) => (
    <Combobox.Option
      value={item.value}
      key={item.value}
      active={item.value == value}
      onMouseOver={(ref) =>
        ref.currentTarget.animate(
          [
            {
              background:
                item.value == value
                  ? theme.colors.blue[0]
                  : theme.colors.gray[2],
            },
          ],
          {
            fill: "forwards",
            duration: 100,
          }
        )
      }
      onClick={(ref) => {
        ref.currentTarget.animate(
          [
            {
              background:
                item.value != value
                  ? theme.colors.blue[0]
                  : theme.colors.gray[2],
            },
          ],
          {
            fill: "forwards",
            duration: 0,
          }
        );
      }}
      onMouseLeave={(ref) =>
        ref.currentTarget.getAnimations().map((a) => a.cancel())
      }
    >
      <Flex direction="row" align="center" gap={5} pr={48}>
        <CheckIcon
          color={item.value == value ? theme.colors.blue[6] : "transparent"}
          size={12}
        />
        <span
          style={{
            whiteSpace: "nowrap",
            fontWeight: "normal",
            color: item.value == value ? theme.colors.blue[6] : theme.black,
          }}
        >
          {item.label}
        </span>
      </Flex>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      resetSelectionOnOptionHover
      withinPortal={false}
      onOptionSubmit={(val) => {
        const nextValue = val == value ? undefined : val;
        onFilter(nextValue);
        combobox.updateSelectedOptionIndex("active");
      }}
      width="auto"
      shadow="sm"
    >
      <Combobox.Target targetType="button">
        <ActionIcon
          variant="subtle"
          color={active ? theme.colors.blue[6] : theme.colors.gray[6]}
          onClick={() => combobox.toggleDropdown()}
        >
          <IconFilterFilled {...props} />
        </ActionIcon>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
