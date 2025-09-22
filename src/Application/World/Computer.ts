import * as THREE from 'three';
import Application from '../Application';
import BakedModel from '../Utils/BakedModel';
import Resources from '../Utils/Resources';

export default class Computer {
    application: Application;
    scene: THREE.Scene;
    resources: Resources;
    bakedModel?: BakedModel;

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;

        this.bakeModel();
        this.setModel();
        this.loadFurniture();
    }

    bakeModel() {
        const model = this.resources.items.gltfModel.computerSetupModel;
        const texture = this.resources.items.texture.computerSetupTexture;

        // Check if both model and texture exist
        if (model && texture) {
            try {
                this.bakedModel = new BakedModel(model, texture, 900);
                console.log('Computer model baked successfully');
            } catch (error) {
                console.error('Error baking computer model:', error);
                // Fallback: load model without baked texture
                this.loadModelWithoutTexture(model);
            }
        } else {
            console.warn('Missing computer model or texture');
            if (model) {
                this.loadModelWithoutTexture(model);
            }
        }
    }

    loadModelWithoutTexture(model: any) {
        if (model && model.scene) {
            const clonedModel = model.scene.clone();
            clonedModel.scale.set(900, 900, 900);
            this.scene.add(clonedModel);
            console.log('Computer model loaded without baked texture');
        }
    }

    setModel() {
        if (this.bakedModel) {
            this.scene.add(this.bakedModel.getModel());
        }
    }

    loadFurniture() {
        const furnitureItems = [
            { model: 'BackgroundModel', texture: 'BackgroundTexture' },
            { model: 'ChairModel', texture: 'ChairTexture' },
            { model: 'LampModel', texture: 'LampTexture' },
            { model: 'TableModel', texture: 'TableTexture' }
        ];

        furnitureItems.forEach(item => {
            const model = this.resources.items.gltfModel[item.model];
            const texture = this.resources.items.texture[item.texture];

            console.log(`Checking ${item.model}:`, { 
                hasModel: !!model, 
                hasTexture: !!texture
            });

            if (model && texture) {
                try {
                    const furnitureModel = new BakedModel(model, texture, 900);
                    this.scene.add(furnitureModel.getModel());
                    console.log(`Successfully loaded furniture: ${item.model} with BakedModel`);
                } catch (error) {
                    console.error(`Error loading furniture ${item.model}:`, error);
                }
            } else {
                console.warn(`Missing resources for ${item.model}:`, { 
                    model: !!model, 
                    texture: !!texture 
                });
            }
        });
    }
}