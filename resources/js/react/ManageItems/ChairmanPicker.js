import Select from 'react-select';

const ChairmanPicker = ({
    item,
    onChange,
    potentialChairmen,
    currentChairman,
    chairmenListId,
    chairmanPickerLabel
}) => {
    if (! item) {
        return null;
    }

    const options = potentialChairmen.map(member => ({
        value: member.id,
        label: member.name
    }));

    const value = options.find(option => {
        const { value: potentialChairmanId } = option;

        return currentChairman === potentialChairmanId;
    });

    return (
        <div>
            <label htmlFor={chairmenListId} className="block text-base font-medium text-gray-700">{chairmanPickerLabel}</label>

            <Select
                id={chairmenListId}
                hideSelectedOptions={false}
                closeMenuOnSelect={false}
                value={value ?? null}
                options={options}
                onChange={(selectedMembers) => onChange(item, selectedMembers)}
                pageSize={10}
                isSearchable
                minMenuHeight={1}
                maxHeightnumber={1}
                size={1}
                placeholder="Выбрать..."
            />
        </div>

    )
}

export default ChairmanPicker;
