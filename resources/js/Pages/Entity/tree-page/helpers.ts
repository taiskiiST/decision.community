import { EntitiesMap, Entity, EntityTreeNode } from 'types/types';
import { truncateText } from '../../../shared/helpers';

export const arrayToEntitiesMap = (entities: Entity[]): EntitiesMap => {
    const map = new Map<number, Entity>();

    const addToMap = (entity: Entity) => {
        map.set(entity.id, entity);

        if (entity.children?.length) {
            for (const child of entity.children) {
                addToMap(child); // recursively add children
            }
        }
    };

    for (const entity of entities) {
        addToMap(entity);
    }

    return map;
};

export const mapToTree = (
  entitiesMap: EntitiesMap
): EntityTreeNode[] => {
  const entityTreeNodes: EntityTreeNode[] = [];

  // Prepare map to hold the tree nodes
  const nodesMap = new Map<number, EntityTreeNode>();

  // First pass: wrap each Entity in an EntityTreeNode
  for (const entity of entitiesMap.values()) {
    nodesMap.set(entity.id, {
      key: entity.id,
      entity,
      title: entity.name, // required by AntD Tree
      children: [],
    });
  }

  // Second pass: link children to parents
  for (const node of nodesMap.values()) {
    const parentId = node.entity.parent_id;

    if (parentId !== null) {
      const parentNode = nodesMap.get(parentId);
      if (parentNode) {
        parentNode.children = parentNode.children || [];
        parentNode.children.push(node);
      }
    } else {
      // Top-level/root node
      entityTreeNodes.push(node);
    }
  }

  return entityTreeNodes;
};

export const prepareEntity = (item: Entity): Entity => {
    const { name, prepared } = item;

    if (prepared) {
        return item;
    }

    const shortName = truncateText(name);

    return {
        ...item,
        parent_id: item.parent_id ? Number(item.parent_id) : null,
        short_name: shortName,
        prepared: true,
    };
};

export const clickedInsideContextMenu = (nativeEvent: Event) => {
    const { target } = nativeEvent;

    if (target instanceof HTMLElement) {
        return (
            target.className !== 'ant-dropdown-trigger site-dropdown-context-menu'
        );
    }

    return false;
};

export const onTreeDragOver = ({ event, node }) => {
    const clientY = event.clientY;
    const pageY = event.pageY;

    // When reaching the top - scroll up.
    if (clientY < 250) {
        window.scrollBy({
            top: -50,
            behavior: 'smooth',
        });
    }

    // When reaching the bottom - scroll down.
    if (pageY > window.scrollY + window.innerHeight - 200) {
        window.scrollBy({
            top: 50,
            behavior: 'smooth',
        });
    }
};
