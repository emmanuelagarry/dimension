export interface Data2 {
  numericValue: number;
  rawValue: string;
}

export interface Create {
  id: string;
  pointId: string;
  type: string;
  data: Data2;
}

export interface Signal {
  create: Create[];
}

export interface Data {
  signal: Signal;
}

export interface SignalResult {
  data: Data;
}


