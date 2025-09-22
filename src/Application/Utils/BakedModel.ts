import * as THREE from 'three';

type LoadedModel = any;
type LoadedTexture = THREE.Texture;

export default class BakedModel {
    model: LoadedModel;
    texture: LoadedTexture;
    material: THREE.MeshBasicMaterial;

    constructor(model: LoadedModel, texture: LoadedTexture, scale?: number) {
        this.model = model;
        this.texture = texture;

        // Add safety checks for texture
        if (this.texture) {
            this.texture.flipY = false;
            this.texture.encoding = THREE.sRGBEncoding;
        }

        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
        });

        // Add safety check for model
        if (this.model && this.model.scene) {
            this.model.scene.traverse((child: THREE.Object3D) => {
                if (child instanceof THREE.Mesh) {
                    if (scale) child.scale.set(scale, scale, scale);
                    if (this.texture) {
                        child.material.map = this.texture;
                        child.material = this.material;
                    }
                }
            });
        }

        return this;
    }

    getModel(): THREE.Group {
        return this.model?.scene || new THREE.Group();
    }
}