import * as THREE from 'three';
import Application from '../Application';
import BakedModel from '../Utils/BakedModel';
import Resources from '../Utils/Resources';

export default class Background {
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
            this.resources.items.gltfModel.backgroundModel,
            this.resources.items.texture.backgroundTexture,
            900
        );
    }

    setModel() {
        const model = this.bakedModel.getModel();
        // Position the background if needed
        // model.position.set(0, 0, 0);
        // model.scale.set(1, 1, 1);
        this.scene.add(model);
    }
}