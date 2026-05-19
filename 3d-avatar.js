// 3D Avatar系统 - 模拟人生风格的高级虚拟试衣间
class Avatar3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.avatarGroup = null;
        this.bodyParts = {};
        this.clothingItems = {};
        this.clothingData = {}; // 存储原始衣服数据，用于重绘
        this.isRefreshing = false;

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
            }
        };

        this.init();
    }

    init() {
        console.log('[Avatar3D] Initializing avatar system...');
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLighting();
        this.setupControls();
        this.createAvatar();
        this.animate();
        console.log('[Avatar3D] Initialization complete.');
    }

    setupScene() {
        this.scene = new THREE.Scene();
        // 更加柔和的背景色
        this.scene.background = new THREE.Color(0xf8f0ff);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        // 对焦在角色躯干附近，避免镜头看“太高”导致角色不可见
        this.camera.position.set(0, 0.95, 2.8);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);
    }

    setupLighting() {
        // 更加自然的多光源系统
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(3, 8, 3);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 4096;
        mainLight.shadow.mapSize.height = 4096;
        this.scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0xfff0f5, 0.5);
        fillLight.position.set(-3, 3, -3);
        this.scene.add(fillLight);

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
        this.controls.target.set(0, 0.65, 0);
    }

    createAvatar() {
        this.avatarGroup = new THREE.Group();

        // 创建各部位
        this.createSimsBody();
        this.createSimsHead();
        this.createSimsArms();
        this.createSimsLegs();
        this.createSimsHair();

        this.scene.add(this.avatarGroup);
        
        // 终极强制：遍历所有部位，强制 renderOrder = 0
        this.avatarGroup.traverse((child) => {
            if (child.isMesh) {
                child.renderOrder = 0;
                if (child.material) {
                    child.material.depthTest = true;
                    child.material.depthWrite = true;
                    child.material.polygonOffset = false; // 身体不偏移
                }
            }
        });

        // 初始化比例
        this.updateAvatarProportions();
        
        // 初始遮罩检查
        this.updateBodyCoverage();
    }

    createSimsBody() {
        const skinMaterial = new THREE.MeshStandardMaterial({
            color: 0xffe6d5,
            roughness: 0.58,
            metalness: 0.05
        });

        const setBodyRenderOrder = (mesh) => {
            mesh.renderOrder = 0;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
        };

        // 颈部 - 变短
        const neckGeometry = new THREE.CylinderGeometry(0.034, 0.04, 0.07, 18);
        this.bodyParts.neck = new THREE.Mesh(neckGeometry, skinMaterial);
        this.bodyParts.neck.position.y = 0.76;
        setBodyRenderOrder(this.bodyParts.neck);
        this.avatarGroup.add(this.bodyParts.neck);

        // 躯干：增加细分和轻微锥度，避免“木头筒”
        const torsoGeometry = new THREE.CylinderGeometry(0.165, 0.13, 0.46, 20, 1, false);
        this.bodyParts.torso = new THREE.Mesh(torsoGeometry, skinMaterial);
        this.bodyParts.torso.position.y = 0.47;
        setBodyRenderOrder(this.bodyParts.torso);
        this.avatarGroup.add(this.bodyParts.torso);

        // 胸廓：可爱但保留体积过渡
        const chestGeometry = new THREE.SphereGeometry(0.12, 20, 14);
        this.bodyParts.chest = new THREE.Mesh(chestGeometry, skinMaterial);
        this.bodyParts.chest.position.y = 0.62;
        this.bodyParts.chest.scale.set(1.18, 0.82, 0.96);
        setBodyRenderOrder(this.bodyParts.chest);
        this.avatarGroup.add(this.bodyParts.chest);

        const waistGeometry = new THREE.CylinderGeometry(0.085, 0.108, 0.12, 18);
        this.bodyParts.waist = new THREE.Mesh(waistGeometry, skinMaterial);
        this.bodyParts.waist.position.y = 0.30;
        setBodyRenderOrder(this.bodyParts.waist);
        this.avatarGroup.add(this.bodyParts.waist);

        const hipGeometry = new THREE.SphereGeometry(0.13, 20, 14);
        this.bodyParts.hips = new THREE.Mesh(hipGeometry, skinMaterial);
        this.bodyParts.hips.position.y = 0.17;
        this.bodyParts.hips.scale.set(1.24, 0.82, 1.14);
        setBodyRenderOrder(this.bodyParts.hips);
        this.avatarGroup.add(this.bodyParts.hips);

        // 肩峰与锁骨体积，弱化“直角木头肩”
        const shoulderGeo = new THREE.SphereGeometry(0.06, 16, 12);
        this.bodyParts.leftShoulder = new THREE.Mesh(shoulderGeo, skinMaterial);
        this.bodyParts.leftShoulder.position.set(-0.145, 0.62, 0);
        setBodyRenderOrder(this.bodyParts.leftShoulder);
        this.avatarGroup.add(this.bodyParts.leftShoulder);
        this.bodyParts.rightShoulder = this.bodyParts.leftShoulder.clone();
        this.bodyParts.rightShoulder.position.x = 0.145;
        this.avatarGroup.add(this.bodyParts.rightShoulder);

        // 轻量腹部体块，形成自然线条
        const absGeo = new THREE.SphereGeometry(0.075, 14, 10);
        this.bodyParts.abs = new THREE.Mesh(absGeo, skinMaterial);
        this.bodyParts.abs.position.set(0, 0.37, 0.1);
        this.bodyParts.abs.scale.set(1.05, 0.75, 0.45);
        setBodyRenderOrder(this.bodyParts.abs);
        this.avatarGroup.add(this.bodyParts.abs);
    }

    createSimsHead() {
        // 卡通风格皮肤材质：更粉嫩、更哑光
        const skinMaterial = new THREE.MeshStandardMaterial({
            color: 0xffe6d5,
            roughness: 0.52,
            metalness: 0.04
        });

        const headGeometry = new THREE.SphereGeometry(0.155, 36, 28);
        this.bodyParts.head = new THREE.Mesh(headGeometry, skinMaterial);
        this.bodyParts.head.position.y = 0.87;
        this.bodyParts.head.scale.set(1.02, 1.08, 0.98);
        this.bodyParts.head.renderOrder = 10; // 头部始终在最上层
        this.bodyParts.head.castShadow = true;
        this.avatarGroup.add(this.bodyParts.head);

        this.createSimsFacialFeatures(skinMaterial);
    }


    createSimsFacialFeatures(skinMaterial) {
        // 卡通大眼睛材质
        const eyeWhiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const pupilMaterial = new THREE.MeshPhongMaterial({ color: 0x4a2c2c, shininess: 100 }); // 深咖啡色瞳孔
        const eyeHighlightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

        const eyeGeometry = new THREE.SphereGeometry(0.03, 16, 12);
        const pupilGeometry = new THREE.SphereGeometry(0.014, 16, 12);
        const highlightGeometry = new THREE.SphereGeometry(0.006, 8, 8);

        const setFacialRenderOrder = (group) => {
            group.traverse(child => {
                if (child.isMesh) child.renderOrder = 11; // 比头部(10)稍高
            });
        };

        // 左眼组
        const leftEyeGroup = new THREE.Group();
        const leftEyeWhite = new THREE.Mesh(eyeGeometry, eyeWhiteMaterial);
        leftEyeWhite.scale.set(1, 1.2, 0.4);
        
        const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        leftPupil.position.set(0, 0, 0.02);
        leftPupil.scale.set(0.8, 1, 0.5);

        const leftHighlight = new THREE.Mesh(highlightGeometry, eyeHighlightMaterial);
        leftHighlight.position.set(0.008, 0.008, 0.03);

        leftEyeGroup.add(leftEyeWhite, leftPupil, leftHighlight);
        leftEyeGroup.position.set(-0.058, 0.885, 0.125);
        leftEyeGroup.rotation.y = -0.1;
        setFacialRenderOrder(leftEyeGroup);
        this.avatarGroup.add(leftEyeGroup);

        // 右眼组
        const rightEyeGroup = leftEyeGroup.clone();
        rightEyeGroup.position.x = 0.06;
        rightEyeGroup.rotation.y = 0.1;
        // clone 不会复制 renderOrder，需要重新设置或在 clone 后遍历
        setFacialRenderOrder(rightEyeGroup);
        this.avatarGroup.add(rightEyeGroup);

        // 小巧的鼻子
        const noseGeometry = new THREE.SphereGeometry(0.007, 8, 8);
        const nose = new THREE.Mesh(noseGeometry, skinMaterial);
        nose.position.set(0, 0.835, 0.147);
        nose.renderOrder = 11;
        this.avatarGroup.add(nose);

        // 甜美小嘴
        const mouthGeometry = new THREE.TorusGeometry(0.014, 0.0045, 8, 16, Math.PI);
        const mouthMaterial = new THREE.MeshPhongMaterial({ color: 0xff82ab, shininess: 50 }); // 樱花粉
        const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        mouth.position.set(0, 0.79, 0.145);
        mouth.rotation.x = Math.PI;
        mouth.renderOrder = 11;
        this.avatarGroup.add(mouth);

        // 添加腮红效果
        const blushGeometry = new THREE.CircleGeometry(0.025, 16);
        const blushMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffb6c1, 
            transparent: true, 
            opacity: 0.4,
            side: THREE.DoubleSide 
        });
        
        const leftBlush = new THREE.Mesh(blushGeometry, blushMaterial);
        leftBlush.position.set(-0.08, 0.83, 0.125);
        leftBlush.rotation.y = -0.2;
        leftBlush.renderOrder = 11;
        this.avatarGroup.add(leftBlush);

        const rightBlush = leftBlush.clone();
        rightBlush.position.x = 0.08;
        rightBlush.rotation.y = 0.2;
        rightBlush.renderOrder = 11;
        this.avatarGroup.add(rightBlush);
    }

    createSimsArms() {
        const skinMaterial = this.bodyParts.head.material;
        const upperArmGeometry = new THREE.CylinderGeometry(0.038, 0.03, 0.22, 14);

        const setBodyPart = (mesh) => {
            mesh.renderOrder = 0;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
                mesh.material.depthTest = true;
                mesh.material.depthWrite = true;
            }
        };

        this.bodyParts.leftUpperArm = new THREE.Mesh(upperArmGeometry, skinMaterial);
        this.bodyParts.leftUpperArm.position.set(-0.16, 0.54, 0);
        this.bodyParts.leftUpperArm.rotation.z = 0.08;
        setBodyPart(this.bodyParts.leftUpperArm);
        this.avatarGroup.add(this.bodyParts.leftUpperArm);

        this.bodyParts.rightUpperArm = new THREE.Mesh(upperArmGeometry, skinMaterial);
        this.bodyParts.rightUpperArm.position.set(0.16, 0.54, 0);
        this.bodyParts.rightUpperArm.rotation.z = -0.08;
        setBodyPart(this.bodyParts.rightUpperArm);
        this.avatarGroup.add(this.bodyParts.rightUpperArm);

        const lowerArmGeometry = new THREE.CylinderGeometry(0.03, 0.022, 0.2, 14);
        this.bodyParts.leftLowerArm = new THREE.Mesh(lowerArmGeometry, skinMaterial);
        this.bodyParts.leftLowerArm.position.set(-0.165, 0.345, 0.005);
        this.bodyParts.leftLowerArm.rotation.z = 0.06;
        setBodyPart(this.bodyParts.leftLowerArm);
        this.avatarGroup.add(this.bodyParts.leftLowerArm);

        this.bodyParts.rightLowerArm = new THREE.Mesh(lowerArmGeometry, skinMaterial);
        this.bodyParts.rightLowerArm.position.set(0.165, 0.345, 0.005);
        this.bodyParts.rightLowerArm.rotation.z = -0.06;
        setBodyPart(this.bodyParts.rightLowerArm);
        this.avatarGroup.add(this.bodyParts.rightLowerArm);

        // 手掌体积，避免“截断木棍感”
        const handGeo = new THREE.SphereGeometry(0.025, 12, 10);
        this.bodyParts.leftHand = new THREE.Mesh(handGeo, skinMaterial);
        this.bodyParts.leftHand.position.set(-0.17, 0.235, 0.01);
        this.bodyParts.leftHand.scale.set(0.95, 0.8, 0.7);
        setBodyPart(this.bodyParts.leftHand);
        this.avatarGroup.add(this.bodyParts.leftHand);
        
        this.bodyParts.rightHand = new THREE.Mesh(handGeo, skinMaterial);
        this.bodyParts.rightHand.position.set(0.17, 0.235, 0.01);
        this.bodyParts.rightHand.scale.set(0.95, 0.8, 0.7);
        setBodyPart(this.bodyParts.rightHand);
        this.avatarGroup.add(this.bodyParts.rightHand);
    }

    createSimsLegs() {
        const skinMaterial = this.bodyParts.head.material;
        const thighGeometry = new THREE.CylinderGeometry(0.058, 0.045, 0.29, 16);

        const setBodyPart = (mesh) => {
            mesh.renderOrder = 0;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
                mesh.material.depthTest = true;
                mesh.material.depthWrite = true;
            }
        };

        this.bodyParts.leftThigh = new THREE.Mesh(thighGeometry, skinMaterial);
        this.bodyParts.leftThigh.position.set(-0.065, 0.02, 0);
        this.bodyParts.leftThigh.rotation.z = 0.015;
        setBodyPart(this.bodyParts.leftThigh);
        this.avatarGroup.add(this.bodyParts.leftThigh);

        this.bodyParts.rightThigh = new THREE.Mesh(thighGeometry, skinMaterial);
        this.bodyParts.rightThigh.position.set(0.065, 0.02, 0);
        this.bodyParts.rightThigh.rotation.z = -0.015;
        setBodyPart(this.bodyParts.rightThigh);
        this.avatarGroup.add(this.bodyParts.rightThigh);

        const calfGeometry = new THREE.CylinderGeometry(0.045, 0.03, 0.26, 16);
        this.bodyParts.leftCalf = new THREE.Mesh(calfGeometry, skinMaterial);
        this.bodyParts.leftCalf.position.set(-0.065, -0.24, 0.01);
        setBodyPart(this.bodyParts.leftCalf);
        this.avatarGroup.add(this.bodyParts.leftCalf);

        this.bodyParts.rightCalf = new THREE.Mesh(calfGeometry, skinMaterial);
        this.bodyParts.rightCalf.position.set(0.065, -0.24, 0.01);
        setBodyPart(this.bodyParts.rightCalf);
        this.avatarGroup.add(this.bodyParts.rightCalf);

        // 膝部和脚踝过渡，让腿部线条更自然
        const kneeGeo = new THREE.SphereGeometry(0.032, 12, 10);
        this.bodyParts.leftKnee = new THREE.Mesh(kneeGeo, skinMaterial);
        this.bodyParts.leftKnee.position.set(-0.065, -0.10, 0.02);
        this.bodyParts.leftKnee.scale.set(1, 0.85, 0.8);
        setBodyPart(this.bodyParts.leftKnee);
        this.avatarGroup.add(this.bodyParts.leftKnee);
        
        this.bodyParts.rightKnee = new THREE.Mesh(kneeGeo, skinMaterial);
        this.bodyParts.rightKnee.position.set(0.065, -0.10, 0.02);
        this.bodyParts.rightKnee.scale.set(1, 0.85, 0.8);
        setBodyPart(this.bodyParts.rightKnee);
        this.avatarGroup.add(this.bodyParts.rightKnee);
    }



    createSimsHair() {
        const hairMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x5c3a21, // 柔和的深棕色
            shininess: 20 
        });
        
        const hairGroup = new THREE.Group();

        const setHairRenderOrder = (mesh) => {
            mesh.renderOrder = 12; // 头发在头部(10)和五官(11)之上
            mesh.castShadow = true;
        };

        // 基础发型（蓬松感）
        const baseHairGeo = new THREE.SphereGeometry(0.16, 20, 16);
        const baseHair = new THREE.Mesh(baseHairGeo, hairMaterial);
        baseHair.position.set(0, 0.95, 0);
        baseHair.scale.set(1.1, 0.85, 1.15); // 稍微加厚后脑勺
        setHairRenderOrder(baseHair);
        hairGroup.add(baseHair);

        // 添加一些可爱的刘海细节
        const bangGeo = new THREE.SphereGeometry(0.06, 12, 12);
        for(let i = 0; i < 3; i++) {
            const bang = new THREE.Mesh(bangGeo, hairMaterial);
            bang.position.set(-0.08 + i * 0.08, 0.98, 0.12);
            bang.scale.set(1, 0.6, 0.5);
            setHairRenderOrder(bang);
            hairGroup.add(bang);
        }

        // 添加双马尾（可选，增加甜美感）
        const ponyGeo = new THREE.SphereGeometry(0.08, 12, 12);
        const leftPony = new THREE.Mesh(ponyGeo, hairMaterial);
        leftPony.position.set(-0.15, 0.9, 0);
        leftPony.scale.set(0.8, 1.5, 0.8);
        setHairRenderOrder(leftPony);
        hairGroup.add(leftPony);

        const rightPony = leftPony.clone();
        rightPony.position.x = 0.15;
        setHairRenderOrder(rightPony);
        hairGroup.add(rightPony);

        this.bodyParts.hair = hairGroup;
        this.avatarGroup.add(this.bodyParts.hair);
    }

    updateAvatarProportions(userProfile = null) {
        console.log('[Avatar3D] Updating body proportions:', userProfile);
        if (!userProfile) {
            userProfile = { height: 170, weight: 60, shoulder: 42, chest: 90, waist: 70, hip: 95, skinColor: '#ffefd5', hairColor: '#5c3a21', hairStyle: 'pony' };
        }

        const heightScale = userProfile.height / 170;
        const weightScale = userProfile.weight / 60;
        const bodyScale = Math.min(weightScale, 1.55);

        // 卡通 Q 版比例：头部保持较大，身体缩放更明显
        this.avatarGroup.scale.y = heightScale;
        
        // 更新皮肤颜色
        if (userProfile.skinColor) {
            const color = new THREE.Color(userProfile.skinColor);
            [this.bodyParts.head, this.bodyParts.neck, this.bodyParts.torso, this.bodyParts.chest,
             this.bodyParts.waist, this.bodyParts.hips, this.bodyParts.abs, this.bodyParts.leftShoulder,
             this.bodyParts.rightShoulder, this.bodyParts.leftUpperArm, this.bodyParts.rightUpperArm,
             this.bodyParts.leftLowerArm, this.bodyParts.rightLowerArm, this.bodyParts.leftHand,
             this.bodyParts.rightHand, this.bodyParts.leftThigh, this.bodyParts.rightThigh,
             this.bodyParts.leftKnee, this.bodyParts.rightKnee, this.bodyParts.leftCalf,
             this.bodyParts.rightCalf].forEach(part => {
                if (part) part.material.color = color;
            });
        }

        // 更新发色和发型
        if (userProfile.hairColor || userProfile.hairStyle) {
            this.updateHair(userProfile.hairStyle, userProfile.hairColor);
        }

        if (this.bodyParts.torso) {
            this.bodyParts.torso.scale.x = bodyScale;
            this.bodyParts.torso.scale.z = bodyScale * 0.9;
        }
        if (this.bodyParts.abs) {
            this.bodyParts.abs.scale.x = 1.05 * bodyScale;
            this.bodyParts.abs.scale.z = 0.42 * (0.95 + (bodyScale - 1) * 0.4);
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

        const shoulderScale = userProfile.shoulder / 42;
        if (this.bodyParts.leftUpperArm) this.bodyParts.leftUpperArm.position.x = -0.16 * shoulderScale;
        if (this.bodyParts.rightUpperArm) this.bodyParts.rightUpperArm.position.x = 0.16 * shoulderScale;
        if (this.bodyParts.leftLowerArm) this.bodyParts.leftLowerArm.position.x = -0.165 * shoulderScale;
        if (this.bodyParts.rightLowerArm) this.bodyParts.rightLowerArm.position.x = 0.165 * shoulderScale;
        if (this.bodyParts.leftShoulder) this.bodyParts.leftShoulder.position.x = -0.145 * shoulderScale;
        if (this.bodyParts.rightShoulder) this.bodyParts.rightShoulder.position.x = 0.145 * shoulderScale;

        // 重新适配衣服，以防身材变化导致衣服不贴身
        this.refreshClothing();

        this.updateDisplayStats(userProfile);
    }

    updateHair(style, color) {
        if (this.bodyParts.hair) {
            this.avatarGroup.remove(this.bodyParts.hair);
        }

        const hairMaterial = new THREE.MeshPhongMaterial({ 
            color: new THREE.Color(color || '#5c3a21'),
            shininess: 20 
        });
        
        const hairGroup = new THREE.Group();
        
        const setHairRenderOrder = (mesh) => {
            mesh.renderOrder = 12;
            mesh.castShadow = true;
        };

        const baseHairGeo = new THREE.SphereGeometry(0.16, 20, 16);
        const baseHair = new THREE.Mesh(baseHairGeo, hairMaterial);
        baseHair.position.y = 0.95;
        baseHair.scale.set(1.1, 0.8, 1.1);
        setHairRenderOrder(baseHair);
        hairGroup.add(baseHair);

        if (style === 'pony') {
            // 双马尾
            const ponyGeo = new THREE.SphereGeometry(0.08, 12, 12);
            const leftPony = new THREE.Mesh(ponyGeo, hairMaterial);
            leftPony.position.set(-0.15, 0.9, 0);
            leftPony.scale.set(0.8, 1.5, 0.8);
            setHairRenderOrder(leftPony);
            hairGroup.add(leftPony);
            const rightPony = leftPony.clone();
            rightPony.position.x = 0.15;
            setHairRenderOrder(rightPony);
            hairGroup.add(rightPony);
        } else if (style === 'short') {
            // 短发：增加侧边发丝
            const sideHairGeo = new THREE.SphereGeometry(0.08, 12, 12);
            const leftSide = new THREE.Mesh(sideHairGeo, hairMaterial);
            leftSide.position.set(-0.12, 0.85, 0.05);
            leftSide.scale.set(0.6, 1.2, 0.8);
            setHairRenderOrder(leftSide);
            hairGroup.add(leftSide);
            const rightSide = leftSide.clone();
            rightSide.position.x = 0.12;
            setHairRenderOrder(rightSide);
            hairGroup.add(rightSide);
        } else if (style === 'long') {
            // 长发：垂到背后，解决穿模问题
            // 1. 后脑勺大面积长发
            const longHairGeo = new THREE.CylinderGeometry(0.15, 0.18, 0.55, 12, 1, false, 0, Math.PI); // 只做半圆
            const longHair = new THREE.Mesh(longHairGeo, hairMaterial);
            longHair.position.set(0, 0.65, -0.08); // 往后挪，避开躯干中心
            longHair.rotation.y = Math.PI; // 转向背面
            longHair.scale.set(1.15, 1, 0.45); // 压扁，紧贴背部，宽度增加一点
            setHairRenderOrder(longHair);
            hairGroup.add(longHair);

            // 2. 侧边发束，修饰脸型且不穿过胸部
            const sideHairGeo = new THREE.CylinderGeometry(0.045, 0.02, 0.45, 8);
            const leftSide = new THREE.Mesh(sideHairGeo, hairMaterial);
            leftSide.position.set(-0.135, 0.72, 0.04); // 稍微靠前且靠侧边
            leftSide.rotation.z = 0.15; // 稍微向外倾斜
            leftSide.rotation.x = 0.1; // 稍微向前倾斜，避开肩膀
            setHairRenderOrder(leftSide);
            hairGroup.add(leftSide);

            const rightSide = leftSide.clone();
            rightSide.position.x = 0.135;
            rightSide.rotation.z = -0.15;
            setHairRenderOrder(rightSide);
            hairGroup.add(rightSide);
        }

        // 统一刘海
        const bangGeo = new THREE.SphereGeometry(0.06, 12, 12);
        for(let i = 0; i < 3; i++) {
            const bang = new THREE.Mesh(bangGeo, hairMaterial);
            bang.position.set(-0.08 + i * 0.08, 0.98, 0.12);
            bang.scale.set(1, 0.6, 0.5);
            setHairRenderOrder(bang);
            hairGroup.add(bang);
        }

        this.bodyParts.hair = hairGroup;
        this.avatarGroup.add(this.bodyParts.hair);
    }

    updateDisplayStats(userProfile) {
        const heightDisplay = document.getElementById('display-height');
        const weightDisplay = document.getElementById('display-weight');
        if (heightDisplay) heightDisplay.textContent = userProfile.height;
        if (weightDisplay) weightDisplay.textContent = userProfile.weight;
    }

    addClothing(clothingItem) {
        console.log(`[Avatar3D] Adding clothing: ${clothingItem.type}`, clothingItem);
        // 规则：连衣裙与“上衣/下装”互斥，确保衣服是衣服、裤子是裤子
        if (clothingItem.type === 'dress') {
            this.removeClothing('top');
            this.removeClothing('bottom');
            this.removeClothing('outer');
        } else if (clothingItem.type === 'top' || clothingItem.type === 'bottom') {
            this.removeClothing('dress');
        }

        this.removeClothing(clothingItem.type, true); // 移除旧的但保留数据（避免重绘死循环）
        this.clothingData[clothingItem.type] = clothingItem; // 存一份数据用于重绘
        
        let clothingMesh = null;

        switch (clothingItem.type) {
            case 'top': clothingMesh = this.createTopClothing(clothingItem); break;
            case 'bottom': clothingMesh = this.createBottomClothing(clothingItem); break;
            case 'dress': clothingMesh = this.createDressClothing(clothingItem); break;
            case 'outer': clothingMesh = this.createOuterClothing(clothingItem); break;
            case 'shoes': clothingMesh = this.createShoesClothing(clothingItem); break;
        }

        if (clothingMesh) {
            // 应用终极穿模优化：强制衣服 renderOrder = 5 (身体0, 头10)
            clothingMesh.traverse((child) => {
                if (child.isMesh) {
                    child.renderOrder = 5; // 衣服在身体(0)和头部(10)之间
                    if (child.material) {
                        child.material.polygonOffset = true;
                        child.material.polygonOffsetFactor = -1.0; // 降低偏移系数，使其更贴合
                        child.material.polygonOffsetUnits = -1.0;
                        child.material.depthTest = true;
                        child.material.depthWrite = true;
                        child.material.transparent = false;
                        child.material.side = THREE.DoubleSide; // 双面渲染，防止由于法线问题出现的缝隙
                        child.material.needsUpdate = true;
                    }
                }
            });
            this.clothingItems[clothingItem.type] = clothingMesh;
            this.avatarGroup.add(clothingMesh);
        }

        this.updateBodyCoverage();
        console.log(`[Avatar3D] Clothing added: ${clothingItem.type}`);
    }


    createTopClothing(clothingItem) {
        // 多段式上衣：由胸、躯干、腰三段拼接，实现极致贴合
        const group = new THREE.Group();
        const baseColor = this.hexStringToNumber(clothingItem.color || '#FFFFFF');
        const mat = new THREE.MeshStandardMaterial({
            color: baseColor,
            roughness: 0.52,
            metalness: 0.03,
            side: THREE.DoubleSide
        });

        const isShort = clothingItem.length === 'short';

        // 1. 胸部部分 (匹配 bodyParts.chest)
        if (this.bodyParts.chest) {
            const chestGeo = new THREE.SphereGeometry(0.12, 32, 24); 
            const chestMesh = new THREE.Mesh(chestGeo, mat);
            chestMesh.position.copy(this.bodyParts.chest.position);
            chestMesh.scale.copy(this.bodyParts.chest.scale);
            chestMesh.scale.multiplyScalar(1.02); // 减小冗余，从 1.04 降到 1.02
            group.add(chestMesh);
        }

        // 2. 躯干核心 (匹配 bodyParts.torso)
        if (this.bodyParts.torso) {
            const torsoGeo = new THREE.CylinderGeometry(0.165, 0.13, 0.46, 32); // 增加高度 0.44 -> 0.46
            const torsoMesh = new THREE.Mesh(torsoGeo, mat);
            torsoMesh.position.copy(this.bodyParts.torso.position);
            torsoMesh.scale.copy(this.bodyParts.torso.scale);
            torsoMesh.scale.x *= 1.02; // 减小冗余，从 1.05 降到 1.02
            torsoMesh.scale.z *= 1.02;
            group.add(torsoMesh);
        }

        // 3. 腰部区域 (匹配 bodyParts.waist)
        if (this.bodyParts.waist) {
            const waistGeo = new THREE.CylinderGeometry(0.085, 0.108, 0.14, 32); // 增加高度 0.12 -> 0.14
            const waistMesh = new THREE.Mesh(waistGeo, mat);
            waistMesh.position.copy(this.bodyParts.waist.position);
            waistMesh.scale.copy(this.bodyParts.waist.scale);
            waistMesh.scale.x *= 1.02; // 减小冗余，从 1.06 降到 1.02
            waistMesh.scale.z *= 1.02;
            group.add(waistMesh);
        }

        // 4. 领口：位置调低，确保不遮脸
        const collarGeo = new THREE.TorusGeometry(0.095, 0.015, 12, 32);
        const collar = new THREE.Mesh(collarGeo, mat);
        collar.rotation.x = Math.PI / 2;
        // 胸部 y=0.62，躯干 y=0.47+0.23=0.7。领口设在 0.69 处，比脖子(0.725)低
        collar.position.set(0, 0.69, 0.02); 
        collar.scale.set(1.0, 0.8, 0.6);
        group.add(collar);

        // 5. 袖子：跟随大臂角度
        // 如果是短袖，长度减半 (0.22 -> 0.11)
        const sleeveHeight = isShort ? 0.11 : 0.22;
        const sleeveGeo = new THREE.CylinderGeometry(0.046, 0.042, sleeveHeight, 24);
        
        const leftSleeve = new THREE.Mesh(sleeveGeo, mat);
        const leftArmPos = this.bodyParts.leftUpperArm.position;
        // 如果是短袖，位置上移，使其只覆盖上臂的上半部分
        leftSleeve.position.set(leftArmPos.x, isShort ? leftArmPos.y + 0.055 : leftArmPos.y, leftArmPos.z);
        leftSleeve.rotation.copy(this.bodyParts.leftUpperArm.rotation);
        leftSleeve.scale.set(1.12, 1.0, 1.12);
        group.add(leftSleeve);

        const rightSleeve = leftSleeve.clone();
        const rightArmPos = this.bodyParts.rightUpperArm.position;
        rightSleeve.position.set(rightArmPos.x, isShort ? rightArmPos.y + 0.055 : rightArmPos.y, rightArmPos.z);
        rightSleeve.rotation.copy(this.bodyParts.rightUpperArm.rotation);
        group.add(rightSleeve);

        return group;
    }

    createBottomClothing(clothingItem) {
        // 下装：圆润裤腿贴合腿部，优化腰线与上衣的衔接，解决重合穿模
        const group = new THREE.Group();
        const baseColor = this.hexStringToNumber(clothingItem.color || '#4169E1');
        const mat = new THREE.MeshStandardMaterial({
            color: baseColor,
            roughness: 0.58,
            metalness: 0.01,
            side: THREE.DoubleSide
        });

        const isShort = clothingItem.length === 'short';

        const hipsY = this.bodyParts.hips ? this.bodyParts.hips.position.y : 0.17;
        const hipScaleX = this.bodyParts.hips ? this.bodyParts.hips.scale.x : 1.24;
        const hipScaleZ = this.bodyParts.hips ? this.bodyParts.hips.scale.z : 1.14;

        // 腰部/臀部部分：
        // 关键：裤腰稍微收缩一点点，或者让上衣底部稍微扩张，这里我们稍微扩张裤腰使其包裹在身体外
        const beltGeo = new THREE.CylinderGeometry(0.145, 0.16, 0.22, 30, 1, false); // 增加高度 0.18 -> 0.22
        const belt = new THREE.Mesh(beltGeo, mat);
        belt.position.set(0, hipsY + 0.08, 0); // 稍微调高一点，向上衣靠拢 0.05 -> 0.08
        belt.scale.set(hipScaleX * 0.98, 1.0, hipScaleZ * 0.98); // 增加缩放系数 0.95 -> 0.98
        group.add(belt);

        // 臀部球形填充（让裤子更圆润）
        const hipFillGeo = new THREE.SphereGeometry(0.135, 24, 16);
        const hipFill = new THREE.Mesh(hipFillGeo, mat);
        hipFill.position.set(0, hipsY, 0);
        hipFill.scale.set(hipScaleX * 1.03, 0.88, hipScaleZ * 1.03); // 增加缩放系数 1.02 -> 1.03，y 缩放 0.85 -> 0.88
        group.add(hipFill);

        // 裤腿：跟随大腿位置
        // 如果是短裤，长度大幅减小 (0.58 -> 0.15)
        const legHeight = isShort ? 0.15 : 0.58;
        const legGeo = new THREE.CylinderGeometry(0.068, 0.05, legHeight, 24, 1, false); // 增加半径 0.065 -> 0.068，增加高度 0.55 -> 0.58
        
        // 左裤腿
        const leftLeg = new THREE.Mesh(legGeo, mat);
        const leftThighPos = this.bodyParts.leftThigh.position;
        const leftThighRot = this.bodyParts.leftThigh.rotation;
        // 如果是短裤，位置略微下移（从 +0.08 调整为 +0.04），使其覆盖大腿中上部分，露出更多腿部线条
        leftLeg.position.set(leftThighPos.x, isShort ? leftThighPos.y + 0.04 : leftThighPos.y - 0.10, leftThighPos.z);
        leftLeg.rotation.copy(leftThighRot);
        leftLeg.scale.set(1.05, 1.1, 1.05); // 调整缩放系数
        group.add(leftLeg);

        // 右裤腿
        const rightLeg = new THREE.Mesh(legGeo, mat);
        const rightThighPos = this.bodyParts.rightThigh.position;
        const rightThighRot = this.bodyParts.rightThigh.rotation;
        rightLeg.position.set(rightThighPos.x, isShort ? rightThighPos.y + 0.04 : rightThighPos.y - 0.10, rightThighPos.z);
        rightLeg.rotation.copy(rightThighRot);
        rightLeg.scale.set(1.05, 1.1, 1.05); // 调整缩放系数
        group.add(rightLeg);

        return group;
    }

    createDressClothing(clothingItem) {
        // 连衣裙：上半身采用多段式贴合，下半身采用平滑过渡裙摆
        const group = new THREE.Group();
        const baseColor = this.hexStringToNumber(clothingItem.color || '#FF69B4');
        const mat = new THREE.MeshStandardMaterial({
            color: baseColor,
            roughness: 0.52,
            metalness: 0.02,
            side: THREE.DoubleSide
        });

        const isShort = clothingItem.length === 'short';

        // 1. 上半身 - 胸部 (匹配 bodyParts.chest)
        if (this.bodyParts.chest) {
            const chestGeo = new THREE.SphereGeometry(0.12, 32, 24);
            const chestMesh = new THREE.Mesh(chestGeo, mat);
            chestMesh.position.copy(this.bodyParts.chest.position);
            chestMesh.scale.copy(this.bodyParts.chest.scale);
            chestMesh.scale.multiplyScalar(1.02);
            group.add(chestMesh);
        }

        // 2. 上半身 - 躯干核心 (匹配 bodyParts.torso)
        if (this.bodyParts.torso) {
            const torsoGeo = new THREE.CylinderGeometry(0.165, 0.13, 0.44, 32); // 增加高度 0.42 -> 0.44
            const torsoMesh = new THREE.Mesh(torsoGeo, mat);
            torsoMesh.position.copy(this.bodyParts.torso.position);
            torsoMesh.scale.copy(this.bodyParts.torso.scale);
            torsoMesh.scale.x *= 1.02;
            torsoMesh.scale.z *= 1.02;
            group.add(torsoMesh);
        }

        // 3. 裙摆部分 (从腰部向下延伸)
        const hipsYForDress = this.bodyParts.hips ? this.bodyParts.hips.position.y : 0.17;
        const hipScaleX = this.bodyParts.hips ? this.bodyParts.hips.scale.x : 1.24;

        // 如果是短裙，长度减半 (0.78 -> 0.35)
        const skirtHeight = isShort ? 0.35 : 0.78;
        const skirtGeo = new THREE.CylinderGeometry(0.14, isShort ? 0.28 : 0.35, skirtHeight, 36, 1, false); // 顶部收窄 0.16 -> 0.14，增加高度 0.75 -> 0.78
        const skirt = new THREE.Mesh(skirtGeo, mat);
        // 如果是短裙，位置上移
        skirt.position.set(0, isShort ? hipsYForDress - 0.05 : hipsYForDress - 0.10, 0); 
        skirt.scale.set(hipScaleX * 0.98, 1.0, 1.0); // 增加缩放系数 0.95 -> 0.98
        skirt.castShadow = true;
        group.add(skirt);

        // 4. 连衣裙袖子（可选，如果是短款通常露手臂，这里加一个超短袖效果）
        const sleeveHeight = isShort ? 0.08 : 0.22;
        const sleeveGeo = new THREE.CylinderGeometry(0.046, 0.042, sleeveHeight, 24);
        const leftSleeve = new THREE.Mesh(sleeveGeo, mat);
        const leftArmPos = this.bodyParts.leftUpperArm.position;
        leftSleeve.position.set(leftArmPos.x, isShort ? leftArmPos.y + 0.07 : leftArmPos.y, leftArmPos.z);
        leftSleeve.rotation.copy(this.bodyParts.leftUpperArm.rotation);
        leftSleeve.scale.set(1.12, 1.0, 1.12);
        group.add(leftSleeve);

        const rightSleeve = leftSleeve.clone();
        const rightArmPos = this.bodyParts.rightUpperArm.position;
        rightSleeve.position.set(rightArmPos.x, isShort ? rightArmPos.y + 0.07 : rightArmPos.y, rightArmPos.z);
        rightSleeve.rotation.copy(this.bodyParts.rightUpperArm.rotation);
        group.add(rightSleeve);

        return group;
    }

    createOuterClothing(clothingItem) {
        // 外套：增加体积感，但依然采用多段式逻辑确保结构贴合
        const group = new THREE.Group();
        const baseColor = this.hexStringToNumber(clothingItem.color || '#808080');
        const mat = new THREE.MeshStandardMaterial({
            color: baseColor,
            roughness: 0.7,
            metalness: 0.0
        });

        const chestY = this.bodyParts.chest ? this.bodyParts.chest.position.y : 0.62;
        const torsoScaleX = this.bodyParts.torso ? this.bodyParts.torso.scale.x : 1.0;

        // 1. 胸部体积 (比内衣更宽)
        if (this.bodyParts.chest) {
            const chestGeo = new THREE.SphereGeometry(0.14, 32, 24);
            const chestMesh = new THREE.Mesh(chestGeo, mat);
            chestMesh.position.copy(this.bodyParts.chest.position);
            chestMesh.scale.copy(this.bodyParts.chest.scale);
            chestMesh.scale.multiplyScalar(1.1); 
            group.add(chestMesh);
        }

        // 2. 躯干部分
        const bodyGeo = new THREE.CylinderGeometry(0.24, 0.21, 0.6, 32, 1, false);
        const body = new THREE.Mesh(bodyGeo, mat);
        body.position.set(0, chestY - 0.08, 0);
        body.scale.set(torsoScaleX * 1.15, 1.0, 1.1);
        group.add(body);

        // 3. 前襟开口效果优化
        const flapGeo = new THREE.PlaneGeometry(0.23, 0.55);
        const flapMat = mat.clone();
        flapMat.side = THREE.DoubleSide;
        const leftFlap = new THREE.Mesh(flapGeo, flapMat);
        leftFlap.position.set(-0.08, chestY - 0.06, 0.22);
        leftFlap.rotation.y = 0.25;
        group.add(leftFlap);
        const rightFlap = leftFlap.clone();
        rightFlap.position.x = 0.08;
        rightFlap.rotation.y = -0.25;
        group.add(rightFlap);

        // 4. 外套袖子 (比内衣更粗)
        const sleeveGeo = new THREE.CylinderGeometry(0.055, 0.052, 0.24, 24, 1, false);
        
        const leftSleeve = new THREE.Mesh(sleeveGeo, mat);
        leftSleeve.position.copy(this.bodyParts.leftUpperArm.position);
        leftSleeve.rotation.copy(this.bodyParts.leftUpperArm.rotation);
        leftSleeve.scale.set(1.3, 1.0, 1.3);
        group.add(leftSleeve);

        const rightSleeve = leftSleeve.clone();
        rightSleeve.position.copy(this.bodyParts.rightUpperArm.position);
        rightSleeve.rotation.copy(this.bodyParts.rightUpperArm.rotation);
        group.add(rightSleeve);

        return group;
    }

    // 刷新当前已穿衣服，以适应新的身材比例
    refreshClothing() {
        if (this.isRefreshing) return;
        this.isRefreshing = true;

        const types = Object.keys(this.clothingData);
        if (types.length === 0) {
            this.isRefreshing = false;
            return;
        }

        // 重新添加
        types.forEach(type => {
            const item = this.clothingData[type];
            if (item) this.addClothing(item);
        });

        this.isRefreshing = false;
    }

    createShoesClothing(clothingItem) {
        const shoesGroup = new THREE.Group();
        const baseColor = this.hexStringToNumber(clothingItem.color || '#000000');
        const shoeMaterial = new THREE.MeshStandardMaterial({
            color: baseColor,
            roughness: 0.35,
            metalness: 0.02
        });

        // 鞋底
        const soleGeo = new THREE.CylinderGeometry(0.055, 0.06, 0.018, 18);
        const leftSole = new THREE.Mesh(soleGeo, shoeMaterial);
        leftSole.rotation.x = Math.PI / 2;
        leftSole.position.set(-0.07, -0.70, 0.05);
        shoesGroup.add(leftSole);
        const rightSole = leftSole.clone();
        rightSole.position.x = 0.07;
        shoesGroup.add(rightSole);

        // 鞋面
        const upperGeo = new THREE.SphereGeometry(0.055, 18, 14);
        const leftUpper = new THREE.Mesh(upperGeo, shoeMaterial);
        leftUpper.position.set(-0.07, -0.685, 0.04);
        leftUpper.scale.set(1.05, 0.65, 1.2);
        shoesGroup.add(leftUpper);
        const rightUpper = leftUpper.clone();
        rightUpper.position.x = 0.07;
        shoesGroup.add(rightUpper);

        return shoesGroup;
    }

    updateBodyCoverage() {
        console.log('[Avatar3D] 终极遮罩修复：执行严格白名单逻辑...');
        const has = (t) => Boolean(this.clothingItems[t]);
        const getLen = (t) => this.clothingData[t]?.length || 'long';

        const wearingTop = has('top') || has('outer');
        const wearingBottom = has('bottom');
        const wearingDress = has('dress');

        const topLen = has('outer') ? getLen('outer') : getLen('top');
        const bottomLen = getLen('bottom');
        const dressLen = getLen('dress');

        // 1. 永久白名单 (Hard Whitelist) - 绝对不隐藏
        const hardWhitelist = ['head', 'neck', 'hand', 'foot', 'sole'];

        const setPartVisibility = (name, visible) => {
            const part = this.bodyParts[name];
            if (!part) return;

            // 检查是否属于白名单
            const isProtected = hardWhitelist.some(protectedName => name.toLowerCase().includes(protectedName.toLowerCase()));
            
            if (isProtected) {
                part.visible = true;
                return;
            }

            part.visible = visible;
        };

        const allPartNames = Object.keys(this.bodyParts);

        // 2. 预设：重置所有部位为显示状态 (确保脱衣后 100% 恢复)
        allPartNames.forEach(name => setPartVisibility(name, true));

        // 3. 上衣/外套/连衣裙 遮罩逻辑
        if (wearingTop || wearingDress) {
            const isShort = wearingDress ? (dressLen === 'short') : (topLen === 'short');
            
            // 无论长短都要隐藏的核心躯干部位
            const coreUpperScope = ['torso', 'chest', 'waist', 'abs', 'shoulder'];
            allPartNames.forEach(name => {
                if (coreUpperScope.some(scope => name.toLowerCase().includes(scope.toLowerCase()))) {
                    setPartVisibility(name, false);
                }
            });

            // 手臂部位：如果是长袖则隐藏大臂，如果是短袖则保持显示（露出手臂）
            if (!isShort) {
                allPartNames.forEach(name => {
                    if (name.toLowerCase().includes('upperarm')) {
                        setPartVisibility(name, false);
                    }
                });
            }
        }

        // 4. 下装/连衣裙 遮罩逻辑
        if (wearingBottom || wearingDress) {
            const isShort = wearingDress ? (dressLen === 'short') : (bottomLen === 'short');

            // 核心臀部通常不隐藏（由 whiteList 保护或逻辑控制），这里主要控制腿部
            // 如果是长款，隐藏大腿、膝盖、小腿
            // 如果是短款，只隐藏大腿（或者根据需求保持显示以露腿）
            if (!isShort) {
                const legScope = ['thigh', 'knee', 'calf'];
                allPartNames.forEach(name => {
                    if (legScope.some(scope => name.toLowerCase().includes(scope.toLowerCase()))) {
                        setPartVisibility(name, false);
                    }
                });
            } else {
                // 短款时，为了“露出一半的腿”，我们保持膝盖和小腿显示，甚至可以保持大腿显示（衣服会覆盖它）
                // 这里我们只隐藏大腿的上半部分（如果我们的模型支持的话，但目前是分块模型，所以保持显示即可）
                // 为了防止穿模，我们可以隐藏 thigh，但由于用户要“露出”，所以必须显示。
                // 之前的 polygonOffset 已经处理了贴合问题。
            }
        }

        console.log('[Avatar3D] 遮罩更新完成。');
    }






    removeClothing(type, keepData = false) {
        if (this.clothingItems[type]) {
            console.log(`[Avatar3D] Removing clothing: ${type}`);
            this.avatarGroup.remove(this.clothingItems[type]);
            delete this.clothingItems[type];
            if (!keepData) delete this.clothingData[type];
        }
        this.updateBodyCoverage();
    }

    hexStringToNumber(hex) {
        return parseInt(hex.replace('#', '0x'));
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        if (this.controls) this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        if (!this.camera || !this.renderer || !this.container) return;
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    dispose() {
        if (this.renderer) this.renderer.dispose();
        if (this.controls) this.controls.dispose();
        if (this.container && this.renderer) this.container.removeChild(this.renderer.domElement);
    }
}

// 全局Avatar实例挂载
window.avatarModel = null;

function initAvatar3D() {
    const container = document.getElementById('avatar-3d-container');
    if (!container || !window.THREE) return;
    if (window.avatarModel) return; // 幂等：避免重复初始化导致画布叠加/黑屏

    try {
        container.innerHTML = '';
        window.avatarModel = new Avatar3D('avatar-3d-container');
        const fallback = document.getElementById('avatar-2d-fallback');
        if (fallback) fallback.style.display = 'none';
        window.addEventListener('resize', () => { if (window.avatarModel) window.avatarModel.onWindowResize(); });
        console.log('3D Avatar initialized and mounted to window.avatarModel');
    } catch (e) {
        console.error('initAvatar3D failed:', e);
    }
}

function updateAvatar3DProportions(userProfile) { if (window.avatarModel) window.avatarModel.updateAvatarProportions(userProfile); }
function tryOnClothes3D(clothes) { if (window.avatarModel) window.avatarModel.addClothing(clothes); }
function removeClothes3D(type) { if (window.avatarModel) window.avatarModel.removeClothing(type); }

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initAvatar3D, 100);
});
