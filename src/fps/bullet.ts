import * as THREE from 'three'

export default class Bullet {
    direction: any
    speed: number
    damage: number
    mesh: THREE.Mesh
    RADIUS: number
    scene: THREE.Scene

    constructor(scene: THREE.Scene) {
        this.scene = scene
        this.speed = 1000
        this.damage = 1000
        this.RADIUS = 5
        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(this.RADIUS, 8, 6),
            new THREE.MeshBasicMaterial({ color: 0x333333 })
        )
    }

    update() {
        const scaledDirection = new THREE.Vector3()
        return function (delta) {
            scaledDirection
                .copy(this.direction)
                .multiplyScalar(this.speed * delta)
            this.position.add(scaledDirection)
        }
    }

    clone(object) {
        if (typeof object === 'undefined') {
            object = new Bullet(this.scene)
        }
        THREE.Mesh.prototype.clone.call(this, object)

        object.direction = this.direction
        object.speed = this.speed
        object.damage = this.damage

        return object
    }

    removeBullet(bullet: THREE.Mesh, i) {
        this.scene.remove(bullet)
        deadBulletPool.push(bullet)
        bullets.splice(i, 1)
    }
}
