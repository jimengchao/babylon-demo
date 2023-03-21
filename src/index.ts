import gsap from 'gsap';

import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import '@babylonjs/inspector';

const canvas = document.querySelector<HTMLCanvasElement>('#babylon-view')!;

async function createEngine() {
  const engine = new BABYLON.WebGPUEngine(canvas, {
    // 高分辨率
    adaptToDeviceRatio: true,
    // 功耗
    powerPreference: 'high-performance',
  });

  await engine.initAsync();

  return engine;
}

// 场景
class GameScene extends BABYLON.Scene {
  constructor(engine: BABYLON.WebGPUEngine) {
    super(engine);
    this.createCamera();
    this.createLight();
    this.loadModel();
  }
  // 创建相机
  createCamera() {
    const camera = new BABYLON.ArcRotateCamera(
      'ArcRotateCamera',
      Math.PI / 4,
      Math.PI / 4,
      50,
      BABYLON.Vector3.Zero(),
      this,
    );

    camera.attachControl();
  }
  // 创建灯光
  createLight() {
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1), this);

    const directionalLight = new BABYLON.DirectionalLight(
      'DirectionalLight',
      new BABYLON.Vector3(-4, -4, 4 * Math.PI),
      this,
    );

    directionalLight.intensity = 3;
  }

  // 创建立方体
  // createBox() {
  //   const box = BABYLON.MeshBuilder.CreateBox('box', { size: 2 }, this);
  // }

  async loadModel() {
    await BABYLON.SceneLoader.AppendAsync('/models/', 'halo_ccs_cruiser.glb', this);
    const glow = new BABYLON.GlowLayer('glow', this);
    glow.intensity = 1;

    gsap.to(glow, {
      intensity: 3,
      repeat: -1,
      ease: 'linear',
      yoyo: true,
      duration: 1,
    });
  }
}

// 生成引擎
const engine = await createEngine();

// 传入引擎, 生成场景
const scene = new GameScene(engine);

scene.debugLayer.show({
  // embedMode: true,
});

engine.runRenderLoop(() => {
  scene.render();
});
