import Select from 'react-select';

const CommitteeList = ({
    item,
    onChange,
    potentialMembers,
    currentMembers,
    committeeListId,
    committeePickerLabel
}) => {
    if (! item) {
        return null;
    }

    const options = potentialMembers.map(member => ({
        value: member.id,
        label: member.name
    }));

    const value = options.filter(option => {
        const { value: potentialMemberId } = option;

        return currentMembers.find(currentMemberId => currentMemberId === potentialMemberId);
    });

    return (
        <div>
            <label htmlFor={committeeListId} className="block text-base font-medium text-gray-700">{committeePickerLabel}</label>

            <Select
                id={committeeListId}
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
