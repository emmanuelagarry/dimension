interface Data2 {
  numericValue: number;
  rawValue: string;
}

interface Node {
  id: string;
  timestamp: string;
  createdAt: string;
  type: string;
  unit: string;
  pointId: string;
  data: Data2;
}

interface Edge {
  node: Node;
}

interface Signals {
  edges: Edge[];
}

interface Data {
  signals: Signals;
}

export interface LastTenModel {
  data: Data;
}
