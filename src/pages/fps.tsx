import react, { useEffect } from 'react'
import * as THREE from 'three'

export default function Fps() {
    const spawnPoints = []
    const map = []
    map.push('XXXXXXX  ')
    map.push('X     X  ')
    map.push('X  S  X  ')
    map.push('X     X  ')
    map.push('X   S XXX')
    map.push('XXX     X')
    map.push('  XX  S X')
    map.push('   X    X')
    map.push('   XXXXXX')
    const HORIZONTAL_UNIT = 100,
        VERTICAL_UNIT = 100,
        ZSIZE = map.length * HORIZONTAL_UNIT,
        XSIZE = map[0].length * HORIZONTAL_UNIT
    function createMap() {
        const group = new THREE.Group()
        map.forEach((rowVal, rowIdx) => {
            for (let i = 0; i < rowVal.length; i++) {
                addVoxel(rowVal.charAt(i), rowIdx, i, group)
            }
        })
        return group
    }

    function addVoxel(
        type: string,
        row: number,
        col: number,
        group: THREE.Group
    ) {
        const z = (row + 1) * HORIZONTAL_UNIT - ZSIZE * 0.5,
            x = (col + 1) * HORIZONTAL_UNIT - XSIZE * 0.5
        switch (type) {
            case ' ':
                break
            case 'S':
                spawnPoints.push(new THREE.Vector3(x, 0, z))
                break
            case 'X':
                const geo = new THREE.BoxGeometry(
                    HORIZONTAL_UNIT,
                    VERTICAL_UNIT,
                    HORIZONTAL_UNIT
                )
                const material = new THREE.MeshPhongMaterial({
                    color: Math.random() * 0xffffff,
                })
                const mesh = new THREE.Mesh(geo, material)
                mesh.position.set(x, VERTICAL_UNIT * 0.5, z)
                group.add(mesh)
                break
        }
    }

    function test() {
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        const light = new THREE.AmbientLight(0xffffff, 0.8)

        const map = createMap()
        console.log(map)
        scene.add(map)
        scene.add(light)
        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(window.innerWidth, window.innerHeight)
        const canvas = document.getElementById('canvas')
        canvas.appendChild(renderer.domElement)

        camera.position.z = 800
        camera.position.y = 500
        renderer.render(scene, camera)

        // const geometry = new THREE.BoxGeometry()
        // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        // const cube = new THREE.Mesh(geometry, material)
        // scene.add(cube)

        // camera.position.z = 5

        // const animate = function () {
        //     requestAnimationFrame(animate)

        //     map.rotation.x += 0.01
        //     map.rotation.y += 0.01

        //     renderer.render(scene, camera)
        // }

        // animate()
    }

    useEffect(() => {
        test()
    })
    return <div id="canvas" />
}
