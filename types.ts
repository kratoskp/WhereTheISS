export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationProperties {
  city?: string;
  country?: string;
  name?: string;
  state?: string;
}

export interface LocationFeature {
  properties: LocationProperties;
}

export interface WeatherCondition {
  description: string;
}

export interface IssPosition extends Coordinates {
  altitude?: number;
  timestamp: number;
  velocity?: number;
}

export interface IssRecord extends IssPosition {
  current: { weather: WeatherCondition[] };
  features: LocationFeature[];
}

export interface MapModalProps {
  data: IssRecord[];
  onClose: () => void;
  visible: boolean;
}

export interface DateTimePickerModalProps {
  date: Date;
  isVisible: boolean;
  maximumDate?: Date;
  onCancel: () => void;
  onConfirm: (date: Date) => void;
}