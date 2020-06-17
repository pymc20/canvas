import react, { useEffect } from 'react'
import * as THREE from 'three'
import GameMap from '../fps/map'

export default function Fps() {
    function test() {
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            1,
            4000
        )
        const light = new THREE.AmbientLight(0xffffff, 0.8)

        const map = new GameMap(scene)
        map.setupMap()
        scene.add(light)
        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(window.innerWidth, window.innerHeight)
        const canvas = document.getElementById('canvas')
        canvas.appendChild(renderer.domElement)

        window.addEventListener('keydown', (e) => move(e, camera))

        camera.position.set(50, 30, -900)

        const animate = function () {
            requestAnimationFrame(animate)

            renderer.render(scene, camera)
        }

        animate()
    }

    const move = (event, camera) => {
        const key = event.key
        const speed = 10
        const angle = 0.03
        switch (key) {
            case 'w':
                camera.translateZ(-speed)
                break
            case 's':
                camera.translateZ(speed)
                break
            case 'q':
                camera.translateX(-speed)
                break
            case 'e':
                camera.translateX(speed)
                break
            case 'a':
                camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle)
                break
            case 'd':
                camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), -angle)
                break
        }
    }

    useEffect(() => {
        test()
    })
    return <div id="canvas" />
}
