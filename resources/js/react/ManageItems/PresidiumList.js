import Select from 'react-select';

const PresidiumList = ({ item, onChange, potentialMembers }) => {
    if (! item) {
        return null;
    }

    const {id: itemId, currentPresidiumMembers } = item;

    const options = potentialMembers.map(member => ({
        value: member.id,
        label: member.name
    }));

    const value = options.filter(option => {
        const { value: potentialMemberId } = option;

        return currentPresidiumMembers.find(currentMemberId => currentMemberId === potentialMemberId);
    });

    const listId = `item_${itemId}_presidium_list`;

    return (
        <div>
            <label htmlFor={listId} className="block text-base font-medium text-gray-700">Президиум</label>

            <Select
                id={listId}
                hideSelectedOptions={false}
                closeMenuOnSelect={false}
                isMulti
                value={value}
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

export default PresidiumList;
