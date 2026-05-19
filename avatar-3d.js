// 3D虚拟人物系统
class Avatar3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.avatar = null;
        this.rotation = 0;
        this.isRotating = false;

        // 人物属性
        this.appearance = {
            skinColor: '#FDBCB4', // 肤色
            hairStyle: 'short',   // 发型
            hairColor: '#8B4513', // 发色
            bodyShape: {
                height: 170,
                weight: 60,
                shoulder: 42,
                chest: 90,
                waist: 70,
                hip: 95
            }
        };

        this.init();
    }

    init() {
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf8f4f0);

        // 创建相机
        this.camera = new THREE.PerspectiveCamera(75,
            this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 1.5, 3);

        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        // 添加光照
        this.setupLighting();

        // 创建虚拟人物
        this.createAvatar();

        // 添加交互控制
        this.setupControls();

        // 开始渲染循环
        this.animate();
    }

    setupLighting() {
        // 环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // 主光源
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(5, 10, 5);
        mainLight.castShadow = true;
        this.scene.add(mainLight);

        // 补光
        const fillLight = new THREE.DirectionalLight(0xffeedd, 0.4);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);
    }

    createAvatar() {
        // 移除旧的虚拟人物
        if (this.avatar) {
            this.scene.remove(this.avatar);
        }

        this.avatar = new THREE.Group();

        // 创建身体各部分（按正确的人体比例）
        this.createHead();
        this.createHair();
        this.createNeck();
        this.createBody();
        this.createArms();
        this.createLegs();
        this.createBasicClothes(); // 添加基础贴身衣物

        // 设置位置和整体比例
        this.avatar.position.y = -1.2;
        this.avatar.scale.set(1.2, 1.2, 1.2); // 稍微放大以适应显示
        this.scene.add(this.avatar);
    }

    createHead() {
        // 创建更符合人体比例的头部（椭球形）
        const headGeometry = new THREE.SphereGeometry(0.28, 32, 32);
        headGeometry.scale(1, 1.1, 0.9); // 调整为更符合人脸的形状

        const headMaterial = new THREE.MeshPhongMaterial({
            color: this.appearance.skinColor,
            shininess: 40,
            specular: 0x111111
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.0; // 调整头部位置
        head.castShadow = true;
        this.avatar.add(head);

        // 添加面部特征
        this.createFace(head);
        this.createEars(head); // 添加耳朵
    }

    createFace(parent) {
        // 眼睛 - 更真实的眼球结构
        const eyeWhiteGeometry = new THREE.SphereGeometry(0.04, 16, 16);
        const eyeWhiteMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const irisGeometry = new THREE.SphereGeometry(0.025, 16, 16);
        const irisMaterial = new THREE.MeshPhongMaterial({ color: 0x4a90e2 });
        const pupilGeometry = new THREE.SphereGeometry(0.012, 8, 8);
        const pupilMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

        // 左眼
        const leftEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
        leftEyeWhite.position.set(-0.08, 0.08, 0.24);
        parent.add(leftEyeWhite);

        const leftIris = new THREE.Mesh(irisGeometry, irisMaterial);
        leftIris.position.set(-0.08, 0.08, 0.25);
        parent.add(leftIris);

        const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        leftPupil.position.set(-0.08, 0.08, 0.26);
        parent.add(leftPupil);

        // 右眼
        const rightEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
        rightEyeWhite.position.set(0.08, 0.08, 0.24);
        parent.add(rightEyeWhite);

        const rightIris = new THREE.Mesh(irisGeometry, irisMaterial);
        rightIris.position.set(0.08, 0.08, 0.25);
        parent.add(rightIris);

        const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        rightPupil.position.set(0.08, 0.08, 0.26);
        parent.add(rightPupil);

        // 眉毛
        const eyebrowGeometry = new THREE.BoxGeometry(0.02, 0.01, 0.08);
        const eyebrowMaterial = new THREE.MeshPhongMaterial({ color: this.appearance.hairColor });

        const leftEyebrow = new THREE.Mesh(eyebrowGeometry, eyebrowMaterial);
        leftEyebrow.position.set(-0.08, 0.15, 0.22);
        leftEyebrow.rotation.z = -0.2;
        parent.add(leftEyebrow);

        const rightEyebrow = new THREE.Mesh(eyebrowGeometry, eyebrowMaterial);
        rightEyebrow.position.set(0.08, 0.15, 0.22);
        rightEyebrow.rotation.z = 0.2;
        parent.add(rightEyebrow);

        // 鼻子
        const noseGeometry = new THREE.ConeGeometry(0.02, 0.08, 8);
        const noseMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(this.appearance.skinColor).multiplyScalar(0.95)
        });
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.set(0, 0, 0.28);
        nose.rotation.x = Math.PI / 2;
        parent.add(nose);

        // 嘴巴
        const mouthGeometry = new THREE.TorusGeometry(0.03, 0.008, 8, 16, Math.PI);
        const mouthMaterial = new THREE.MeshPhongMaterial({ color: 0xd63031 });
        const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        mouth.position.set(0, -0.12, 0.25);
        mouth.rotation.x = Math.PI / 2;
        parent.add(mouth);

        // 添加腮红效果
        this.createBlush(parent);
    }

    createBlush(parent) {
        // 腮红效果
        const blushGeometry = new THREE.SphereGeometry(0.03, 16, 16);
        const blushMaterial = new THREE.MeshPhongMaterial({
            color: 0xff6b9d,
            transparent: true,
            opacity: 0.3
        });

        const leftBlush = new THREE.Mesh(blushGeometry, blushMaterial);
        leftBlush.position.set(-0.15, 0, 0.2);
        leftBlush.scale.set(1, 0.6, 0.3);
        parent.add(leftBlush);

        const rightBlush = new THREE.Mesh(blushGeometry, blushMaterial);
        rightBlush.position.set(0.15, 0, 0.2);
        rightBlush.scale.set(1, 0.6, 0.3);
        parent.add(rightBlush);
    }

    createEars(parent) {
        // 耳朵
        const earGeometry = new THREE.SphereGeometry(0.06, 16, 16);
        earGeometry.scale(0.3, 1, 0.8);
        const earMaterial = new THREE.MeshPhongMaterial({
            color: this.appearance.skinColor,
            shininess: 30
        });

        const leftEar = new THREE.Mesh(earGeometry, earMaterial);
        leftEar.position.set(-0.28, 0.05, 0);
        parent.add(leftEar);

        const rightEar = new THREE.Mesh(earGeometry, earMaterial);
        rightEar.position.set(0.28, 0.05, 0);
        parent.add(rightEar);
    }

    createHair() {
        let hairGeometry;
        const hairMaterial = new THREE.MeshPhongMaterial({
            color: this.appearance.hairColor,
            shininess: 50
        });

        switch(this.appearance.hairStyle) {
            case 'short':
                hairGeometry = new THREE.SphereGeometry(0.32, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
                break;
            case 'long':
                hairGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.8, 32);
                break;
            case 'ponytail':
                hairGeometry = new THREE.SphereGeometry(0.28, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.5);
                break;
            default:
                hairGeometry = new THREE.SphereGeometry(0.32, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        }

        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.y = 2.0;
        hair.castShadow = true;
        this.avatar.add(hair);
    }

    createNeck() {
        // 颈部
        const neckGeometry = new THREE.CylinderGeometry(0.08, 0.12, 0.15, 16);
        const neckMaterial = new THREE.MeshPhongMaterial({
            color: this.appearance.skinColor,
            shininess: 30
        });
        const neck = new THREE.Mesh(neckGeometry, neckMaterial);
        neck.position.y = 1.85;
        neck.castShadow = true;
        this.avatar.add(neck);
    }

    createBasicClothes() {
        // 基础贴身短袖
        const shirtGeometry = new THREE.CylinderGeometry(0.22, 0.25, 0.35, 32);
        const shirtMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff, // 白色基础T恤
            shininess: 20
        });
        const shirt = new THREE.Mesh(shirtGeometry, shirtMaterial);
        shirt.position.y = 1.3;
        shirt.castShadow = true;
        this.avatar.add(shirt);

        // 基础贴身短裤
        const shortsGeometry = new THREE.CylinderGeometry(0.18, 0.22, 0.2, 32);
        const shortsMaterial = new THREE.MeshPhongMaterial({
            color: 0x4a90e2, // 蓝色基础短裤
            shininess: 20
        });
        const shorts = new THREE.Mesh(shortsGeometry, shortsMaterial);
        shorts.position.y = 0.9;
        shorts.castShadow = true;
        this.avatar.add(shorts);
    }

    createBody() {
        // 上躯干（胸部区域）
        const upperBodyGeometry = new THREE.CylinderGeometry(0.22, 0.25, 0.3, 32);
        const upperBodyMaterial = new THREE.MeshPhongMaterial({
            color: this.appearance.skinColor,
            shininess: 30
        });
        const upperBody = new THREE.Mesh(upperBodyGeometry, upperBodyMaterial);
        upperBody.position.y = 1.45;
        upperBody.castShadow = true;
        this.avatar.add(upperBody);

        // 腰部
        const waistGeometry = new THREE.CylinderGeometry(0.18, 0.22, 0.2, 32);
        const waistMaterial = new THREE.MeshPhongMaterial({
            color: this.appearance.skinColor,
            shininess: 30
        });
        const waist = new THREE.Mesh(waistGeometry, waistMaterial);
        waist.position.y = 1.15;
        waist.castShadow = true;
        this.avatar.add(waist);

        // 臀部
        const hipGeometry = new THREE.CylinderGeometry(0.25, 0.18, 0.25, 32);
        const hipMaterial = new THREE.MeshPhongMaterial({
            color: this.appearance.skinColor,
            shininess: 30
        });
        const hip = new THREE.Mesh(hipGeometry, hipMaterial);
        hip.position.y = 0.9;
        hip.castShadow = true;
        this.avatar.add(hip);

        // 根据身材参数调整身体形状
        this.adjustBodyShape(upperBody, waist, hip);
    }

    adjustBodyShape(upperBody, waist, hip) {
        const { shoulder, chest, waist: waistSize, hip: hipSize } = this.appearance.bodyShape;

        // 根据身材数据调整身体比例
        const shoulderRatio = shoulder / 42; // 42是基准肩宽
        const chestRatio = chest / 90; // 90是基准胸围
        const waistRatio = waistSize / 70; // 70是基准腰围
        const hipRatio = hipSize / 95; // 95是基准臀围

        // 调整上躯干
        upperBody.scale.x = shoulderRatio * 1.1;
        upperBody.scale.y = chestRatio * 0.9;
        upperBody.scale.z = shoulderRatio * 1.1;

        // 调整腰部
        waist.scale.x = waistRatio * 0.9;
        waist.scale.y = 1.0;
        waist.scale.z = waistRatio * 0.9;

        // 调整臀部
        hip.scale.x = hipRatio * 1.0;
        hip.scale.y = 1.0;
        hip.scale.z = hipRatio * 1.0;
    }

    createArms() {
        // 上臂
        const upperArmGeometry = new THREE.CylinderGeometry(0.07, 0.06, 0.25, 16);
        const forearmGeometry = new THREE.CylinderGeometry(0.06, 0.05, 0.25, 16);
        const handGeometry = new THREE.SphereGeometry(0.04, 16, 16);
        const armMaterial = new THREE.MeshPhongMaterial({
            color: this.appearance.skinColor,
            shininess: 30
        });

        // 左臂
        const leftUpperArm = new THREE.Mesh(upperArmGeometry, armMaterial);
        leftUpperArm.position.set(-0.28, 1.4, 0);
        leftUpperArm.castShadow = true;
        this.avatar.add(leftUpperArm);

        const leftForearm = new THREE.Mesh(forearmGeometry, armMaterial);
        leftForearm.position.set(-0.28, 1.15, 0);
        leftForearm.castShadow = true;
        this.avatar.add(leftForearm);

        const leftHand = new THREE.Mesh(handGeometry, armMaterial);
        leftHand.position.set(-0.28, 1.0, 0);
        leftHand.castShadow = true;
        this.avatar.add(leftHand);

        // 右臂
        const rightUpperArm = new THREE.Mesh(upperArmGeometry, armMaterial);
        rightUpperArm.position.set(0.28, 1.4, 0);
        rightUpperArm.castShadow = true;
        this.avatar.add(rightUpperArm);

        const rightForearm = new THREE.Mesh(forearmGeometry, armMaterial);
        rightForearm.position.set(0.28, 1.15, 0);
        rightForearm.castShadow = true;
        this.avatar.add(rightForearm);

        const rightHand = new THREE.Mesh(handGeometry, armMaterial);
        rightHand.position.set(0.28, 1.0, 0);
        rightHand.castShadow = true;
        this.avatar.add(rightHand);
    }

    createLegs() {
        // 大腿
        const thighGeometry = new THREE.CylinderGeometry(0.11, 0.10, 0.3, 16);
        const shinGeometry = new THREE.CylinderGeometry(0.09, 0.08, 0.3, 16);
        const footGeometry = new THREE.BoxGeometry(0.08, 0.04, 0.15);
        const legMaterial = new THREE.MeshPhongMaterial({
            color: this.appearance.skinColor,
            shininess: 30
        });

        // 左腿
        const leftThigh = new THREE.Mesh(thighGeometry, legMaterial);
        leftThigh.position.set(-0.12, 0.65, 0);
        leftThigh.castShadow = true;
        this.avatar.add(leftThigh);

        const leftShin = new THREE.Mesh(shinGeometry, legMaterial);
        leftShin.position.set(-0.12, 0.35, 0);
        leftShin.castShadow = true;
        this.avatar.add(leftShin);

        const leftFoot = new THREE.Mesh(footGeometry, legMaterial);
        leftFoot.position.set(-0.12, 0.15, 0.02);
        leftFoot.castShadow = true;
        this.avatar.add(leftFoot);

        // 右腿
        const rightThigh = new THREE.Mesh(thighGeometry, legMaterial);
        rightThigh.position.set(0.12, 0.65, 0);
        rightThigh.castShadow = true;
        this.avatar.add(rightThigh);

        const rightShin = new THREE.Mesh(shinGeometry, legMaterial);
        rightShin.position.set(0.12, 0.35, 0);
        rightShin.castShadow = true;
        this.avatar.add(rightShin);

        const rightFoot = new THREE.Mesh(footGeometry, legMaterial);
        rightFoot.position.set(0.12, 0.15, 0.02);
        rightFoot.castShadow = true;
        this.avatar.add(rightFoot);
    }

    setupControls() {
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        this.renderer.domElement.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        this.renderer.domElement.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - previousMousePosition.x;
                this.rotation += deltaX * 0.01;
                previousMousePosition = { x: e.clientX, y: e.clientY };
            }
        });

        this.renderer.domElement.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // 触摸控制
        this.renderer.domElement.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        });

        this.renderer.domElement.addEventListener('touchmove', (e) => {
            if (isDragging && e.touches.length === 1) {
                const deltaX = e.touches[0].clientX - previousMousePosition.x;
                this.rotation += deltaX * 0.01;
                previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        });

        this.renderer.domElement.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    updateAppearance(newAppearance) {
        this.appearance = { ...this.appearance, ...newAppearance };
        this.createAvatar();
    }

    rotate(degrees) {
        this.rotation += degrees * Math.PI / 180;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.avatar) {
            this.avatar.rotation.y = this.rotation;
        }

        this.renderer.render(this.scene, this.camera);
    }

    resize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}

