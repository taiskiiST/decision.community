import Select from 'react-select';

const ChairmanPicker = ({ item, onChange, potentialChairmen }) => {
    if (! item) {
        return null;
    }

    const {id: itemId, currentChairman } = item;

    const options = potentialChairmen.map(member => ({
        value: member.id,
        label: member.name
    }));

    const value = options.find(option => {
        const { value: potentialChairmanId } = option;

        return currentChairman === potentialChairmanId;
    });
console.log('value,', value)
    const listId = `item_${itemId}_chairmen_list`;

    return (
        <div>
            <label htmlFor={listId} className="block text-base font-medium text-gray-700">Председатель</label>

            <Select
                id={listId}
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
