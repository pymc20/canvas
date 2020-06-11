import react, { useEffect } from 'react'
import * as THREE from 'three'

export default function Fps() {
    function test() {
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
        console.log(canvas)
        canvas.appendChild(renderer.domElement)

        const geometry = new THREE.BoxGeometry()
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
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
        test()
    })
    return <div id="canvas" />
}
