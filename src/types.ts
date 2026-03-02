export interface Punto {
    lat: number;
    lng: number;
}

export interface Parada extends Punto {
    nombre: string;
}

export interface Ruta {
    id: string;
    nombre: string;
    color: string;
    trayectoria: Punto[];
    paradas: Parada[];
}