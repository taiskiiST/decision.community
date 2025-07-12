import React from 'react';
import ManageEntities from './tree-page/App';
import { Entity } from '../../types/types';
import 'dayjs/locale/ru'; // load on demand
import dayjs from 'dayjs';

type TreeProps = {
  entities: Entity[];
};

export default function Tree({ entities }: TreeProps) {
  dayjs.locale('ru');

  return <ManageEntities entities={entities} />;
}
