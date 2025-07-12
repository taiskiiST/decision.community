import React, { useState } from 'react';
import { EventDataNode } from 'antd/es/tree';
import { router } from '@inertiajs/react';
import { EntitiesMap, EntityTreeNode, Entity } from 'types/types';
import { message } from 'antd';
import TreeWrapper from './TreeWrapper';
import { prepareEntity, mapToTree, clickedInsideContextMenu } from './helpers';
import { getEntityChildren, detachEntityFromCompany } from '../entities-requests';
import AddEntityModal from './AddEntityModal';
import UsersTable from './UsersTable';

type EntitiesTreeProps = {
  entities: Entity[];
};

const App: React.FC<EntitiesTreeProps> = ({ entities }) => {
  const [entitiesByKeys, setEntitiesByKeys] = useState<EntitiesMap>(
    entities.reduce((acc, entity) => {
      const preparedEntity = prepareEntity(entity);

      acc.set(preparedEntity.id, preparedEntity);

      return acc;
    }, new Map<number, Entity>()),
  );

  const [selectedEntityId, setSelectedEntityId] = useState<number | null>(null);
  const [isEntityModalOpen, setIsEntityModalOpen] = useState<boolean>(false);

  const treeData = mapToTree(entitiesByKeys);

  const onNewEntityBtnClick = async (parentId: number | null = null) => {
    if (parentId) {
      setSelectedEntityId(parentId);
    }

    setIsEntityModalOpen(true);
  };

  const removeEntitiesFromTree = async (entitiesIds: number[]) => {
    setEntitiesByKeys((currentEntitiesByKeys) => {
      const newEntitiesByKeys = new Map(currentEntitiesByKeys);

      entitiesIds.forEach((entityIdToDelete) => {
        // Unselect entity if it is the one being deleted.
        if (entityIdToDelete === selectedEntityId) {
          setSelectedEntityId(null);
        }

        newEntitiesByKeys.delete(entityIdToDelete);
      });

      return newEntitiesByKeys;
    });
  };

  const onDetachEntityBtnClick = async (entityId: number) => {
    const detachInfo = await detachEntityFromCompany(entityId);
    if (!Array.isArray(detachInfo)) {
      return;
    }

    const detachedEntitites = detachInfo.filter((e) => e.detached);
    const notDetachedEntities = detachInfo.filter((e) => !e.detached);

    if (detachedEntitites.length > 0) {
      message.success(
        `Сущность(и) отвязаны: ${detachedEntitites.map((d) => d.id)}`,
      );
    }

    if (notDetachedEntities) {
      notDetachedEntities.forEach((notDeleted) => {
        message.warning(notDeleted.msg);
      });
    }

    await removeEntitiesFromTree(detachedEntitites.map((e) => e.id));
  };

  const updateEntityParent = async (
    entityId: number,
    newParentId: number | null,
  ) => {
    router.put(
      `/entities-tree/${entityId}/update-parent`,
      {
        newParentId,
      },
      {
        onSuccess: () => {
          const newEntitiesByKeys = new Map(entitiesByKeys);

          newEntitiesByKeys.set(entityId, {
            ...entitiesByKeys.get(entityId)!,
            parent_id: newParentId,
          });

          setEntitiesByKeys(newEntitiesByKeys);
        },
      },
    );
  };

  const onDrop = async (origin: Entity, destination: Entity | undefined) => {
    await updateEntityParent(origin.id, destination ? destination.id : null);
  };

  const fetchEntitiessChildrenIfNotYet = async (key: number) => {
    const entity = entitiesByKeys.get(key);
    if (!entity) {
      return;
    }

    const { loaded_children: loadedChildren } = entity;

    if (loadedChildren) {
      return;
    }

    const children = await getEntityChildren(key);

    if (!Array.isArray(children)) {
      return;
    }

    const newEntitiesByKeys = new Map(entitiesByKeys);

    newEntitiesByKeys.set(key, {
      ...entity,
      loaded_children: true,
    });

    children.forEach((entityFromServer: Entity) => {
      const preparedEntity = prepareEntity(entityFromServer);

      const { id } = preparedEntity;

      newEntitiesByKeys.set(id, preparedEntity);
    });

    setEntitiesByKeys(newEntitiesByKeys);
  };

  const onLoadData = async (treeNode: EntityTreeNode) => {
    return new Promise<void>(async (resolve) => {
      await fetchEntitiessChildrenIfNotYet(treeNode.entity.id);

      resolve();
    });
  };

  const onSelect = async (
    selectedKeys: React.Key[],
    e: {
      event: 'select';
      selected: boolean;
      node: EventDataNode<EntityTreeNode>;
      selectedNodes: EntityTreeNode[];
      nativeEvent: MouseEvent;
    },
  ): Promise<void> => {
    const { selected, node, nativeEvent } = e;

    // Do not react if the event was triggered by clicking on
    // something inside the context menu.
    if (clickedInsideContextMenu(nativeEvent)) {
      return;
    }

    if (!selected) {
      setSelectedEntityId(null);

      return;
    }

    const { loaded, key } = node;
    const id = Number(key);

    if (!loaded) {
      await fetchEntitiessChildrenIfNotYet(id);
    }

    setSelectedEntityId(id);
  };

  const onEntityAdded = async (newEntity: Entity) => {
    await addEntityToTree(newEntity);

    message.success(`Новая сущность '${newEntity.name}' добавлена!`);

    setIsEntityModalOpen(false);
  };

  const addEntityToTree = async (entityFromServer: Entity) => {
    const preparedEntity = prepareEntity(entityFromServer);

    setEntitiesByKeys((currentEntitiesByKeys) => {
      const newEntitiesByKeys = new Map(currentEntitiesByKeys);

      newEntitiesByKeys.set(preparedEntity.id, preparedEntity);

      return newEntitiesByKeys;
    });
  };

  return (
    <div className="p-2 min-h-2xl lg:flex xl:flex 2xl:flex">
      <AddEntityModal
        parentId={selectedEntityId}
        onEntityAdded={onEntityAdded}
        onCancel={() => setIsEntityModalOpen(false)}
        open={isEntityModalOpen}
      />
      {/* Tree */}
      <div className="w-full p-1 min-w-72 md:w-72">
        <div className="mb-2">
          <button
            type="button"
            className="inline-flex items-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            id="add-new-category-button"
            onClick={(e) => onNewEntityBtnClick()}
          >
            <svg
              className="block w-5 h-5 mr-2 -ml-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Новая сущность
          </button>
        </div>

        <TreeWrapper
          onDrop={onDrop}
          treeData={treeData}
          onLoadData={onLoadData}
          onSelect={onSelect}
          selectedKeys={selectedEntityId ? [selectedEntityId] : []}
          onDragOver={() => {}}
          loading={false}
          onNewEntityBtnClick={onNewEntityBtnClick}
          onDetachEntityBtnClick={onDetachEntityBtnClick}
        />
      </div>

      {/* Table */}
      {selectedEntityId && (
        <div className="min-h-full p-1 overflow-hidden md:flex-grow">
          <div className="md:block">
            <UsersTable entityId={selectedEntityId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
