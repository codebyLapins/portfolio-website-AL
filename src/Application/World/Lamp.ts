import * as THREE from 'three';
import Application from '../Application';
import BakedModel from '../Utils/BakedModel';
import Resources from '../Utils/Resources';

export default class Lamp {
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
            this.resources.items.gltfModel.lampModel,
            this.resources.items.texture.lampTexture,
            900
        );
    }

    setModel() {
        const model = this.bakedModel.getModel();
        // Position the lamp if needed
        // model.position.set(3, 0, -2);
        this.scene.add(model);
    }
}