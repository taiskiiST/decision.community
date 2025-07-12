import React from 'react';
import { Dropdown, Menu, Popconfirm, Tree } from 'antd';
import { DeleteOutlined, FolderAddOutlined } from '@ant-design/icons';
import { BallTriangle } from '@/shared/components/spinners/BallTriangle';
import { EntityTreeNode, Entity } from 'types/types';
import { EventDataNode } from 'antd/es/tree';
import { NodeDragEventParams } from 'rc-tree/es/contextTypes';

type TreeWrapperProps = {
  treeData: EntityTreeNode[];
  onDrop: (origin: Entity, destination: Entity | undefined) => void;
  onLoadData: (treeNode: EntityTreeNode) => Promise<void>;
  onSelect: (
    selectedKeys: React.Key[],
    e: {
      event: 'select';
      selected: boolean;
      node: EventDataNode<EntityTreeNode>;
      selectedNodes: EntityTreeNode[];
      nativeEvent: MouseEvent;
    },
  ) => void;
    selectedKeys: React.Key[];
    onDragOver: ((info: NodeDragEventParams<EntityTreeNode>) => void);
    loading: boolean;
    onNewEntityBtnClick: (parentId?: number | null) => Promise<void>;
    onDetachEntityBtnClick: (entityId: number) => Promise<void>;
};

const TreeWrapper = ({
  onDrop,
  treeData,
  onLoadData,
  onSelect,
  selectedKeys,
  onDragOver,
  loading,
  onNewEntityBtnClick,
  onDetachEntityBtnClick,
}: TreeWrapperProps) => {

  if (loading) {
    return (
      <div className="flex justify-center mt-4">
        <BallTriangle className="h-16" />
      </div>
    );
  }

  const prepareEntityTitle = (entityId: number, shortName: string) => {
    const menu = (
      <Menu>
        <Menu.Item key="addNewEntity">
          <button
            type="button"
            className="focus:outline-none"
            onClick={() => onNewEntityBtnClick(entityId)}
          >
            <div className="flex items-center justify-between">
              <FolderAddOutlined
                style={{
                  color: '#48bb78',
                }}
              />

              <span className="ml-2">Новая сущность</span>
            </div>
          </button>
        </Menu.Item>

        <Menu.Item key="detachEntity">
          <Popconfirm
            title={`Отвязать '${shortName}'?`}
            onConfirm={() => onDetachEntityBtnClick(entityId)}
            okText="Да"
            cancelText="Нет"
            placement="bottomRight"
          >
            <button
              type="button"
              className="focus:outline-none"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <div className="flex items-center justify-between">
                <DeleteOutlined
                  style={{
                    color: '#ef4444',
                  }}
                />

                <span className="ml-2">Отвязать</span>
              </div>
            </button>
          </Popconfirm>
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu} trigger={['contextMenu']}>
        <div className="site-dropdown-context-menu">{shortName}</div>
      </Dropdown>
    );
  };

  return (
    <Tree
      className="draggable-tree"
      draggable
      blockNode
      onDrop={(info) => onDrop(info.dragNode.entity, info.dropToGap ? undefined : info.node.entity)}
      treeData={treeData}
      loadData={onLoadData}
      allowDrop={() => true}
      showLine={{ showLeafIcon: false }}
      showIcon={false}
      onSelect={onSelect}
      selectedKeys={selectedKeys}
      onDragOver={onDragOver}
      titleRender={(nodeData: EntityTreeNode) => {
        const { entity } = nodeData;

        return prepareEntityTitle(entity.id, entity.short_name);
      }}
    />
  );
};

export default TreeWrapper;
