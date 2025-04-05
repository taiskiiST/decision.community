import React from 'react';
import ManageEntities from './ManageEntities/App';

export default function Tree({ entities }) {
  console.log('ents', entities);
  return (
    <>
      <a href="/entities/create">Create new entity</a>

      <ManageEntities entities={entities} />
    </>
  );
}
