import * as THREE from 'three'
import Bullet from './bullet'

export default class GameMap {
    map: Array<string>
    ZSIZE: number
    XSIZE: number
    meshMap: Array<any>
    materials: Array<THREE.MeshPhongMaterial>
    scene: THREE.Scene
    floor: THREE.Mesh
    HORIZONTAL_UNIT: number
    VERTICAL_UNIT: number
    spawnPoints: Array<THREE.Vector3>
    bullets: Array<Bullet>

    constructor(scene: THREE.Scene) {
        this.scene = scene
        this.HORIZONTAL_UNIT = 100
        this.VERTICAL_UNIT = 100
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
            this.map.push('   X      XX   XXXXXXTTXX  XXX')
            this.map.push('   X      XTTTTTXXXTTTTXX  X  ')
            this.map.push('   XX  S  XTTTTTXXTTTTTXX  XXX')
            this.map.push('XXXXX     XTTTTTXTTTTTTX     X')
            this.map.push('X      XTTXTTTTTTTTTTTTX     X')
            this.map.push('X  S  XXTTTTTTTTXTTTTTXX  S  X')
            this.map.push('X     XTTTTTTTTTXTTTTTX      X')
            this.map.push('X     TTTTTTTTTTXXXXTTX  XXXXX')
            this.map.push('X     XTTTTTTTTTX X      X    ')
            this.map.push('XX  XXXTTTTTTTTTX X      X    ')
            this.map.push(' X  X XTTTTTTTTTX X      X    ')
            this.map.push(' X  XXX         X X      X    ')
            this.map.push(' X             XXXX      XX   ')
            this.map.push(' XXXXX    T               X   ')
            this.map.push('     X                 S  X   ')
            this.map.push('     XX   S  XXXXXXXX     X   ')
            this.map.push('      XX    XX      XXXXXXX   ')
            this.map.push('       XXXXXX                 ')
        }
        this.ZSIZE = this.map.length * this.HORIZONTAL_UNIT
        this.XSIZE = this.map[0].length * this.HORIZONTAL_UNIT
        this.meshMap = new Array(this.map.length)
        for (let i = 0; i < 8; i++) {
            this.materials.push(
                new THREE.MeshPhongMaterial({
                    color: new THREE.Color().setHSL(
                        Math.random() * 0.2 + 0.3,
                        0.5,
                        Math.random() * 0.25 + 0.75
                    ),
                })
            )
        }
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

    getMaterials() {
        return this.materials[
            Math.floor(Math.random() * this.materials.length)
        ].clone()
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
            case 'T':
                mesh = new THREE.Mesh(WALL.clone(), this.getMaterials())
                mesh.position.set(x, this.VERTICAL_UNIT * 0.5, z)
                break
            case 'X':
                mesh = new THREE.Mesh(WALL.clone(), this.getMaterials())
                mesh.scale.y = 3
                mesh.position.set(x, this.VERTICAL_UNIT * 1.5, z)
                break
        }
        if (typeof mesh !== 'undefined') {
            this.scene.add(mesh)
        }
        return mesh
    }
    checkPlayerCollision() {
        const cell = new MapCell()
        return function (player) {
            player.collideFloor(this.floor.position.y)
            this.mapCellFromPosition(player.position, cell)
            switch (cell.char) {
                case ' ':
                case 'S':
                    if (
                        Math.floor(player.position.y - player.cameraHeight) <=
                        this.floor.position.y
                    ) {
                        player.canJump = true
                    }
                    break
                case 'T':
                    const topPosition =
                        cell.mesh.position.y + this.VERTICAL_UNIT * 0.5
                    if (player.collideFloor(topPosition)) {
                        player.canJump = true
                    } else if (
                        player.position.y - player.cameraHeight * 0.5 <
                        topPosition
                    ) {
                        this.moveOutside(cell.mesh.position, player.position)
                    }
                    break
                case 'X':
                    this.moveOutside(cell.mesh.position, player.position)
                    break
            }
        }
    }

    checkBulletCollision() {
        var cell = new MapCell()
        function removeBullet(bullet, i) {
            this.scene.remove(bullet)
            deadBulletPool.push(bullet)
            bullets.splice(i, 1)
        }
        return function (bullet, i) {
            if (bullet.player !== player && spheresOverlap(bullet, player)) {
                hurt(bullet)
                removeBullet(bullet, i)
            }
            for (var j = 0; j < numEnemies; j++) {
                if (
                    bullet.player !== enemies[j] &&
                    spheresOverlap(bullet, enemies[j])
                ) {
                    enemies[j].health -= bullet.damage
                    removeBullet(bullet, i)
                    break
                }
            }
            this.mapCellFromPosition(bullet.position, cell)
            if (
                cell.char == 'X' ||
                (cell.char == 'T' &&
                    bullet.position.y - Bullet.RADIUS <
                        cell.mesh.position.y + this.VERTICAL_UNIT * 0.5) ||
                bullet.position.y - Bullet.RADIUS < floor.position.y ||
                bullet.position.y > this.VERTICAL_UNIT * 5
            ) {
                removeBullet(bullet, i)
            }
        }
    }

    mapCellFromPosition(position, cell) {
        cell = cell || new MapCell()
        var XOFFSET = (this.map.length + 1) * 0.5 * this.HORIZONTAL_UNIT,
            ZOFFSET = (this.map[0].length + 1) * 0.5 * this.HORIZONTAL_UNIT
        var mapCol =
                Math.floor((position.x + XOFFSET) / this.HORIZONTAL_UNIT) - 1,
            mapRow =
                Math.floor((position.z + ZOFFSET) / this.HORIZONTAL_UNIT) - 1,
            char = this.map[mapRow].charAt(mapCol),
            mesh = this.meshMap[mapRow][mapCol]
        cell.set(mapRow, mapCol, char, mesh)
    }

    moveOutside(meshPosition, playerPosition) {
        var mw = this.HORIZONTAL_UNIT,
            md = this.HORIZONTAL_UNIT,
            mx = meshPosition.x - mw * 0.5,
            mz = meshPosition.z - md * 0.5
        var px = playerPosition.x,
            pz = playerPosition.z
        if (px > mx && px < mx + mw && pz > mz && pz < mz + md) {
            var xOverlap = px - mx < mw * 0.5 ? px - mx : px - mx - mw,
                zOverlap = pz - mz < md * 0.5 ? pz - mz : pz - mz - md
            if (Math.abs(xOverlap) > Math.abs(zOverlap))
                playerPosition.x -= xOverlap
            else playerPosition.z -= zOverlap
        }
    }
}

class MapCell {
    row: number
    col: number
    char: string
    mesh: THREE.Mesh
    setCell(row, col, char, mesh) {
        this.row = row
        this.col = col
        this.char = char
        this.mesh = mesh
    }
}
