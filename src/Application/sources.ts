import { Resource } from './Utils/Resources';

export const sources: Resource[] = [
    // Existing computer setup
    {
        name: 'computerSetupModel',
        type: 'gltfModel',
        path: '/models/computer-setup.glb'
    },
    {
        name: 'computerSetupTexture',
        type: 'texture',
        path: '/textures/baked_computer.jpg'
    },
    
    // New furniture models - using proper naming convention
    {
        name: 'BackgroundModel',
        type: 'gltfModel',
        path: '/models/Background.glb'
    },
    {
        name: 'BackgroundTexture',
        type: 'texture',
        path: '/textures/Background.jpg'
    },
    {
        name: 'ChairModel',
        type: 'gltfModel',
        path: '/models/Chair.glb'
    },
    {
        name: 'ChairTexture',
        type: 'texture',
        path: '/textures/Chair.jpg'
    },
    {
        name: 'LampModel',
        type: 'gltfModel',
        path: '/models/Lamp.glb'
    },
    {
        name: 'LampTexture',
        type: 'texture',
        path: '/textures/Lamp.jpg'
    },
    {
        name: 'TableModel',
        type: 'gltfModel',
        path: '/models/Table.glb'
    },
    {
        name: 'TableTexture',
        type: 'texture',
        path: '/textures/Table.jpg'
    }
];