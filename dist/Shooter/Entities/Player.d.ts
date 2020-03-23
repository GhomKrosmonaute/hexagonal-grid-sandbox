import Positionable from './Positionable';
import Shot from './Shot';
import { Consumable, Passive, ShapeFunction, TemporaryEffects } from '../../interfaces';
import Rate from './Rate';
import Party from './Scenes/Party';
import App from '../App';
import API from '../API';
export default class Player extends Positionable {
    party: Party;
    baseLife: number;
    life: number;
    score: number;
    baseSpeedMax: number;
    baseShotSpeed: number;
    baseShotRange: number;
    baseShotDamage: number;
    baseFireRate: number;
    baseShotSize: number;
    speedX: number;
    speedY: number;
    acc: number;
    desc: number;
    consumables: Consumable[];
    passives: Passive[];
    shots: Shot[];
    temporary: TemporaryEffects;
    shootRating: Rate;
    highScore: number;
    app: App;
    api: API;
    private combo;
    private comboTimeout;
    private comboStateSize;
    private comboMaxMultiplicator;
    private killed;
    private immune;
    private immuneTime;
    constructor(party: Party);
    getHighScore(): Promise<number>;
    setHighScore(score: number): Promise<any>;
    readonly speedMax: number;
    readonly shotSpeed: number;
    readonly shotRange: number;
    readonly shotDamage: number;
    readonly shotSize: number;
    readonly fireRate: number;
    setTemporary(flag: string, duration: number, shape: ShapeFunction): void;
    getTemporary(flag: string): boolean;
    addPassive(passive: Passive): void;
    removePassive(id: string): void;
    getPassive(id: string): Passive | null;
    addConsumable(consumable: Consumable): void;
    addScore(score: number): void;
    inflictDamages(damages: number): void;
    step(): Promise<void>;
    draw(): void;
    keyPressed(key: string): void;
}
