// 移动设备适配器
const MobileAdapter = {
    // 检测是否为移动设备
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    // 检测是否为iOS设备
    isIOS() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    },
    
    // 检测是否为安卓设备
    isAndroid() {
        return /Android/i.test(navigator.userAgent);
    },

    // 初始化移动设备适配
    init() {
        if (this.isMobile()) {
            this.applyMobileStyles();
            this.setupMobileLayout();
            this.enhanceInputBehavior();
            this.optimizeScrolling();
            
            // 额外的设备特定优化
            if (this.isIOS()) {
                this.applyIOSFixes();
            } else if (this.isAndroid()) {
                this.applyAndroidFixes();
            }
            
            // 适配不同屏幕大小
            this.adaptToScreenSize();
            
            // 监听屏幕方向变化
            this.handleOrientationChange();
        }
    },

    // 应用移动设备样式
    applyMobileStyles() {
        document.body.classList.add('mobile-device');
        
        // 添加移动设备专用样式
        const mobileStyles = `
            .mobile-device .main-content {
                margin-left: 0;
                width: 100%;
                display: flex;
                flex-direction: column;
                height: 100vh;
            }

            .mobile-device .sidebar {
                display: none !important;
            }

            .mobile-device .chat-messages {
                flex: 1;
                padding: 10px;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }

            .mobile-device .message {
                max-width: 90%;
                margin: 8px;
            }

            .mobile-device .message-content {
                font-size: 14px;
                padding: 12px;
                line-height: 1.4;
            }

            .mobile-device .input-area {
                padding: 12px;
                position: sticky;
                bottom: 0;
                background: #fff;
                z-index: 10;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
            }

            .mobile-device .input-container {
                padding: 10px;
                border-radius: 18px;
            }

            .mobile-device #messageInput {
                font-size: 16px;
                min-height: 20px;
                max-height: 120px;
                overflow-y: auto;
                padding: 2px 0;
            }

            .mobile-device .bottom-buttons {
                flex-wrap: wrap;
                gap: 8px;
                justify-content: space-between;
                align-items: center;
                margin-top: 8px;
            }

            .mobile-device .model-button {
                font-size: 12px;
                padding: 6px 10px;
                min-width: auto;
            }

            .mobile-device .send-button {
                width: 42px;
                height: 42px;
            }

            .mobile-device .code-block {
                margin: 8px 0;
                border-radius: 8px;
                max-width: 100%;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
            }

            .mobile-device .code-block pre {
                padding: 10px;
                font-size: 12px;
            }

            .mobile-device .code-block .code-header {
                padding: 6px 10px;
                font-size: 11px;
            }

            .mobile-device .code-copy-button {
                padding: 4px 8px;
                font-size: 10px;
            }

            .mobile-device .thinking-time {
                bottom: 70px;
                right: 10px;
                font-size: 11px;
            }

            .mobile-device .welcome-text {
                font-size: 14px;
                line-height: 1.4;
            }

            .mobile-device .tech-badge {
                font-size: 11px;
                padding: 4px 8px;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = mobileStyles;
        document.head.appendChild(styleSheet);
    },

    // 设置移动端布局
    setupMobileLayout() {
        // 向文档中添加视口元标记，确保移动设备上的缩放和渲染行为正确
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (!viewportMeta) {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(meta);
        }

        // 确保网站是全屏可滚动的
        document.documentElement.style.height = '100%';
        document.body.style.height = '100%';
        document.body.style.overflow = 'hidden';

        // 隐藏侧边栏
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.style.display = 'none';
        }

        // 隐藏快捷操作区
        const quickActions = document.querySelector('.quick-actions');
        if (quickActions) {
            quickActions.style.display = 'none';
        }
    },

    // 增强输入框行为
    enhanceInputBehavior() {
        const messageInput = document.getElementById('messageInput');
        const inputArea = document.querySelector('.input-area');
        const chatContainer = document.querySelector('.chat-container');
        if (!messageInput || !inputArea) return;

        // 自动调整文本区域高度
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(120, this.scrollHeight) + 'px';
        });

        // 优化输入框获取焦点时的行为
        messageInput.addEventListener('focus', function() {
            // 添加可见性类
            document.body.classList.add('keyboard-visible');
            
            // 将输入区域固定在可视区域底部
            inputArea.style.position = 'fixed';
            inputArea.style.bottom = '0';
            inputArea.style.left = '0';
            inputArea.style.right = '0';
            inputArea.style.zIndex = '1000';
            
            // 延迟执行，等待键盘显示
            setTimeout(() => {
                // 滚动到页面底部
                window.scrollTo(0, document.body.scrollHeight);
                
                // 确保输入框可见
                this.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 300);
        });

        // 输入框失去焦点恢复原样式
        messageInput.addEventListener('blur', function() {
            // 移除可见性类
            document.body.classList.remove('keyboard-visible');
            
            // 恢复原来的样式
            setTimeout(() => {
                inputArea.style.position = '';
                inputArea.style.bottom = '';
                inputArea.style.left = '';
                inputArea.style.right = '';
            }, 100);
        });
        
        // 监听iOS虚拟键盘事件
        let viewportHeight = window.innerHeight;
        window.addEventListener('resize', () => {
            // 如果高度变小，说明键盘弹出
            if (window.innerHeight < viewportHeight) {
                // 键盘弹出，确保输入框在视图中
                setTimeout(() => {
                    window.scrollTo(0, document.body.scrollHeight);
                    messageInput.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }, 100);
            } else {
                // 键盘隐藏，重置视口高度
                viewportHeight = window.innerHeight;
            }
        });
    },

    // 应用iOS特定修复
    applyIOSFixes() {
        const messageInput = document.getElementById('messageInput');
        const chatMessages = document.querySelector('.chat-messages');
        const inputArea = document.querySelector('.input-area');
        const keyboardHelper = document.getElementById('keyboard-helper');
        
        if (!messageInput || !chatMessages || !inputArea) return;
        
        // 记录原始视口高度
        let originalViewportHeight = window.innerHeight;
        
        // 创建iOS键盘管理器
        const iOSKeyboardManager = {
            isKeyboardVisible: false,
            keyboardHeight: 0,
            
            // 检测键盘状态
            detectKeyboard() {
                const newViewportHeight = window.innerHeight;
                
                // 如果高度减小，认为键盘弹出
                if (newViewportHeight < originalViewportHeight && document.activeElement === messageInput) {
                    this.keyboardHeight = originalViewportHeight - newViewportHeight;
                    if (!this.isKeyboardVisible) {
                        this.keyboardDidShow();
                    }
                    this.isKeyboardVisible = true;
                } 
                // 如果高度恢复，认为键盘收起
                else if (this.isKeyboardVisible && newViewportHeight >= originalViewportHeight) {
                    this.keyboardDidHide();
                    this.isKeyboardVisible = false;
                    originalViewportHeight = newViewportHeight;
                }
            },
            
            // 键盘显示时的处理
            keyboardDidShow() {
                console.log('[iOS] 键盘显示, 高度:', this.keyboardHeight);
                
                // 添加键盘可见标记类
                document.body.classList.add('keyboard-visible');
                document.body.classList.add('ios-keyboard-open');
                
                // 固定输入区域在视口底部
                inputArea.style.position = 'fixed';
                inputArea.style.bottom = '0';
                inputArea.style.left = '0';
                inputArea.style.right = '0';
                inputArea.style.width = '100%';
                inputArea.style.zIndex = '1000';
                
                // 调整聊天区域高度，为键盘腾出空间
                chatMessages.style.height = `calc(100% - ${this.keyboardHeight + inputArea.offsetHeight}px)`;
                chatMessages.style.paddingBottom = '60px';
                
                // 确保输入区域可见
                setTimeout(() => {
                    messageInput.scrollIntoView({block: 'end', behavior: 'smooth'});
                    // 滚动到页面底部
                    window.scrollTo(0, 0);
                }, 100);
            },
            
            // 键盘隐藏时的处理
            keyboardDidHide() {
                console.log('[iOS] 键盘隐藏');
                
                // 移除键盘可见标记类
                document.body.classList.remove('keyboard-visible');
                document.body.classList.remove('ios-keyboard-open');
                
                // 恢复原始样式
                inputArea.style.position = '';
                inputArea.style.bottom = '';
                inputArea.style.left = '';
                inputArea.style.right = '';
                inputArea.style.width = '';
                inputArea.style.zIndex = '';
                
                // 恢复聊天区域高度
                chatMessages.style.height = '';
                chatMessages.style.paddingBottom = '';
                
                // 重置键盘高度
                this.keyboardHeight = 0;
                
                // 滚动到最新消息
                setTimeout(() => {
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 100);
            }
        };
        
        // 使用VisualViewport API (如果支持)
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', () => {
                // 记录视口变化
                const viewportHeight = window.visualViewport.height;
                const viewportWidth = window.visualViewport.width;
                const viewportOffsetTop = window.visualViewport.offsetTop;
                
                // 仅当输入框获得焦点时处理键盘事件
                if (document.activeElement === messageInput) {
                    console.log('[iOS] 视口变化', viewportHeight, originalViewportHeight);
                    
                    // 通过视口高度变化判断键盘是否弹出
                    if (viewportHeight < originalViewportHeight - 100) {  // 100px阈值，避免误判
                        // 键盘弹出
                        document.body.classList.add('keyboard-visible');
                        document.body.classList.add('ios-keyboard-open');
                        
                        // 固定输入区域在视口底部
                        inputArea.style.position = 'fixed';
                        inputArea.style.bottom = `${window.innerHeight - viewportHeight - viewportOffsetTop}px`;
                        inputArea.style.left = '0';
                        inputArea.style.right = '0';
                        inputArea.style.width = '100%';
                        inputArea.style.zIndex = '1000';
                        
                        // 避免内容被键盘遮挡
                        const keyboardHeight = originalViewportHeight - viewportHeight;
                        chatMessages.style.height = `${viewportHeight - inputArea.offsetHeight}px`;
                        chatMessages.style.paddingBottom = '60px';
                        
                        // 确保消息和输入框可见
                        setTimeout(() => {
                            messageInput.scrollIntoView({block: 'end', behavior: 'smooth'});
                        }, 50);
                    }
                }
            });
            
            // 监听视口滚动
            window.visualViewport.addEventListener('scroll', () => {
                if (document.activeElement === messageInput && window.visualViewport.height < originalViewportHeight - 100) {
                    inputArea.style.bottom = `${window.innerHeight - window.visualViewport.height - window.visualViewport.offsetTop}px`;
                }
            });
        }
        
        // 强化输入框焦点处理
        messageInput.addEventListener('focus', function() {
            console.log('[iOS] 输入框获得焦点');
            
            // 使用iOS键盘辅助元素
            if (keyboardHelper) {
                // 避免iOS Safari的自动滚动行为
                setTimeout(() => {
                    // 聚焦辅助元素再聚焦回输入框，可以触发更一致的键盘行为
                    keyboardHelper.focus();
                    setTimeout(() => {
                        messageInput.focus();
                        
                        // 再次尝试滚动确保可见
                        setTimeout(() => {
                            // 微调滚动以确保输入框可见
                            messageInput.scrollIntoView({block: 'end', behavior: 'smooth'});
                            window.scrollTo(0, 0);
                        }, 300);
                    }, 50);
                }, 100);
            }
            
            // 添加键盘可见标记类
            document.body.classList.add('keyboard-visible');
            document.body.classList.add('ios-keyboard-open');
            
            // 调整输入区域样式以确保它在键盘上方
            inputArea.style.position = 'fixed';
            inputArea.style.bottom = '0';
            inputArea.style.left = '0';
            inputArea.style.right = '0';
            inputArea.style.zIndex = '1000';
            
            // 延迟执行，等待键盘完全显示
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 500);
        });
        
        // 监听输入框失去焦点
        messageInput.addEventListener('blur', function() {
            console.log('[iOS] 输入框失去焦点');
            
            // 短暂延迟然后移除样式
            setTimeout(() => {
                document.body.classList.remove('keyboard-visible');
                document.body.classList.remove('ios-keyboard-open');
                
                inputArea.style.position = '';
                inputArea.style.bottom = '';
                inputArea.style.left = '';
                inputArea.style.right = '';
                inputArea.style.zIndex = '';
                
                chatMessages.style.height = '';
                chatMessages.style.paddingBottom = '';
            }, 100);
        });
        
        // 防止页面回弹效果
        document.addEventListener('touchmove', function(e) {
            if (document.body.classList.contains('ios-keyboard-open')) {
                if (e.target !== messageInput && !inputArea.contains(e.target)) {
                    e.preventDefault();
                }
            }
        }, { passive: false });
        
        // 修复iOS的双击缩放问题
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
            const now = Date.now();
            if (now - lastTouchEnd < 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
        
        // 监听窗口大小变化以检测键盘
        window.addEventListener('resize', () => {
            // 延迟执行，确保视口已更新
            setTimeout(() => {
                iOSKeyboardManager.detectKeyboard();
            }, 50);
        });
        
        // 监听输入时自动调整
        messageInput.addEventListener('input', function() {
            if (iOSKeyboardManager.isKeyboardVisible) {
                // 确保在输入文本时输入框可见
                this.scrollIntoView({block: 'end', behavior: 'smooth'});
            }
        });
    },

    // 应用安卓设备特定修复
    applyAndroidFixes() {
        const messageInput = document.getElementById('messageInput');
        const chatMessages = document.querySelector('.chat-messages');
        const inputArea = document.querySelector('.input-area');
        
        if (!messageInput || !chatMessages || !inputArea) return;
        
        // 安卓键盘弹出时处理
        let initialWindowHeight = window.innerHeight;
        window.addEventListener('resize', () => {
            // 当窗口高度减小时，可能是键盘弹出
            if (window.innerHeight < initialWindowHeight) {
                if (document.activeElement === messageInput) {
                    document.body.classList.add('keyboard-visible');
                    document.body.classList.add('android-keyboard-open');
                    
                    // 动态调整聊天区域高度，为键盘腾出空间
                    const keyboardHeight = initialWindowHeight - window.innerHeight;
                    chatMessages.style.height = `calc(100vh - ${keyboardHeight + inputArea.offsetHeight + 20}px)`;
                    
                    // 确保输入框可见
                    setTimeout(() => {
                        messageInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                }
            } else {
                // 键盘收起时恢复布局
                document.body.classList.remove('keyboard-visible');
                document.body.classList.remove('android-keyboard-open');
                chatMessages.style.height = '';
                initialWindowHeight = window.innerHeight;
            }
        });
        
        // 修复安卓浏览器中的输入框高度计算问题
        messageInput.addEventListener('input', function() {
            // 强制重新计算高度
            setTimeout(() => {
                this.style.height = 'auto';
                this.style.height = Math.min(120, this.scrollHeight) + 'px';
            }, 0);
        });
        
        // 修复安卓Chrome中的底部导航栏问题
        document.documentElement.style.setProperty('--real-viewport-height', `${window.innerHeight}px`);
    },
    
    // 适配不同屏幕大小
    adaptToScreenSize() {
        // 获取设备屏幕信息
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const pixelRatio = window.devicePixelRatio || 1;
        
        // 添加表示屏幕大小类的CSS类
        document.body.classList.remove('tiny-screen', 'small-screen', 'medium-screen', 'large-screen');
        
        if (screenWidth < 320) {
            document.body.classList.add('tiny-screen');
        } else if (screenWidth < 375) {
            document.body.classList.add('small-screen');
        } else if (screenWidth < 768) {
            document.body.classList.add('medium-screen');
        } else {
            document.body.classList.add('large-screen');
        }
        
        // 为高DPI屏幕添加类
        if (pixelRatio >= 3) {
            document.body.classList.add('high-dpi');
        } else if (pixelRatio >= 2) {
            document.body.classList.add('medium-dpi');
        }
        
        // 设置CSS变量以便在样式中使用
        document.documentElement.style.setProperty('--screen-width', `${screenWidth}px`);
        document.documentElement.style.setProperty('--screen-height', `${screenHeight}px`);
        document.documentElement.style.setProperty('--device-pixel-ratio', pixelRatio);
        document.documentElement.style.setProperty('--safe-area-inset-top', '0px');
        document.documentElement.style.setProperty('--safe-area-inset-bottom', '0px');
        
        // 支持设备安全区域
        if (this.isIOS()) {
            // iOS 安全区域
            document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top, 0px)');
            document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom, 0px)');
        } else if (this.isAndroid()) {
            // 安卓设备上，底部安全区域为导航栏高度（估计值）
            const navbarHeight = Math.max(0, window.outerHeight - window.innerHeight);
            document.documentElement.style.setProperty('--safe-area-inset-bottom', `${navbarHeight}px`);
        }
    },
    
    // 处理屏幕方向变化
    handleOrientationChange() {
        const updateLayout = () => {
            // 重新计算布局尺寸
            this.adaptToScreenSize();
            
            // 更新视口高度变量
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            
            // 根据方向调整聊天区域
            if (window.matchMedia("(orientation: portrait)").matches) {
                document.body.classList.add('portrait');
                document.body.classList.remove('landscape');
            } else {
                document.body.classList.add('landscape');
                document.body.classList.remove('portrait');
            }
        };
        
        // 初始设置
        updateLayout();
        
        // 监听方向变化和调整大小事件
        window.addEventListener('orientationchange', updateLayout);
        window.addEventListener('resize', () => {
            // 使用防抖函数避免频繁触发
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(updateLayout, 100);
        });
    },

    // 优化滚动体验
    optimizeScrolling() {
        const chatMessages = document.querySelector('.chat-messages');
        if (!chatMessages) return;

        // 添加惯性滚动
        chatMessages.style.webkitOverflowScrolling = 'touch';
        
        // 确保新消息出现时自动滚动到底部
        const scrollToBottom = () => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };
        
        // 创建一个观察器监视聊天内容的变化
        const observer = new MutationObserver(scrollToBottom);
        observer.observe(chatMessages, { childList: true, subtree: true });
        
        // 初始滚动到底部
        scrollToBottom();
    }
};

// 页面加载完成后初始化移动设备适配
document.addEventListener('DOMContentLoaded', () => {
    MobileAdapter.init();
});

// 防止iOS软键盘弹出时的页面缩放问题
window.addEventListener('resize', () => {
    if (MobileAdapter.isMobile() && document.activeElement.tagName === 'TEXTAREA') {
        // 等待键盘弹出完成
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 300);
    }
});