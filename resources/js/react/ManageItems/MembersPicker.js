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
  chairmanPickerLabel,
}) => {
  if (!item) {
    return null;
  }

  const { elementary } = item;

  return (
    <div className="flex items-center justify-between">
      {!elementary ? (
        <React.Fragment>
          <div className="flex-1 p-4">
            <CommitteeList
              committeeListId={committeeListId}
              item={item}
              onChange={onCommitteeListChange}
              potentialMembers={potentialCommitteeMembers}
              currentMembers={currentCommitteeMembers}
              committeePickerLabel={committeePickerLabel}
            />
          </div>

          <div className="flex-1 p-4">
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
      ) : null}

      <div className="flex-1 p-4">
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
