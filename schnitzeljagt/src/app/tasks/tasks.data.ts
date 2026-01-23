import { Task } from '../models/task.model';

export const TASKS: Task[] = [
    {
        id: '1',
        title: 'Finde den Standort',
        description: 'Begib dich zum vorgegebenen Koordinaten. GPS-Genauigkeit: 20 Meter Umkreis.',
        type: 'geolocation',
    },
    {
        id: '2',
        title: 'Gehe eine bestimmte Distanz',
        description: 'Bewege dich mindestens 20 Meter.',
        type: 'distance',
    },
    {
        id: '3',
        title: 'Gerät auf den Kopf',
        description: 'Drehe dein Gerät auf den Kopf für 3 Sekunden',
        type: 'sensor',
    },
    {
        id: '4',
        title: 'Scanne den QR-Code',
        description: 'Finde und scanne den versteckten QR-Code um fortzufahren.',
        type: 'qr',
    },
    {
        id: '6',
        title: 'WLAN Verbindungsaufgabe',
        description: 'Verbinde dich mit einem WLAN-Netzwerk und trenne die Verbindung wieder.',
        type: 'wifi',
    },
    {
        id: '5',
        title: 'Gerät aufladen',
        description: 'Verbinde dein Gerät mit dem Strom oder einem Ladekabel.',
        type: 'power',
    }
];
