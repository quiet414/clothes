// 3D服装模型库 - 模拟真实衣物效果
class ClothingModels {
    constructor() {
        this.textureLoader = new THREE.TextureLoader();
        this.materials = {};
        this.geometries = {};
        this.initMaterials();
    }

    initMaterials() {
        // 基础材质预设
        this.materials.cotton = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.95
        });

        this.materials.denim = new THREE.MeshLambertMaterial({
            color: 0x4169e1,
            transparent: true,
            opacity: 0.9
        });

        this.materials.silk = new THREE.MeshLambertMaterial({
            color: 0xff69b4,
            transparent: true,
            opacity: 0.85,
            side: THREE.DoubleSide
        });

        this.materials.leather = new THREE.MeshLambertMaterial({
            color: 0x8b4513,
            transparent: true,
            opacity: 0.95
        });
    }

    // 创建真实感上衣模型
    createRealisticTop(type, color = '#FFFFFF', texture = null) {
        let geometry, material;

        switch (type) {
            case 'tshirt':
                geometry = this.createTShirtGeometry();
                material = this.materials.cotton.clone();
                material.color.setHex(this.hexStringToNumber(color));
                break;

            case 'shirt':
                geometry = this.createShirtGeometry();
                material = this.materials.cotton.clone();
                material.color.setHex(this.hexStringToNumber(color));
                break;

            case 'sweater':
                geometry = this.createSweaterGeometry();
                material = new THREE.MeshLambertMaterial({
                    color: this.hexStringToNumber(color),
                    transparent: true,
                    opacity: 0.9
                });
                break;

            case 'hoodie':
                geometry = this.createHoodieGeometry();
                material = new THREE.MeshLambertMaterial({
                    color: this.hexStringToNumber(color),
                    transparent: true,
                    opacity: 0.9
                });
                break;

            default:
                geometry = this.createBasicTopGeometry();
                material = this.materials.cotton.clone();
                material.color.setHex(this.hexStringToNumber(color));
        }

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 0.35;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // 应用纹理
        if (texture) {
            this.applyTexture(mesh, texture);
        }

        return mesh;
    }

    // 创建真实感下装模型
    createRealisticBottom(type, color = '#0000FF', texture = null) {
        let geometry, material;

        switch (type) {
            case 'jeans':
                geometry = this.createJeansGeometry();
                material = this.materials.denim.clone();
                material.color.setHex(this.hexStringToNumber(color));
                break;

            case 'trousers':
                geometry = this.createTrousersGeometry();
                material = new THREE.MeshLambertMaterial({
                    color: this.hexStringToNumber(color),
                    transparent: true,
                    opacity: 0.9
                });
                break;

            case 'shorts':
                geometry = this.createShortsGeometry();
                material = new THREE.MeshLambertMaterial({
                    color: this.hexStringToNumber(color),
                    transparent: true,
                    opacity: 0.9
                });
                break;

            case 'skirt':
                geometry = this.createSkirtGeometry();
                material = new THREE.MeshLambertMaterial({
                    color: this.hexStringToNumber(color),
                    transparent: true,
                    opacity: 0.9
                });
                break;

            default:
                geometry = this.createBasicBottomGeometry();
                material = new THREE.MeshLambertMaterial({
                    color: this.hexStringToNumber(color),
                    transparent: true,
                    opacity: 0.9
                });
        }

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = -0.1;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (texture) {
            this.applyTexture(mesh, texture);
        }

        return mesh;
    }

    // 创建真实感连衣裙模型
    createRealisticDress(type, color = '#FF69B4', texture = null) {
        let geometry, material;

        switch (type) {
            case 'casual':
                geometry = this.createCasualDressGeometry();
                material = this.materials.cotton.clone();
                material.color.setHex(this.hexStringToNumber(color));
                break;

            case 'elegant':
                geometry = this.createElegantDressGeometry();
                material = this.materials.silk.clone();
                material.color.setHex(this.hexStringToNumber(color));
                break;

            case 'party':
                geometry = this.createPartyDressGeometry();
                material = new THREE.MeshLambertMaterial({
                    color: this.hexStringToNumber(color),
                    transparent: true,
                    opacity: 0.85,
                    side: THREE.DoubleSide
                });
                break;

            default:
                geometry = this.createBasicDressGeometry();
                material = new THREE.MeshLambertMaterial({
                    color: this.hexStringToNumber(color),
                    transparent: true,
                    opacity: 0.9
                });
        }

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 0.1;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (texture) {
            this.applyTexture(mesh, texture);
        }

        return mesh;
    }

    // 创建真实感外套模型
    createRealisticOuter(type, color = '#808080', texture = null) {
        let geometry, material;

        switch (type) {
            case 'jacket':
                geometry = this.createJacketGeometry();
                material = new THREE.MeshLambertMaterial({
                    color: this.hexStringToNumber(color),
                    transparent: true,
                    opacity: 0.9
                });
                break;

            case 'coat':
                geometry = this.createCoatGeometry();
                material = new THREE.MeshLambertMaterial({
                    color: this.hexStringToNumber(color),
                    transparent: true,
                    opacity: 0.9
                });
                break;

            case 'blazer':
                geometry = this.createBlazerGeometry();
                material = new THREE.MeshLambertMaterial({
                    color: this.hexStringToNumber(color),
                    transparent: true,
                    opacity: 0.95
                });
                break;

            default:
                geometry = this.createBasicOuterGeometry();
                material = new THREE.MeshLambertMaterial({
                    color: this.hexStringToNumber(color),
                    transparent: true,
                    opacity: 0.9
                });
        }

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 0.3;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (texture) {
            this.applyTexture(mesh, texture);
        }

        return mesh;
    }

    // 创建真实感鞋子模型
    createRealisticShoes(type, color = '#000000', texture = null) {
        let geometry, material;

        switch (type) {
            case 'sneakers':
                return this.createSneakersModel(color, texture);

            case 'boots':
                return this.createBootsModel(color, texture);

            case 'heels':
                return this.createHeelsModel(color, texture);

            case 'flats':
                return this.createFlatsModel(color, texture);

            default:
                return this.createBasicShoesModel(color, texture);
        }
    }

    // 几何体创建方法
    createTShirtGeometry() {
        const group = new THREE.Group();

        // 主体
        const bodyGeometry = new THREE.CylinderGeometry(0.16, 0.14, 0.35, 8);
        const bodyMesh = new THREE.Mesh(bodyGeometry, this.materials.cotton);
        bodyMesh.position.y = 0;
        group.add(bodyMesh);

        // 袖子
        const sleeveGeometry = new THREE.CylinderGeometry(0.04, 0.03, 0.25, 6);

        const leftSleeve = new THREE.Mesh(sleeveGeometry, this.materials.cotton);
        leftSleeve.position.set(-0.18, 0.1, 0);
        leftSleeve.rotation.z = Math.PI / 6;
        group.add(leftSleeve);

        const rightSleeve = new THREE.Mesh(sleeveGeometry, this.materials.cotton);
        rightSleeve.position.set(0.18, 0.1, 0);
        rightSleeve.rotation.z = -Math.PI / 6;
        group.add(rightSleeve);

        return group;
    }

    createShirtGeometry() {
        const group = new THREE.Group();

        // 主体（更修身）
        const bodyGeometry = new THREE.CylinderGeometry(0.15, 0.13, 0.38, 8);
        const bodyMesh = new THREE.Mesh(bodyGeometry, this.materials.cotton);
        bodyMesh.position.y = 0;
        group.add(bodyMesh);

        // 衣领
        const collarGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.02, 8);
        const collarMesh = new THREE.Mesh(collarGeometry, this.materials.cotton);
        collarMesh.position.y = 0.2;
        group.add(collarMesh);

        // 袖子（长袖）
        const sleeveGeometry = new THREE.CylinderGeometry(0.035, 0.025, 0.28, 6);

        const leftSleeve = new THREE.Mesh(sleeveGeometry, this.materials.cotton);
        leftSleeve.position.set(-0.18, 0.05, 0);
        leftSleeve.rotation.z = Math.PI / 8;
        group.add(leftSleeve);

        const rightSleeve = new THREE.Mesh(sleeveGeometry, this.materials.cotton);
        rightSleeve.position.set(0.18, 0.05, 0);
        rightSleeve.rotation.z = -Math.PI / 8;
        group.add(rightSleeve);

        return group;
    }

    createJeansGeometry() {
        const group = new THREE.Group();

        // 左腿
        const leftLegGeometry = new THREE.CylinderGeometry(0.08, 0.06, 0.4, 6);
        const leftLeg = new THREE.Mesh(leftLegGeometry, this.materials.denim);
        leftLeg.position.set(-0.06, -0.2, 0);
        group.add(leftLeg);

        // 右腿
        const rightLegGeometry = new THREE.CylinderGeometry(0.08, 0.06, 0.4, 6);
        const rightLeg = new THREE.Mesh(rightLegGeometry, this.materials.denim);
        rightLeg.position.set(0.06, -0.2, 0);
        group.add(rightLeg);

        // 裤腰
        const waistGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 8);
        const waist = new THREE.Mesh(waistGeometry, this.materials.denim);
        waist.position.y = 0.05;
        group.add(waist);

        return group;
    }

    createSneakersModel(color, texture) {
        const group = new THREE.Group();
        const material = new THREE.MeshLambertMaterial({
            color: this.hexStringToNumber(color),
            transparent: true,
            opacity: 0.95
        });

        // 鞋底
        const soleGeometry = new THREE.BoxGeometry(0.08, 0.02, 0.16);
        const soleMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });

        const leftSole = new THREE.Mesh(soleGeometry, soleMaterial);
        leftSole.position.set(-0.06, -0.57, 0.04);
        group.add(leftSole);

        const rightSole = new THREE.Mesh(soleGeometry, soleMaterial);
        rightSole.position.set(0.06, -0.57, 0.04);
        group.add(rightSole);

        // 鞋面
        const upperGeometry = new THREE.BoxGeometry(0.07, 0.04, 0.14);

        const leftUpper = new THREE.Mesh(upperGeometry, material);
        leftUpper.position.set(-0.06, -0.54, 0.04);
        group.add(leftUpper);

        const rightUpper = new THREE.Mesh(upperGeometry, material);
        rightUpper.position.set(0.06, -0.54, 0.04);
        group.add(rightUpper);

        group.castShadow = true;
        group.receiveShadow = true;

        if (texture) {
            this.applyTextureToGroup(group, texture);
        }

        return group;
    }

    createBootsModel(color, texture) {
        const group = new THREE.Group();
        const material = new THREE.MeshLambertMaterial({
            color: this.hexStringToNumber(color),
            transparent: true,
            opacity: 0.95
        });

        // 靴筒
        const shaftGeometry = new THREE.CylinderGeometry(0.035, 0.04, 0.12, 6);

        const leftShaft = new THREE.Mesh(shaftGeometry, material);
        leftShaft.position.set(-0.06, -0.45, 0);
        group.add(leftShaft);

        const rightShaft = new THREE.Mesh(shaftGeometry, material);
        rightShaft.position.set(0.06, -0.45, 0);
        group.add(rightShaft);

        // 鞋底
        const soleGeometry = new THREE.BoxGeometry(0.08, 0.03, 0.16);
        const soleMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });

        const leftSole = new THREE.Mesh(soleGeometry, soleMaterial);
        leftSole.position.set(-0.06, -0.58, 0.04);
        group.add(leftSole);

        const rightSole = new THREE.Mesh(soleGeometry, soleMaterial);
        rightSole.position.set(0.06, -0.58, 0.04);
        group.add(rightSole);

        group.castShadow = true;
        group.receiveShadow = true;

        if (texture) {
            this.applyTextureToGroup(group, texture);
        }

        return group;
    }

    createHeelsModel(color, texture) {
        const group = new THREE.Group();
        const material = new THREE.MeshLambertMaterial({
            color: this.hexStringToNumber(color),
            transparent: true,
            opacity: 0.95
        });

        // 鞋跟
        const heelGeometry = new THREE.CylinderGeometry(0.015, 0.02, 0.08, 4);
        const heelMaterial = new THREE.MeshLambertMaterial({ color: this.hexStringToNumber(color) });

        const leftHeel = new THREE.Mesh(heelGeometry, heelMaterial);
        leftHeel.position.set(-0.06, -0.54, -0.02);
        group.add(leftHeel);

        const rightHeel = new THREE.Mesh(heelGeometry, heelMaterial);
        rightHeel.position.set(0.06, -0.54, -0.02);
        group.add(rightHeel);

        // 鞋面
        const upperGeometry = new THREE.BoxGeometry(0.07, 0.03, 0.12);

        const leftUpper = new THREE.Mesh(upperGeometry, material);
        leftUpper.position.set(-0.06, -0.48, 0.04);
        group.add(leftUpper);

        const rightUpper = new THREE.Mesh(upperGeometry, material);
        rightUpper.position.set(0.06, -0.48, 0.04);
        group.add(rightUpper);

        group.castShadow = true;
        group.receiveShadow = true;

        if (texture) {
            this.applyTextureToGroup(group, texture);
        }

        return group;
    }

    createFlatsModel(color, texture) {
        const group = new THREE.Group();
        const material = new THREE.MeshLambertMaterial({
            color: this.hexStringToNumber(color),
            transparent: true,
            opacity: 0.95
        });

        // 鞋底（平底）
        const soleGeometry = new THREE.BoxGeometry(0.07, 0.01, 0.14);
        const soleMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });

        const leftSole = new THREE.Mesh(soleGeometry, soleMaterial);
        leftSole.position.set(-0.06, -0.555, 0.04);
        group.add(leftSole);

        const rightSole = new THREE.Mesh(soleGeometry, soleMaterial);
        rightSole.position.set(0.06, -0.555, 0.04);
        group.add(rightSole);

        // 鞋面
        const upperGeometry = new THREE.BoxGeometry(0.06, 0.025, 0.12);

        const leftUpper = new THREE.Mesh(upperGeometry, material);
        leftUpper.position.set(-0.06, -0.535, 0.04);
        group.add(leftUpper);

        const rightUpper = new THREE.Mesh(upperGeometry, material);
        rightUpper.position.set(0.06, -0.535, 0.04);
        group.add(rightUpper);

        group.castShadow = true;
        group.receiveShadow = true;

        if (texture) {
            this.applyTextureToGroup(group, texture);
        }

        return group;
    }

    // 其他几何体创建方法（简化版本）
    createBasicTopGeometry() {
        return new THREE.CylinderGeometry(0.16, 0.13, 0.4, 8);
    }

    createSweaterGeometry() {
        return new THREE.CylinderGeometry(0.17, 0.14, 0.42, 8);
    }

    createHoodieGeometry() {
        const group = new THREE.Group();
        const body = new THREE.Mesh(
            new THREE.CylinderGeometry(0.17, 0.14, 0.4, 8),
            this.materials.cotton
        );
        body.position.y = 0;
        group.add(body);

        // 帽子
        const hood = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 8, 6),
            this.materials.cotton
        );
        hood.position.y = 0.75;
        hood.scale.set(1.2, 0.8, 1);
        group.add(hood);

        return group;
    }

    createTrousersGeometry() {
        return new THREE.CylinderGeometry(0.1, 0.07, 0.35, 8);
    }

    createShortsGeometry() {
        return new THREE.CylinderGeometry(0.1, 0.08, 0.15, 8);
    }

    createSkirtGeometry() {
        return new THREE.CylinderGeometry(0.12, 0.18, 0.25, 8);
    }

    createBasicBottomGeometry() {
        return new THREE.CylinderGeometry(0.1, 0.08, 0.3, 8);
    }

    createCasualDressGeometry() {
        return new THREE.CylinderGeometry(0.15, 0.18, 0.5, 8);
    }

    createElegantDressGeometry() {
        return new THREE.CylinderGeometry(0.14, 0.25, 0.6, 8);
    }

    createPartyDressGeometry() {
        return new THREE.CylinderGeometry(0.16, 0.3, 0.4, 8);
    }

    createBasicDressGeometry() {
        return new THREE.CylinderGeometry(0.15, 0.2, 0.55, 8);
    }

    createJacketGeometry() {
        return new THREE.CylinderGeometry(0.18, 0.15, 0.45, 8);
    }

    createCoatGeometry() {
        return new THREE.CylinderGeometry(0.19, 0.16, 0.6, 8);
    }

    createBlazerGeometry() {
        return new THREE.CylinderGeometry(0.16, 0.13, 0.35, 8);
    }

    createBasicOuterGeometry() {
        return new THREE.CylinderGeometry(0.18, 0.15, 0.5, 8);
    }

    createBasicShoesModel(color, texture) {
        return this.createSneakersModel(color, texture);
    }

    // 纹理应用方法
    applyTexture(mesh, textureUrl) {
        this.textureLoader.load(textureUrl, (texture) => {
            const material = mesh.material.clone();
            material.map = texture;
            material.needsUpdate = true;
            mesh.material = material;
        });
    }

    applyTextureToGroup(group, textureUrl) {
        this.textureLoader.load(textureUrl, (texture) => {
            group.traverse((child) => {
                if (child.isMesh && child.material) {
                    const material = child.material.clone();
                    material.map = texture;
                    material.needsUpdate = true;
                    child.material = material;
                }
            });
        });
    }

    // 工具方法
    hexStringToNumber(hex) {
        return parseInt(hex.replace('#', '0x'));
    }

    // 预设服装模板
    getClothingTemplates() {
        return {
            tops: [
                { id: 'white_tshirt', name: '白色T恤', type: 'tshirt', color: '#FFFFFF' },
                { id: 'blue_shirt', name: '蓝色衬衫', type: 'shirt', color: '#87CEEB' },
                { id: 'red_sweater', name: '红色毛衣', type: 'sweater', color: '#FF6B6B' },
                { id: 'black_hoodie', name: '黑色卫衣', type: 'hoodie', color: '#2C2C2C' }
            ],
            bottoms: [
                { id: 'blue_jeans', name: '蓝色牛仔裤', type: 'jeans', color: '#4169E1' },
                { id: 'black_trousers', name: '黑色西裤', type: 'trousers', color: '#000000' },
                { id: 'khaki_shorts', name: '卡其短裤', type: 'shorts', color: '#D2B48C' },
                { id: 'pleated_skirt', name: '百褶裙', type: 'skirt', color: '#800080' }
            ],
            dresses: [
                { id: 'casual_dress', name: '休闲连衣裙', type: 'dress', color: '#FFB6C1' }
            ]
        };
    }
}