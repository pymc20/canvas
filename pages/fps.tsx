import react, { useEffect } from 'react'
import * as THREE from 'three'

export default function Fps() {
    function fpsRender() {
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

        const vertices = new Float32Array([
            0.0,
            0.0,
            0.0,
            2.0,
            0.0,
            0.0,
            0.0,
            1.0,
            0.0,
            1.0,
            1.0,
            0.0,
            0.0,
            2.0,
            0.0,
            2.0,
            2.0,
            0.0,

            0.0,
            0.0,
            1.0,
            2.0,
            0.0,
            1.0,
            0.0,
            1.0,
            1.0,
            1.0,
            1.0,
            1.0,
            0.0,
            2.0,
            1.0,
            2.0,
            2.0,
            1.0,

            0.0,
            0.0,
            2.0,
            2.0,
            0.0,
            2.0,
            0.0,
            1.0,
            2.0,
            1.0,
            1.0,
            2.0,
            0.0,
            2.0,
            2.0,
            2.0,
            2.0,
            2.0,
        ])

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(vertices, 3)
        )
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
        })
        const cube = new THREE.Mesh(geometry, material)
        scene.add(cube)

        camera.position.z = 5

        const animate = function () {
            requestAnimationFrame(animate)

            cube.rotation.x += 0.01
            cube.rotation.y += 0.01

            renderer.render(scene, camera)
        }

        animate()
    }

    useEffect(() => {
        fpsRender()
    })
    return <div id="canvas" />
}
