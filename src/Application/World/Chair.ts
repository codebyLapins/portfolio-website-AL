import * as THREE from 'three';
import Application from '../Application';
import BakedModel from '../Utils/BakedModel';
import Resources from '../Utils/Resources';

export default class Chair {
    application: Application;
    scene: THREE.Scene;
    resources: Resources;
    bakedModel: BakedModel;

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;

        this.bakeModel();
        this.setModel();
    }

    bakeModel() {
        this.bakedModel = new BakedModel(
            this.resources.items.gltfModel.chairModel,
            this.resources.items.texture.chairTexture,
            900
        );
    }

    setModel() {
        const model = this.bakedModel.getModel();
        // Position the chair if needed
        // model.position.set(-2, 0, 1);
        // model.rotation.y = Math.PI * 0.25;
        this.scene.add(model);
    }
}