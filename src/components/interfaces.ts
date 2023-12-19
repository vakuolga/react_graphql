import React from 'react';
import { Edge } from '../apollo/interfaces';
export interface LoginFormData {
  email: undefined | string;
  password: undefined | string;
}
export interface LoginFormProps {
  data: LoginFormData;
  setData: React.Dispatch<React.SetStateAction<LoginFormData>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}
export interface DraggableEdgeProps {
  edge: Edge;
  index: number;
  moveEdge: (from: number, to: number) => void;
}
export interface EdgesListProps {
  edges: Edge[];
  moveItem: (from: number, to: number) => void;
}
