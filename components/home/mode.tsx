import {
    Combobox,
    Group,
    Input,
    InputBase,
    useCombobox,
} from "@mantine/core";

const dataItems = ["Por data", "Todos os posts"];

export default function ModeSelect({
    value,
    setValue,
}: {
    value: string | null;
    setValue: (val: string | null) => void;
}) {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: (eventSource) => {
            if (eventSource === "keyboard") {
                combobox.selectActiveOption();
            } else {
                combobox.updateSelectedOptionIndex("active");
            }
        },
    });

    // const [value, setValue] = useState<string | null>("Por data");

    const options = dataItems.map((item) => (
        <Combobox.Option value={item} key={item} active={item === value}>
            <Group gap="xs">
                {/* {item === value && <CheckIcon size={12} />} */}
                <span>{item}</span>
            </Group>
        </Combobox.Option>
    ));

    return (
        <Combobox
            store={combobox}
            resetSelectionOnOptionHover
            withinPortal={false}
            onOptionSubmit={(val) => {
                setValue(val);
                combobox.updateSelectedOptionIndex("active");
            }}
            classNames={{
                dropdown: `
                    w-38 shadow-lg !rounded-xl
                `,

                option: `
                    !rounded-xl
                    !hover:bg-neutral-200
                    cursor-pointer ![data-combobox-active="true"]:bg-neutral-700 ![data-combobox-active="true"]:text-white
                    !active:bg-neutral-700 !active:text-white
                    
                    !transition-all !duration-200 !ease-in-out
                `,
            }}
        >
            <Combobox.Target targetType="button">
                <InputBase
                    component="button"
                    type="button"
                    pointer
                    rightSection={<Combobox.Chevron />}
                    rightSectionPointerEvents="none"
                    onClick={() => combobox.toggleDropdown()}
                    classNames={{
                        wrapper: `
                            w-38 shadow-lg !rounded-xl
                        `,

                        input: `
                            bg-white border !border-neutral-300
                            !rounded-xl
                            w-38 
                        `,
                    }}
                >
                    {value || <Input.Placeholder>Pick value</Input.Placeholder>}
                </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>{options}</Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}
