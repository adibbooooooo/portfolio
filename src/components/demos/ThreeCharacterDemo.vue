<template>
    <div class="py-4">
        <!-- Controls OUTSIDE the canvas -->
        <div class="ctrls-bar">
            <div class="ctrls-inner">
                <select class="sel" v-model="currentClip" @change="playClip(currentClip)">
                    <option v-for="n in clipNames" :key="n" :value="n">{{ n }}</option>
                </select>

                <button class="btn" @click="playClip(currentClip)">Play</button>
                <button class="btn ghost" @click="stopAll">Stop</button>

                <div class="speed">
                    <button class="btn ghost" :class="{ on: speed === 0.5 }" @click="setSpeed(0.5)">0.5×</button>
                    <button class="btn ghost" :class="{ on: speed === 1 }" @click="setSpeed(1)">1×</button>
                    <button class="btn ghost" :class="{ on: speed === 1.5 }" @click="setSpeed(1.5)">1.5×</button>
                    <button class="btn ghost" :class="{ on: speed === 2 }" @click="setSpeed(2)">2×</button>
                </div>
            </div>
        </div>

        <!-- Canvas box -->
        <div class="three-wrap">
            <div class="three-canvas" ref="mountRef"></div>

            <!-- Loader -->
            <div v-if="loading < 100" class="overlay">
                <div class="overlay-box">
                    <div class="ovl-title">Loading model…</div>
                    <div class="bar">
                        <div class="bar-fill" :style="{ width: loading + '%' }" />
                    </div>
                    <div class="ovl-sub">{{ Math.round(loading) }}%</div>
                </div>
            </div>
        </div>

        <!-- ✅ Model Credit -->
        <div class="credit px-4">
            “<a href="https://skfb.ly/pB77L" target="_blank" rel="noopener">White Ranger – Power Rangers</a>”
            by <strong>CreadorDeMu</strong> is licensed under
            <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">
                CC BY 4.0
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/** Change this if you host elsewhere */
const MODEL_PATH = '/models/whiteranger.glb'

const mountRef = ref<HTMLDivElement | null>(null)
const loading = ref(0)

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let controls: OrbitControls | null = null
let clock: THREE.Clock | null = null

let modelRoot: THREE.Object3D | null = null
let mixer: THREE.AnimationMixer | null = null
let clips: THREE.AnimationClip[] = []
let rafId = 0

// UI state
const clipNames = ref<string[]>([])
const currentClip = ref<string>('')
const speed = ref(0.5) // default “normal” per your preference

// sizing / fit
const TARGET_BOX_SIZE = 3   // world units (largest dimension will become this)
const FOV = 30

function createRenderer(container: HTMLDivElement) {
    const r = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    r.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    r.setSize(container.clientWidth, container.clientWidth) // square
    container.appendChild(r.domElement)
    return r
}
function createScene() {
    const s = new THREE.Scene()
    const amb = new THREE.AmbientLight(0xffffff, 1.0)
    const dir = new THREE.DirectionalLight(0xffffff, 1.1)
    dir.position.set(3, 5, 2)
    s.add(amb, dir)
    return s
}
function createCamera() {
    const cam = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100)
    cam.position.set(0, 1.8, 6)
    return cam
}
function fitCameraToObject(obj: THREE.Object3D, cam: THREE.PerspectiveCamera) {
    // 1) bounds + center
    const box = new THREE.Box3().setFromObject(obj)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    // 2) center at origin
    obj.position.sub(center)

    // 3) rest on ground (y=0)
    const after = new THREE.Box3().setFromObject(obj)
    obj.position.y -= after.min.y

    // 4) scale uniformly so largest dimension = TARGET_BOX_SIZE
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const scale = TARGET_BOX_SIZE / maxDim
    obj.scale.setScalar(scale)

    // 5) place camera so feet are close to bottom & body fills frame
    const targetY = TARGET_BOX_SIZE * 0.58
    const halfSize = TARGET_BOX_SIZE * 0.5
    const halfFovY = THREE.MathUtils.degToRad(cam.fov * 0.5)
    const distance = halfSize / Math.tan(halfFovY)

    cam.position.set(0, targetY, distance * 1.2)
    cam.lookAt(new THREE.Vector3(0, targetY * 0.95, 0))
}

function onResize() {
    if (!renderer || !camera || !mountRef.value) return
    const w = mountRef.value.clientWidth
    const h = w
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
}

function setSpeed(s: number) {
    speed.value = s
    if (mixer) mixer.timeScale = s
}

function playClip(name: string) {
    if (!mixer || !clips.length) return
    const found = clips.find(c => c.name === name) ?? clips[0]
    mixer.stopAllAction()
    if (!found) return
    mixer
        .clipAction(found)
        .setLoop(THREE.LoopRepeat, Infinity)
        .fadeIn(0.15)
        .play()
}

function stopAll() { mixer?.stopAllAction() }

