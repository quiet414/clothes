// 3D Avatar系统 - 模拟人生风格的高级虚拟试衣间
class Avatar3DSims {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.avatarGroup = null;
        this.bodyParts = {};
        this.clothingItems = {};

        // 模拟人生风格参数
        this.simsStyle = {
            bodyProportions: {
                headSize: 0.14,
                neckLength: 0.05,
                torsoLength: 0.65,
                armLength: 0.45,
                legLength: 0.6
            },
            facialFeatures: {
                eyeSize: 0.025,
                noseSize: 0.015,
                mouthWidth: 0.04
            },
            muscleDefinition: 0.3, // 肌肉线条明显程度
            bodyType: 'athletic' // athletic, curvy, slim
        };

        this.init();
    }

    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLighting();
        this.setupControls();
        this.createSimsAvatar();
        this.animate();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        // 模拟人生风格的渐变背景
        this.scene.background = new THREE.Color(0xf8f0ff);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 1.6, 3.2);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0xf8f0ff, 1);
        this.container.appendChild(this.renderer.domElement);
    }

    setupLighting() {
        // 模拟人生风格的光照 - 更加柔和自然
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        // 主光源 - 模拟自然光
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(3, 8, 3);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 4096;
        mainLight.shadow.mapSize.height = 4096;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 50;
        this.scene.add(mainLight);

        // 填充光 - 减少阴影硬度
        const fillLight = new THREE.DirectionalLight(0xfff0f5, 0.5);
        fillLight.position.set(-3, 3, -3);
        this.scene.add(fillLight);

        // 边缘光 - 增加立体感
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
        rimLight.position.set(0, 5, -5);
        this.scene.add(rimLight);
    }

    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.minDistance = 2.5;
        this.controls.maxDistance = 8;
        this.controls.maxPolarAngle = Math.PI / 2.1;
        this.controls.target.set(0, 1.6, 0);
    }

    createSimsAvatar() {
        this.avatarGroup = new THREE.Group();

        // 创建模拟人生风格的人体
        this.createSimsBody();
        this.createSimsHead();
        this.createSimsArms();
        this.createSimsLegs();
        this.createSimsHair();

        this.scene.add(this.avatarGroup);
        this.updateAvatarProportions();
    }

    createSimsBody() {
        // 模拟人生风格的身体 - 更加真实的人体比例
        const skinMaterial = new THREE.MeshPhongMaterial({
            color: 0xffdbac,
            shininess: 30,
            specular: 0x111111
        });

        // 颈部
        const neckGeometry = new THREE.CylinderGeometry(0.03, 0.035, 0.08, 12);
        this.bodyParts.neck = new THREE.Mesh(neckGeometry, skinMaterial);
        this.bodyParts.neck.position.y = 0.72;
        this.avatarGroup.add(this.bodyParts.neck);

        // 躯干 - 模拟人生风格的身体比例
        const torsoGeometry = new THREE.CylinderGeometry(0.16, 0.12, 0.55, 12);
        this.bodyParts.torso = new THREE.Mesh(torsoGeometry, skinMaterial);
        this.bodyParts.torso.position.y = 0.35;
        this.bodyParts.torso.castShadow = true;
        this.avatarGroup.add(this.bodyParts.torso);

        // 胸部 - 更加自然的形状
        const chestGeometry = new THREE.SphereGeometry(0.09, 12, 8);
        this.bodyParts.chest = new THREE.Mesh(chestGeometry, skinMaterial);
        this.bodyParts.chest.position.y = 0.52;
        this.bodyParts.chest.scale.set(1.2, 0.8, 0.9);
        this.bodyParts.chest.castShadow = true;
        this.avatarGroup.add(this.bodyParts.chest);

        // 腰部 - 更加纤细
        const waistGeometry = new THREE.CylinderGeometry(0.07, 0.09, 0.15, 12);
        this.bodyParts.waist = new THREE.Mesh(waistGeometry, skinMaterial);
        this.bodyParts.waist.position.y = 0.12;
        this.bodyParts.waist.castShadow = true;
        this.avatarGroup.add(this.bodyParts.waist);

        // 臀部 - 更加自然的曲线
        const hipGeometry = new THREE.SphereGeometry(0.11, 12, 8);
        this.bodyParts.hips = new THREE.Mesh(hipGeometry, skinMaterial);
        this.bodyParts.hips.position.y = -0.05;
        this.bodyParts.hips.scale.set(1.3, 0.7, 1.1);
        this.bodyParts.hips.castShadow = true;
        this.avatarGroup.add(this.bodyParts.hips);
    }

    createSimsHead() {
        // 模拟人生风格的头部 - 更加卡通化但真实
        const skinMaterial = new THREE.MeshPhongMaterial({
            color: 0xffdbac,
            shininess: 50,
            specular: 0x222222
        });

        // 头部主体 - 椭圆形更真实
        const headGeometry = new THREE.SphereGeometry(0.14, 20, 16);
        this.bodyParts.head = new THREE.Mesh(headGeometry, skinMaterial);
        this.bodyParts.head.position.y = 0.85;
        this.bodyParts.head.scale.set(1, 1.1, 0.95); // 稍微拉长
        this.bodyParts.head.castShadow = true;
        this.avatarGroup.add(this.bodyParts.head);

        // 模拟人生风格的脸部特征
        this.createSimsFacialFeatures();
    }

    createSimsFacialFeatures() {
        const skinMaterial = new THREE.MeshPhongMaterial({
            color: 0xffdbac,
            shininess: 80
        });

        const eyeMaterial = new THREE.MeshPhongMaterial({
            color: 0x4a90e2, // 蓝色眼睛
            shininess: 100
        });

        // 眼睛 - 模拟人生风格的大眼睛
        const eyeGeometry = new THREE.SphereGeometry(0.02, 12, 8);

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.05, 0.88, 0.12);
        leftEye.scale.set(1, 0.7, 0.5);
        this.avatarGroup.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.05, 0.88, 0.12);
        rightEye.scale.set(1, 0.7, 0.5);
        this.avatarGroup.add(rightEye);

        // 眼眉
        const eyebrowMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
        const eyebrowGeometry = new THREE.BoxGeometry(0.06, 0.01, 0.02);

        const leftEyebrow = new THREE.Mesh(eyebrowGeometry, eyebrowMaterial);
        leftEyebrow.position.set(-0.05, 0.91, 0.13);
        this.avatarGroup.add(leftEyebrow);

        const rightEyebrow = new THREE.Mesh(eyebrowGeometry, eyebrowMaterial);
        rightEyebrow.position.set(0.05, 0.91, 0.13);
        this.avatarGroup.add(rightEyebrow);

        // 鼻子 - 更加细致的模拟人生风格
        const noseGeometry = new THREE.ConeGeometry(0.012, 0.025, 8);
        const nose = new THREE.Mesh(noseGeometry, skinMaterial);
        nose.position.set(0, 0.83, 0.14);
        nose.rotation.x = Math.PI / 2;
        this.avatarGroup.add(nose);

        // 嘴巴 - 微笑的表情
        const mouthGeometry = new THREE.TorusGeometry(0.025, 0.004, 6, 16, Math.PI);
        const mouthMaterial = new THREE.MeshPhongMaterial({
            color: 0xff69b4,
            shininess: 100
        });
        const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        mouth.position.set(0, 0.76, 0.13);
        mouth.rotation.x = Math.PI;
        this.avatarGroup.add(mouth);

        // 脸颊红晕 - 模拟人生风格
        const blushMaterial = new THREE.MeshPhongMaterial({
            color: 0xffb6c1,
            transparent: true,
            opacity: 0.6
        });
        const blushGeometry = new THREE.SphereGeometry(0.02, 8, 6);

        const leftBlush = new THREE.Mesh(blushGeometry, blushMaterial);
        leftBlush.position.set(-0.08, 0.81, 0.11);
        leftBlush.scale.set(1, 0.5, 0.3);
        this.avatarGroup.add(leftBlush);

        const rightBlush = new THREE.Mesh(blushGeometry, blushMaterial);
        rightBlush.position.set(0.08, 0.81, 0.11);
        rightBlush.scale.set(1, 0.5, 0.3);
        this.avatarGroup.add(rightBlush);
    }

    createSimsArms() {
        const skinMaterial = new THREE.MeshPhongMaterial({
            color: 0xffdbac,
            shininess: 30
        });

        // 上臂 - 有肌肉线条
        const upperArmGeometry = new THREE.CylinderGeometry(0.035, 0.03, 0.28, 10);

        this.bodyParts.leftUpperArm = new THREE.Mesh(upperArmGeometry, skinMaterial);
        this.bodyParts.leftUpperArm.position.set(-0.18, 0.42, 0);
        this.bodyParts.leftUpperArm.castShadow = true;
        this.avatarGroup.add(this.bodyParts.leftUpperArm);

        this.bodyParts.rightUpperArm = new THREE.Mesh(upperArmGeometry, skinMaterial);
        this.bodyParts.rightUpperArm.position.set(0.18, 0.42, 0);
        this.bodyParts.rightUpperArm.castShadow = true;
        this.avatarGroup.add(this.bodyParts.rightUpperArm);

        // 下臂
        const lowerArmGeometry = new THREE.CylinderGeometry(0.03, 0.025, 0.22, 10);

        this.bodyParts.leftLowerArm = new THREE.Mesh(lowerArmGeometry, skinMaterial);
        this.bodyParts.leftLowerArm.position.set(-0.18, 0.15, 0);
        this.bodyParts.leftLowerArm.castShadow = true;
        this.avatarGroup.add(this.bodyParts.leftLowerArm);

        this.bodyParts.rightLowerArm = new THREE.Mesh(lowerArmGeometry, skinMaterial);
        this.bodyParts.rightLowerArm.position.set(0.18, 0.15, 0);
        this.bodyParts.rightLowerArm.castShadow = true;
        this.avatarGroup.add(this.bodyParts.rightLowerArm);

        // 手 - 更加细致
        const handGeometry = new THREE.SphereGeometry(0.03, 10, 8);

        this.bodyParts.leftHand = new THREE.Mesh(handGeometry, skinMaterial);
        this.bodyParts.leftHand.position.set(-0.18, 0.01, 0);
        this.bodyParts.leftHand.scale.set(0.8, 0.6, 1.2);
        this.bodyParts.leftHand.castShadow = true;
        this.avatarGroup.add(this.bodyParts.leftHand);

        this.bodyParts.rightHand = new THREE.Mesh(handGeometry, skinMaterial);
        this.bodyParts.rightHand.position.set(0.18, 0.01, 0);
        this.bodyParts.rightHand.scale.set(0.8, 0.6, 1.2);
        this.bodyParts.rightHand.castShadow = true;
        this.avatarGroup.add(this.bodyParts.rightHand);
    }

    createSimsLegs() {
        const skinMaterial = new THREE.MeshPhongMaterial({
            color: 0xffdbac,
            shininess: 30
        });

        // 大腿 - 有肌肉线条
        const thighGeometry = new THREE.CylinderGeometry(0.055, 0.045, 0.32, 10);

        this.bodyParts.leftThigh = new THREE.Mesh(thighGeometry, skinMaterial);
        this.bodyParts.leftThigh.position.set(-0.07, -0.15, 0);
        this.bodyParts.leftThigh.castShadow = true;
        this.avatarGroup.add(this.bodyParts.leftThigh);

        this.bodyParts.rightThigh = new THREE.Mesh(thighGeometry, skinMaterial);
        this.bodyParts.rightThigh.position.set(0.07, -0.15, 0);
        this.bodyParts.rightThigh.castShadow = true;
        this.avatarGroup.add(this.bodyParts.rightThigh);

        // 小腿
        const calfGeometry = new THREE.CylinderGeometry(0.04, 0.035, 0.3, 10);

        this.bodyParts.leftCalf = new THREE.Mesh(calfGeometry, skinMaterial);
        this.bodyParts.leftCalf.position.set(-0.07, -0.5, 0);
        this.bodyParts.leftCalf.castShadow = true;
        this.avatarGroup.add(this.bodyParts.leftCalf);

        this.bodyParts.rightCalf = new THREE.Mesh(calfGeometry, skinMaterial);
        this.bodyParts.rightCalf.position.set(0.07, -0.5, 0);
        this.bodyParts.rightCalf.castShadow = true;
        this.avatarGroup.add(this.bodyParts.rightCalf);

        // 脚 - 更加真实
        const footGeometry = new THREE.BoxGeometry(0.07, 0.025, 0.14);
        const footMaterial = new THREE.MeshPhongMaterial({
            color: 0xffdbac,
            shininess: 30
        });

        this.bodyParts.leftFoot = new THREE.Mesh(footGeometry, footMaterial);
        this.bodyParts.leftFoot.position.set(-0.07, -0.68, 0.05);
        this.bodyParts.leftFoot.castShadow = true;
        this.avatarGroup.add(this.bodyParts.leftFoot);

        this.bodyParts.rightFoot = new THREE.Mesh(footGeometry, footMaterial);
        this.bodyParts.rightFoot.position.set(0.07, -0.68, 0.05);
        this.bodyParts.rightFoot.castShadow = true;
        this.avatarGroup.add(this.bodyParts.rightFoot);
    }

    createSimsHair() {
        // 模拟人生风格的发型
        const hairMaterial = new THREE.MeshPhongMaterial({
            color: 0x8b4513, // 棕色头发
            shininess: 80
        });

        // 头发主体
        const hairGeometry = new THREE.SphereGeometry(0.15, 16, 12);
        this.bodyParts.hair = new THREE.Mesh(hairGeometry, hairMaterial);
        this.bodyParts.hair.position.y = 0.95;
        this.bodyParts.hair.scale.set(1.1, 0.6, 1.05);
        this.bodyParts.hair.castShadow = true;
        this.avatarGroup.add(this.bodyParts.hair);

        // 刘海
        const bangsGeometry = new THREE.BoxGeometry(0.2, 0.08, 0.1);
        this.bodyParts.bangs = new THREE.Mesh(bangsGeometry, hairMaterial);
        this.bodyParts.bangs.position.set(0, 0.92, 0.12);
        this.avatarGroup.add(this.bodyParts.bangs);
    }

    updateAvatarProportions(userProfile = null) {
        if (!userProfile) {
            userProfile = {
                height: 170,
                weight: 60,
                shoulder: 42,
                chest: 90,
                waist: 70,
                hip: 95
            };
        }

        // 模拟人生风格的身体比例调整
        const heightScale = userProfile.height / 170;
        const weightScale = userProfile.weight / 60;

        // 调整整体高度
        this.avatarGroup.scale.y = heightScale;

        // 根据体重调整身体宽度
        const bodyScale = Math.min(weightScale, 1.5);

        // 调整身体各部位
        if (this.bodyParts.torso) {
            this.bodyParts.torso.scale.x = bodyScale;
            this.bodyParts.torso.scale.z = bodyScale * 0.9;
        }

        if (this.bodyParts.chest) {
            const chestScale = userProfile.chest / 90;
            this.bodyParts.chest.scale.x = chestScale * bodyScale;
            this.bodyParts.chest.scale.z = chestScale * 0.8;
        }

        if (this.bodyParts.waist) {
            const waistScale = userProfile.waist / 70;
            this.bodyParts.waist.scale.x = waistScale * bodyScale * 0.9;
            this.bodyParts.waist.scale.z = waistScale * bodyScale * 0.8;
        }

        if (this.bodyParts.hips) {
            const hipScale = userProfile.hip / 95;
            this.bodyParts.hips.scale.x = hipScale * bodyScale * 1.1;
            this.bodyParts.hips.scale.z = hipScale * bodyScale;
        }

        // 调整手臂和腿部
        const shoulderScale = userProfile.shoulder / 42;
        if (this.bodyParts.leftUpperArm) {
            this.bodyParts.leftUpperArm.position.x = -0.18 * shoulderScale;
            this.bodyParts.leftUpperArm.scale.x = bodyScale;
        }
        if (this.bodyParts.rightUpperArm) {
            this.bodyParts.rightUpperArm.position.x = 0.18 * shoulderScale;
            this.bodyParts.rightUpperArm.scale.x = bodyScale;
        }

        this.updateDisplayStats(userProfile);
    }

    updateDisplayStats(userProfile) {
        const heightDisplay = document.getElementById('display-height');
        const weightDisplay = document.getElementById('display-weight');

        if (heightDisplay) heightDisplay.textContent = userProfile.height;
        if (weightDisplay) weightDisplay.textContent = userProfile.weight;
    }

    // 其他方法保持与原始3d-avatar.js相同...
    addClothing(clothingItem) {
        this.removeClothing(clothingItem.type);

        let clothingMesh = null;

        switch (clothingItem.type) {
            case 'top':
                clothingMesh = this.createTopClothing(clothingItem);
                break;
            case 'bottom':
                clothingMesh = this.createBottomClothing(clothingItem);
                break;
            case 'dress':
                clothingMesh = this.createDressClothing(clothingItem);
                break;
            case 'outer':
                clothingMesh = this.createOuterClothing(clothingItem);
                break;
            case 'shoes':
                clothingMesh = this.createShoesClothing(clothingItem);
                break;
        }

        if (clothingMesh) {
            this.clothingItems[clothingItem.type] = clothingMesh;
            this.avatarGroup.add(clothingMesh);
        }
    }

    createTopClothing(clothingItem) {
        const topGeometry = new THREE.CylinderGeometry(0.17, 0.14, 0.42, 12);
        const topMaterial = new THREE.MeshPhongMaterial({
            color: this.hexStringToNumber(clothingItem.color || '#FFFFFF'),
            transparent: true,
            opacity: 0.95,
            shininess: 30
        });

        const topMesh = new THREE.Mesh(topGeometry, topMaterial);
        topMesh.position.y = 0.35;
        topMesh.castShadow = true;

        if (clothingItem.image) {
            this.applyTextureToMesh(topMesh, clothingItem.image);
        }

        return topMesh;
    }

    createBottomClothing(clothingItem) {
        const bottomGeometry = new THREE.CylinderGeometry(0.11, 0.08, 0.35, 12);
        const bottomMaterial = new THREE.MeshPhongMaterial({
            color: this.hexStringToNumber(clothingItem.color || '#0000FF'),
            transparent: true,
            opacity: 0.95,
            shininess: 20
        });

        const bottomMesh = new THREE.Mesh(bottomGeometry, bottomMaterial);
        bottomMesh.position.y = -0.15;
        bottomMesh.castShadow = true;

        if (clothingItem.image) {
            this.applyTextureToMesh(bottomMesh, clothingItem.image);
        }

        return bottomMesh;
    }

    createDressClothing(clothingItem) {
        const dressGeometry = new THREE.CylinderGeometry(0.16, 0.22, 0.6, 12);
        const dressMaterial = new THREE.MeshPhongMaterial({
            color: this.hexStringToNumber(clothingItem.color || '#FF69B4'),
            transparent: true,
            opacity: 0.95,
            shininess: 50,
            side: THREE.DoubleSide
        });

        const dressMesh = new THREE.Mesh(dressGeometry, dressMaterial);
        dressMesh.position.y = 0.05;
        dressMesh.castShadow = true;

        if (clothingItem.image) {
            this.applyTextureToMesh(dressMesh, clothingItem.image);
        }

        return dressMesh;
    }

    createOuterClothing(clothingItem) {
        const outerGeometry = new THREE.CylinderGeometry(0.19, 0.16, 0.52, 12);
        const outerMaterial = new