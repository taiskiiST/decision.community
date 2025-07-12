import type { DataNode } from 'antd/es/tree';

export type Entity = {
  id: number;
  parent_id: number | null;
  company_id: number;
  name: string;
  short_name: string;
  phone: string;
  thumb_url: string;
  loaded_children?: boolean;
  prepared?: boolean;
  children?: Entity[];
};

export type EntitiesTree = {
  [key: number]: Entity;
};

export interface EntityTreeNode extends DataNode {
  key: React.Key;
  entity: Entity;
}

export type EntitiesMap = Map<number, Entity>;

export type DetachEntityResult =
  | { id: number; detached: boolean; msg: string }[]
  | null;

export type User = {
  id: number;
  name: string;
  phone: string;
  address: string;
  email?: string;
};

export type DetachUserResult = {
  entityId: number;
  id: number;
  detached: boolean;
  msg: string;
} | null;
