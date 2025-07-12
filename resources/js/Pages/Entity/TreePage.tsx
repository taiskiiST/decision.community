import React from 'react';
import ManageEntities from './tree-page/App';
import { Entity } from '../../types/types';

type TreeProps = {
  entities: Entity[];
};

export default function Tree({ entities }: TreeProps) {
  return <ManageEntities entities={entities} />;
}
