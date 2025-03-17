const blk_pitn = { //各小方块相对【自身中心】的位置 -- 【自身中心】确定为#div22的方块
    block1: [[0, 1], [0, 0], [-1, 0], [-1, -1]],
    block2: [[0, 1], [0, 0], [-1, 0], [0, -1]],
    block3: [[-1, 1], [0, 0], [-1, 0], [-1, -1]],
    block4: [[0, 1], [0, 0], [-1, 0], [-1, -1]], /* 1 */
    block5: [[-1, 1], [0, 0], [-1, 0], [0, -1]],
    block6: [[0, -1], [0, 0], [-1, 0], [1, -1]],
    block7: [[-1, -1], [0, 0], [-1, 0], [1, 0]],
    block8: [[-1, 1], [0, 0], [-1, 0], [-1, -1]], /* 3 */
    block9: [[0, -1], [0, 0], [-1, 0], [1, 0]],
    block10: [[-1, 1], [0, 0], [-1, 0], [1, 0]],
    block11: [[2, 0], [0, 0], [-1, 0], [1, 0]], /* — */
    block12: [[0, 1], [0, 0], [-1, 0], [0, -1]], /* 2 */
    block13: [[0, 1], [0, 0], [-1, 0], [-1, -1]], /* 1 */
    block14: [[1, 1], [0, 0], [-1, 0], [1, 0]],
    block15: [[1, -1], [0, 0], [-1, 0], [1, 0]],
    block16: [[-1, -1], [0, 0], [-1, 0], [1, 0]], /* 7 */
    block17: [[0, 1], [0, 0], [-1, 0], [0, -1]], /* 2 */
    block18: [[0, 1], [0, 0], [-1, 0], [-1, -1]], /* 1 */
    block19: [[0, -1], [0, 0], [-1, 0], [1, 0]], /* 9 */
    block20: [[1, -1], [0, 0], [-1, 0], [1, 0]],
    block21: [[0, 1], [0, 0], [-1, 0], [-1, -1]], /* 1 */
    block22: [[1, 1], [0, 0], [-1, 0], [1, 0]], /* 14 */
    block23: [[0, 2], [0, 0], [0, -1], [0, 1]]      /* | */
},
offset_pitn = { //各方块block相对【爱心中心】的位置
    block1: [5, 3],
    block2: [5, 1],
    block3: [3, 4],
    block4: [3, 2],
    block5: [3, -1],
    block6: [2, 5],
    block7: [2, 1],
    block8: [1, -1],
    block9: [1, -3],
    block10: [1, 2],
    block11: [0, 3],
    block12: [0, 0], /* 【爱心中心】*/
    block13: [-1, -4],
    block14: [0, -2],
    block15: [-2, 4],
    block16: [-2, 2],
    block17: [-2, 0],
    block18: [-3, -2],
    block19: [-4, 0],
    block20: [-3, 5],
    block21: [-5, 3],
    block22: [-4, 1],
    block23: [-6, 1]    /* 因动画需要移动一个方块，故y轴坐标-1*/
};

let blocks, block, love, timer, index = 0, clone_block;

function initializeAnimation() {
    // 获取元素
    blocks = document.getElementsByClassName("block");
    block = blocks[0];
    love = document.getElementsByClassName("love")[0];
    timer = null;
    index = 0;  //记录拼接爱心的动画步骤
    
    //1.移动方块的【自身中心】到【爱心中心】
    block.style.top = "50%";
    block.style.left = "50%";
    block.style.margin = "-20px 0 0 -20px";
    
    const block_left = parseFloat(window.getComputedStyle(block, null).left.slice(0, -2)); //【爱心中心】 左边距离父元素的距离
    const block_top = parseFloat(window.getComputedStyle(block, null).top.slice(0, -2));  //【爱心中心】 顶部距离父元素的距离
    
    // 开始动画
    setTimeout(() => {
        timer = setInterval(() => {
            Next(block_left, block_top);
        }, 300);
    }, 12000);   //gif图播放完毕所需时间为11.73s
}

