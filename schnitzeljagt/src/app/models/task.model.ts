export type TaskType = 
    | 'geolocation'
    | 'qr'
    | 'distance'
    | 'sensor'
    | 'power'
    | 'wifi';

export interface Task {
    id: string;
    title: string;
    description: string;
    type: TaskType;
}