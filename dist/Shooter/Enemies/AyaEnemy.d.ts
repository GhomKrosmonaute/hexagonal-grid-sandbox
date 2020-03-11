import Enemy from '../Enemy';
import App from '../App';
import Shoot from "../Shoot";
export default class AyaEnemy extends Enemy {
    immune: boolean;
    damage: number;
    speed: number;
    gain: number;
    life: number;
    id: string;
    constructor(app: App);
    pattern(): void;
    onPlayerContact(): void;
    onShoot(shoot: Shoot): boolean;
    onDraw(): void;
    readonly currentRadius: number;
}