function Next(block_left, block_top) {
    if (++index >= 24) {
        clearInterval(timer);
        Rise();
        return;
    }

    block.style.visibility = "visible"; //升空动画前允许可见

    //2.移动方块到指定的位置-即是移动【自身中心】到目标位置
    block.style.left = block_left + 40 * offset_pitn["block" + index][0] + "px";
    block.style.top = block_top - 40 * offset_pitn["block" + index][1] + "px";
    for (let i = 0; i < block.children.length; i++) {
        block.children[i].style.left = blk_pitn["block" + index][i][0] * -40 + "px";
        /* -40 是因为逻辑坐标和浏览器的x，y轴方向不一样*/
        block.children[i].style.top = blk_pitn["block" + index][i][1] * -40 + "px";
    }

    //3.克隆方块—保存现在的位置
    /* 一共会克隆23个方块，加上原先的一个方块block，共24个方块，即多出原先的block方块*/
    clone_block = block.cloneNode(true);
    love.appendChild(clone_block);

    if (love.children.length >= 24) {
        blocks[blocks.length - 1].children[2].style.display = "none"; //去掉多余的小方块
        block.style.display = "none";   //隐藏多出的block方块
    }
}

function Rise() {
    //4.爱心升高，多出的那个小方块开始掉落
    console.log("开始升空");
    let timer2 = null,
        distance = 0;
    /* 升高时，移动的距离*/
    const target = 120, /* 目标距离*/
        speed = 1;
    /*移动速度*/

    let love_top = parseFloat(window.getComputedStyle(love, null).top.slice(0, -2));  //爱心盒子距离屏幕顶部的距离

    timer2 = setInterval(() => {
        distance += speed;
        if (distance >= target) {
            clearInterval(timer2);
            console.log("升空完毕");
            // 升空完毕后，爱心变成烟花
            createFireworks();
        }
        love.style.top = (love_top - distance) + "px";
    }, 22);
}

// 创建烟花效果
function createFireworks() {
    // 获取爱心的位置
    const loveRect = love.getBoundingClientRect();
    const centerX = loveRect.left + loveRect.width / 2;
    const centerY = loveRect.top + loveRect.height / 2;
    
    // 创建200个粒子
    const particleCount = 200;
    const particles = [];
    
    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        document.body.appendChild(particle);
        
        // 设置初始位置（爱心中心）
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        
        // 随机颜色
        const colors = ['#ff6b81', '#ff4757', '#ff6348', '#ff7f50', '#ff9ff3'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = randomColor;
        particle.style.boxShadow = `0 0 6px ${randomColor}`;
        
        particles.push(particle);
    }
    
    // 隐藏爱心
    setTimeout(() => {
        love.style.opacity = '0';
        
        // 粒子爆炸效果
        particles.forEach(particle => {
            // 随机角度和距离
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 200;
            
            // 计算目标位置
            const targetX = centerX + Math.cos(angle) * distance;
            const targetY = centerY + Math.sin(angle) * distance;
            
            // 设置过渡效果
            particle.style.opacity = '1';
            
            // 延迟一点以创建爆炸效果
            setTimeout(() => {
                particle.style.left = targetX + 'px';
                particle.style.top = targetY + 'px';
            }, Math.random() * 200);
        });
        
        // 粒子消失，然后显示文字
        setTimeout(() => {
            particles.forEach(particle => {
                particle.style.opacity = '0';
            });
            
            // 显示文字
            setTimeout(() => {
                const textContainer = document.getElementById('text-container');
                textContainer.style.opacity = '1';
                
                // 创建装饰爱心
                createDecorativeHearts();
                
                // 清理粒子
                setTimeout(() => {
                    particles.forEach(particle => {
                        document.body.removeChild(particle);
                    });
                }, 1000);
            }, 1500);
        }, 2000);
    }, 500);
}

// 创建装饰性的小爱心
function createDecorativeHearts() {
    const nameElement = document.querySelector('.name');
    const loveTextElement = document.querySelector('.love-text');
    
    // 为"王莹莹"创建装饰爱心
    for (let i = 0; i < 15; i++) {
        createFloatingHeart(nameElement);
    }
    
    // 为"喜欢你"创建装饰爱心
    for (let i = 0; i < 15; i++) {
        createFloatingHeart(loveTextElement);
    }
    
    // 显示升起的文字
    setTimeout(() => {
        showRisingTexts();
    }, 3000);
}

