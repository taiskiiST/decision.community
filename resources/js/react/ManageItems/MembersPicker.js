import React from 'react';
import CommitteeList from './CommitteeList';
import PresidiumList from './PresidiumList';
import ChairmanPicker from './ChairmanPicker';

const MembersPicker = ({
    item,
    onCommitteeListChange,
    onPresidiumListChange,
    onChairmanChange,
    potentialCommitteeMembers,
    potentialPresidiumMembers,
    potentialChairmen,

    currentCommitteeMembers,
    committeeListId,
    committeePickerLabel,

    currentPresidiumMembers,
    presidiumListId,
    presidiumPickerLabel,

    currentChairman,
    chairmenListId,
    chairmanPickerLabel
}) => {
    if (! item) {
        return null;
    }

    const { elementary } = item;

    return (
        <div className="flex justify-between items-center">
            {
                ! elementary ? (
                    <React.Fragment>
                        <div className="p-4 flex-1">
                            <CommitteeList
                                committeeListId={committeeListId}
                                item={item}
                                onChange={onCommitteeListChange}
                                potentialMembers={potentialCommitteeMembers}
                                currentMembers={currentCommitteeMembers}
                                committeePickerLabel={committeePickerLabel}
                            />
                        </div>

                        <div className="p-4 flex-1">
                            <PresidiumList
                                presidiumListId={presidiumListId}
                                item={item}
                                onChange={onPresidiumListChange}
                                potentialMembers={potentialPresidiumMembers}
                                currentMembers={currentPresidiumMembers}
                                presidiumPickerLabel={presidiumPickerLabel}
                            />
                        </div>
                    </React.Fragment>
                ) : null
            }

            <div className="p-4 flex-1">
                <ChairmanPicker
                    item={item}
                    onChange={onChairmanChange}
                    potentialChairmen={potentialChairmen}
                    currentChairman={currentChairman}
                    chairmenListId={chairmenListId}
                    chairmanPickerLabel={chairmanPickerLabel}
                />
            </div>
        </div>
    );
};

export default MembersPicker;
