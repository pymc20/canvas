import react, { useEffect } from 'react'
import * as THREE from 'three'

export default function Cube() {
    function cubeRender() {
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )

        const renderer = new THREE.WebGLRenderer()
        const canvas = document.getElementById('canvas')
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
        canvas.appendChild(renderer.domElement)

        const group = new THREE.Group()
        const mats = []
        mats.push(new THREE.MeshBasicMaterial({ color: 0x009e60 }))
        mats.push(new THREE.MeshBasicMaterial({ color: 0x0051ba }))
        mats.push(new THREE.MeshBasicMaterial({ color: 0xffd500 }))
        mats.push(new THREE.MeshBasicMaterial({ color: 0xff5800 }))
        mats.push(new THREE.MeshBasicMaterial({ color: 0xc41e3a }))
        mats.push(new THREE.MeshBasicMaterial({ color: 0xffffff }))

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                for (let z = 0; z < 3; z++) {
                    const cubeGeom = new THREE.BoxGeometry(0.9, 0.9, 0.9)
                    const cube = new THREE.Mesh(cubeGeom, mats)
                    cube.position.set(x * 1, y * 1, z * 1)
                    group.add(cube)
                }
            }
        }

        scene.add(group)

        camera.position.z = 10

        const animate = function () {
            requestAnimationFrame(animate)
            group.rotation.x += 0.01
            group.rotation.y += 0.01
            renderer.render(scene, camera)
        }

        animate()
    }

    useEffect(() => {
        cubeRender()
    })
    return <div id="canvas" />
}