onMounted(() => {
    const container = mountRef.value!
    renderer = createRenderer(container)
    scene = createScene()
    camera = createCamera()
    clock = new THREE.Clock()

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableZoom = true
    controls.enableRotate = false   // zoom-only
    controls.enablePan = false
    controls.target.set(0, 1.6, 0)

    // GLB loader (DRACO)
    const loader = new GLTFLoader()
    const draco = new DRACOLoader()
    draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
    loader.setDRACOLoader(draco)

    loader.load(
        MODEL_PATH,
        (gltf) => {
            modelRoot = gltf.scene
            scene!.add(modelRoot)

            // Animations
            clips = gltf.animations || []
            clipNames.value = [...new Set(clips.map(c => c.name))].sort()
            currentClip.value = clipNames.value[0] || 'Idle'

            if (clips.length) {
                mixer = new THREE.AnimationMixer(modelRoot)
                setSpeed(speed.value) // apply default 0.5×
                playClip(currentClip.value)
            }

            fitCameraToObject(modelRoot!, camera!)
            controls!.update()
            loading.value = 100
        },
        (evt) => {
            if (!evt.total) return
            loading.value = (evt.loaded / evt.total) * 100
        },
        (err) => {
            console.error('GLB load error:', err)
            loading.value = 100
        }
    )

    const animate = () => {
        rafId = requestAnimationFrame(animate)
        const dt = clock!.getDelta()
        mixer?.update(dt)
        controls!.update()
        renderer!.render(scene!, camera!)
    }
    animate()

    window.addEventListener('resize', onResize)
    onResize()
})

onBeforeUnmount(() => {
    cancelAnimationFrame(rafId)
    window.removeEventListener('resize', onResize)
    controls?.dispose()
    renderer?.dispose()

    if (scene) {
        scene.traverse(obj => {
            // @ts-ignore
            obj.geometry?.dispose?.()
            // @ts-ignore
            const m = obj.material
            if (Array.isArray(m)) m.forEach(mm => mm?.dispose?.())
            else m?.dispose?.()
        })
    }
    mixer = null
    clips = []
    modelRoot = null
    scene = null
    camera = null
    renderer = null
    clock = null
})
</script>

<style scoped>
/* controls bar OUTSIDE the canvas */
.ctrls-bar {
    margin: 0 auto 10px;
    max-width: 360px;
    /* a bit wider than canvas for breathing room */
}

.ctrls-inner {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
    justify-content: center;
}

.sel {
    background: rgba(255, 255, 255, .05);
    border: 1px solid rgba(255, 255, 255, .15);
    color: #e5e7eb;
    font-size: 12px;
    border-radius: 8px;
    padding: 6px 10px;
}

/* canvas box */
.three-wrap {
    position: relative;
    background: #0b0c0d;
    border: 1px solid rgba(255, 255, 255, .08);
    border-radius: 12px;
    width: 100%;
    max-width: 300px;
    /* mobile friendly */
    margin: 0 auto;
}

.three-canvas {
    width: 100%;
    aspect-ratio: 1 / 1;
    background: #0e0f10;
    border-radius: 10px;
    overflow: hidden;
}

/* buttons (same system as your other demos) */
.btn {
    border: 1px solid rgba(255, 255, 255, .15);
    background: rgba(255, 255, 255, .05);
    color: #e5e7eb;
    font-size: 12px;
    border-radius: 8px;
    padding: 6px 10px;
    cursor: pointer;
    transition: all .2s ease;
}

.btn:hover {
    border-color: rgba(16, 185, 129, .5);
    background: rgba(16, 185, 129, .1);
    color: #a7f3d0;
    box-shadow: 0 0 10px rgba(16, 185, 129, .2);
    transform: translateY(-1px);
}

.btn:active {
    transform: scale(.96);
}

.btn.ghost {
    background: transparent;
    color: #9ca3af;
    border-color: rgba(255, 255, 255, .1);
}

.btn.ghost:hover {
    color: #d1fae5;
    border-color: rgba(16, 185, 129, .4);
}

.btn.ghost.on {
    border-color: rgba(16, 185, 129, .6);
    color: #a7f3d0;
}

.speed {
    display: inline-flex;
    gap: 6px;
}

/* loader overlay (still on top of canvas only) */
.overlay {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background: rgba(0, 0, 0, .45);
    border-radius: 10px;
    z-index: 3;
}

.overlay-box {
    background: rgba(20, 20, 20, .9);
    border: 1px solid rgba(255, 255, 255, .12);
    border-radius: 10px;
    padding: 14px 16px;
    min-width: 200px;
    text-align: center;
    color: #e5e7eb;
}

.ovl-title {
    font-weight: 700;
    margin-bottom: 8px;
}

.ovl-sub {
    font-size: 12.5px;
    color: #cbd5e1;
    margin-top: 6px;
}

.bar {
    height: 8px;
    background: rgba(255, 255, 255, .06);
    border: 1px solid rgba(255, 255, 255, .12);
    border-radius: 999px;
    overflow: hidden;
}

.bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #16a34a, #22d3ee);
    width: 0%;
    transition: width .15s ease;
}

/* small screens: allow horizontal scroll for controls if needed */
@media (max-width: 380px) {
    .ctrls-inner {
        overflow-x: auto;
        padding-bottom: 4px;
    }
}

.credit {
    text-align: center;
    color: #9ca3af;
    font-size: 11.5px;
    margin-top: 8px;
    line-height: 1.4;
}

.credit a {
    color: #a7f3d0;
    text-decoration: none;
}

.credit a:hover {
    text-decoration: underline;
}
</style>