// 显示升起的文字
function showRisingTexts() {
    const risingTextContainer = document.querySelector('.rising-text-container');
    const risingTexts = document.querySelectorAll('.rising-text');
    
    // 显示容器，调整位置更低
    risingTextContainer.style.opacity = '1';
    risingTextContainer.style.bottom = '-150px'; // 调整到更低的位置
    
    // 依次显示每行文字
    setTimeout(() => {
        risingTexts[0].style.opacity = '1';
        risingTexts[0].style.transform = 'translateY(0)';
        
        setTimeout(() => {
            risingTexts[1].style.opacity = '1';
            risingTexts[1].style.transform = 'translateY(0)';
            
            setTimeout(() => {
                risingTexts[2].style.opacity = '1';
                risingTexts[2].style.transform = 'translateY(0)';
            }, 800);
        }, 800);
    }, 500);
}

// 创建漂浮的小爱心
function createFloatingHeart(parentElement) {
    const heart = document.createElement('div');
    heart.className = 'heart-icon floating-heart';
    
    // 获取父元素尺寸
    const parentRect = parentElement.getBoundingClientRect();
    
    // 创建一个容器来包含心形，并设置为绝对定位
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.top = '0';
    container.style.left = '0';
    container.style.pointerEvents = 'none'; // 确保不会干扰鼠标事件
    container.style.zIndex = '-1'; // 放在文字后面
    
    // 将心形添加到容器
    container.appendChild(heart);
    
    // 将容器添加到父元素
    parentElement.appendChild(container);
    
    // 随机角度和距离
    const angle = Math.random() * Math.PI * 2;
    const minDistance = Math.max(parentRect.width, parentRect.height) * 0.6; // 确保在文字周围
    const maxDistance = Math.max(parentRect.width, parentRect.height) * 0.8;
    const distance = minDistance + Math.random() * (maxDistance - minDistance);
    
    // 计算初始位置 (围绕中心点)
    const centerX = parentRect.width / 2;
    const centerY = parentRect.height / 2;
    let x = centerX + Math.cos(angle) * distance;
    let y = centerY + Math.sin(angle) * distance;
    
    // 设置心形的初始位置
    heart.style.position = 'absolute';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.transform = `rotate(45deg) scale(${0.3 + Math.random() * 0.3})`;
    
    // 随机颜色
    const colors = ['#ff6b81', '#ff4757', '#ff6348', '#ff7f50', '#ff9ff3'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    heart.style.backgroundColor = randomColor;
    
    // 设置心形的:before和:after伪元素的颜色
    heart.style.setProperty('--heart-color', randomColor);
    
    // 延迟显示
    setTimeout(() => {
        heart.style.opacity = '0.7';
    }, Math.random() * 1000);
    
    // 围绕中心旋转动画
    const duration = 5000 + Math.random() * 5000; // 5-10秒一圈
    const clockwise = Math.random() > 0.5; // 随机顺时针或逆时针
    const startAngle = angle;
    
    // 开始旋转动画
    let startTime = null;
    
    function rotateHeart(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = (elapsed % duration) / duration;
        
        // 计算当前角度
        let currentAngle;
        if (clockwise) {
            currentAngle = startAngle + progress * Math.PI * 2;
        } else {
            currentAngle = startAngle - progress * Math.PI * 2;
        }
        
        // 计算新位置
        const newX = centerX + Math.cos(currentAngle) * distance;
        const newY = centerY + Math.sin(currentAngle) * distance;
        
        // 更新位置
        heart.style.left = newX + 'px';
        heart.style.top = newY + 'px';
        
        // 继续动画
        requestAnimationFrame(rotateHeart);
    }
    
    // 启动动画
    requestAnimationFrame(rotateHeart);
}

window.onload = function () {
    // 获取元素
    const startButton = document.getElementById('startButton');
    const audio = document.getElementById('audios');
    const overlay = document.getElementById('overlay');
    
    // 添加开始按钮点击事件
    startButton.addEventListener('click', function() {
        // 隐藏开始按钮和遮罩层
        startButton.style.display = 'none';
        overlay.style.display = 'none';
        
        // 播放音乐
        audio.play();
        
        // 初始化并开始动画
        initializeAnimation();
    });
};