// 外观自定义面板
class AppearancePanel {
    constructor(avatar3D) {
        this.avatar = avatar3D;
        this.panel = null;
        this.init();
    }

    init() {
        this.createPanel();
        this.setupControls();
    }

    createPanel() {
        this.panel = document.createElement('div');
        this.panel.className = 'appearance-panel';
        this.panel.innerHTML = `
            <div class="panel-header">
                <h3>✨ 虚拟人物定制</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="panel-content">
                <div class="customization-section">
                    <h4>🎨 肤色选择</h4>
                    <div class="color-options skin-colors">
                        <div class="color-option" data-color="#FDBCB4" style="background: #FDBCB4"></div>
                        <div class="color-option" data-color="#F1C27D" style="background: #F1C27D"></div>
                        <div class="color-option" data-color="#E0AC69" style="background: #E0AC69"></div>
                        <div class="color-option" data-color="#C68642" style="background: #C68642"></div>
                        <div class="color-option" data-color="#8D5524" style="background: #8D5524"></div>
                        <div class="color-option" data-color="#654321" style="background: #654321"></div>
                    </div>
                </div>

                <div class="customization-section">
                    <h4>💇‍♀️ 发型选择</h4>
                    <div class="hair-styles">
                        <button class="style-btn active" data-style="short">短发</button>
                        <button class="style-btn" data-style="long">长发</button>
                        <button class="style-btn" data-style="ponytail">马尾</button>
                    </div>
                </div>

                <div class="customization-section">
                    <h4>🌈 发色选择</h4>
                    <div class="color-options hair-colors">
                        <div class="color-option" data-color="#8B4513" style="background: #8B4513"></div>
                        <div class="color-option" data-color="#000000" style="background: #000000"></div>
                        <div class="color-option" data-color="#FFD700" style="background: #FFD700"></div>
                        <div class="color-option" data-color="#FF6347" style="background: #FF6347"></div>
                        <div class="color-option" data-color="#9370DB" style="background: #9370DB"></div>
                        <div class="color-option" data-color="#20B2AA" style="background: #20B2AA"></div>
                    </div>
                </div>

                <div class="rotation-controls">
                    <h4>🔄 旋转控制</h4>
                    <div class="rotation-buttons">
                        <button class="rotate-btn" data-rotation="-90">左转</button>
                        <button class="rotate-btn" data-rotation="90">右转</button>
                        <button class="rotate-btn" data-rotation="180">转身</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.panel);
        this.panel.style.display = 'none';
    }

    setupControls() {
        // 肤色选择
        const skinColors = this.panel.querySelectorAll('.skin-colors .color-option');
        skinColors.forEach(option => {
            option.addEventListener('click', () => {
                skinColors.forEach(btn => btn.classList.remove('selected'));
                option.classList.add('selected');
                const color = option.dataset.color;
                this.avatar.updateAppearance({ skinColor: color });
            });
        });

        // 发型选择
        const hairStyles = this.panel.querySelectorAll('.hair-styles .style-btn');
        hairStyles.forEach(btn => {
            btn.addEventListener('click', () => {
                hairStyles.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const style = btn.dataset.style;
                this.avatar.updateAppearance({ hairStyle: style });
            });
        });

        // 发色选择
        const hairColors = this.panel.querySelectorAll('.hair-colors .color-option');
        hairColors.forEach(option => {
            option.addEventListener('click', () => {
                hairColors.forEach(btn => btn.classList.remove('selected'));
                option.classList.add('selected');
                const color = option.dataset.color;
                this.avatar.updateAppearance({ hairColor: color });
            });
        });

        // 旋转控制
        const rotateBtns = this.panel.querySelectorAll('.rotate-btn');
        rotateBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const rotation = parseInt(btn.dataset.rotation);
                this.avatar.rotate(rotation);
            });
        });

        // 关闭按钮
        this.panel.querySelector('.close-btn').addEventListener('click', () => {
            this.hide();
        });
    }

    show() {
        this.panel.style.display = 'block';
    }

    hide() {
        this.panel.style.display = 'none';
    }

    toggle() {
        if (this.panel.style.display === 'none') {
            this.show();
        } else {
            this.hide();
        }
    }
}