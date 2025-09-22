import Application from '../Application';
import Resources from '../Utils/Resources';
import ComputerSetup from './Computer';
import MonitorScreen from './MonitorScreen';
import Environment from './Environment';
import Cursor from './Cursor';
import Hitboxes from './Hitboxes';
import AudioManager from '../Audio/AudioManager';
// Import new furniture classes
import Background from './Background';
import Chair from './Chair';
import Lamp from './Lamp';
import Table from './Table';

export default class World {
    application: Application;
    scene: THREE.Scene;
    resources: Resources;

    environment: Environment;
    computerSetup: ComputerSetup;
    monitorScreen: MonitorScreen;
    cursor: Cursor;
    audioManager: AudioManager;
    // Add new furniture properties
    background: Background;
    chair: Chair;
    lamp: Lamp;
    table: Table;

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;
        
        this.resources.on('ready', () => {
            this.environment = new Environment();
            this.computerSetup = new ComputerSetup();
            this.monitorScreen = new MonitorScreen();
            this.audioManager = new AudioManager();
            
            // Initialize new furniture objects
            this.background = new Background();
            this.chair = new Chair();
            this.lamp = new Lamp();
            this.table = new Table();
        });
    }

    update() {
        if (this.monitorScreen) this.monitorScreen.update();
        if (this.environment) this.environment.update();
        if (this.audioManager) this.audioManager.update();
    }
}