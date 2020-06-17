import * as THREE from 'three'

export default class GameMap {
    map: Array<string>
    ZSIZE: number
    XSIZE: number
    meshMap: Array<any>
    materials: Array<THREE.MeshBasicMaterial>
    scene: THREE.Scene
    floor: THREE.Mesh
    HORIZONTAL_UNIT: number
    VERTICAL_UNIT: number
    spawnPoints: Array<THREE.Vector3>

    constructor(scene: THREE.Scene) {
        this.scene = scene
        this.HORIZONTAL_UNIT = 100
        this.VERTICAL_UNIT = 100
        this.map = new Array()
        this.meshMap = new Array()
        this.materials = new Array()
        this.spawnPoints = new Array()
        this.init()
    }
    init() {
        if (this.map.length < 1) {
            this.map.push('   XXXXXXXX     XXXXXXXX      ')
            this.map.push('   X      X     X      X      ')
            this.map.push('   X  S   X     X   S  X      ')
            this.map.push('   X      XXXXXXX      X      ')
            this.map.push('   X                  XXXXXXXX')
            this.map.push('   X         S               X')
            this.map.push('   XXXX XX       XXXX    S   X')
            this.map.push('      X XX       X  X        X')
            this.map.push('   XXXX XXX     XX  X        X')
            this.map.push('   X      XX   XXXXXX  XX  XXX')
            this.map.push('   X      X     XXX    XX  X  ')
            this.map.push('   XX  S  X     XX     XX  XXX')
            this.map.push('XXXXX     X     X      X     X')
            this.map.push('X      X  X            X     X')
            this.map.push('X  S  XX        X     XX  S  X')
            this.map.push('X     X         X     X      X')
            this.map.push('X               XXXX  X  XXXXX')
            this.map.push('X     X         X X      X    ')
            this.map.push('XX  XXX         X X      X    ')
            this.map.push(' X  X X         X X      X    ')
            this.map.push(' X  XXX         X X      X    ')
            this.map.push(' X             XXXX      XX   ')
            this.map.push(' XXXXX                    X   ')
            this.map.push('     X                 S  X   ')
            this.map.push('     XX   S  XXXXXXXX     X   ')
            this.map.push('      XX    XX      XXXXXXX   ')
            this.map.push('       XXXXXX                 ')
        }
        this.ZSIZE = this.map.length * this.HORIZONTAL_UNIT
        this.XSIZE = this.map[0].length * this.HORIZONTAL_UNIT
        this.meshMap = new Array(this.map.length)

        // const loader = new THREE.CubeTextureLoader()
        const loader = new THREE.TextureLoader()

        const texture = loader.load('brick.jpeg')
        this.materials.push(
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                map: texture,
            })
        )
    }
    setupMap() {
        for (var i = 0, rows = this.map.length; i < rows; i++) {
            for (var j = 0, cols = this.map[i].length; j < cols; j++) {
                if (typeof this.meshMap[i] === 'undefined') {
                    this.meshMap[i] = new Array(cols)
                }
                this.meshMap[i][j] = this.addVoxel(this.map[i].charAt(j), i, j)
            }
        }

        const material = new THREE.MeshPhongMaterial({ color: 0xaaaaaa })
        const floorGeo = new THREE.PlaneGeometry(this.XSIZE, this.ZSIZE, 20, 20)
        this.floor = new THREE.Mesh(floorGeo, material)
        this.floor.rotation.x = Math.PI * -0.5
        this.floor.position.set(this.HORIZONTAL_UNIT, 0, -this.HORIZONTAL_UNIT) // Ideally this wouldn't be needed
        this.scene.add(this.floor)
    }

    getMaterials(number) {
        return this.materials[number].clone()
    }

    addVoxel(type: string, row: number, col: number): THREE.Mesh {
        const XOFFSET = this.map.length * 0.5 * this.HORIZONTAL_UNIT,
            ZOFFSET = this.map[0].length * 0.5 * this.HORIZONTAL_UNIT

        const WALL = new THREE.BoxGeometry(
            this.HORIZONTAL_UNIT,
            this.VERTICAL_UNIT,
            this.HORIZONTAL_UNIT
        )

        const z = (row + 1) * this.HORIZONTAL_UNIT - ZOFFSET,
            x = (col + 1) * this.HORIZONTAL_UNIT - XOFFSET
        let mesh: THREE.Mesh
        switch (type) {
            case ' ':
                break
            case 'S':
                this.spawnPoints.push(new THREE.Vector3(x, 0, z))
                break
            case 'X':
                mesh = new THREE.Mesh(WALL.clone(), this.getMaterials(0))
                mesh.scale.y = 3
                mesh.position.set(x, this.VERTICAL_UNIT * 1.5, z)
                break
        }
        if (typeof mesh !== 'undefined') {
            this.scene.add(mesh)
        }
        return mesh
    }
}
