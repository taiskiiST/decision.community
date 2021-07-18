import Select from 'react-select';

const CommitteeList = ({ item, onChange, potentialMembers }) => {
    if (! item) {
        return null;
    }

    const {id: itemId, currentCommitteeMembers } = item;

    const options = potentialMembers.map(member => ({
        value: member.id,
        label: member.name
    }));

    const value = options.filter(option => {
        const { value: potentialMemberId } = option;

        return currentCommitteeMembers.find(currentMemberId => currentMemberId === potentialMemberId);
    });

    const listId = `item_${itemId}_committee_list`;

    return (
        <div>
            <label htmlFor={listId} className="block text-base font-medium text-gray-700">Комитет</label>

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

export default CommitteeList;
